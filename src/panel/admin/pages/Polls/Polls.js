import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { FAB, ProgressBar, RadioButton } from 'react-native-paper';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import socketServices from '../../../User/Socket/SocketServices';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const Polls = () => {
    const [polls, setPolls] = useState([]);
    const [userId, setUserId] = useState("");
    const [societyId, setSocietyId] = useState("");
    const [checkedOption, setCheckedOption] = useState({});
    const [index, setIndex] = useState(0);
    const navigation = useNavigation();
    const [routes] = useState([
        { key: 'active', title: 'Active Polls' },
        { key: 'closed', title: 'Closed Polls' },
    ]);

    useEffect(() => {
        const getUserName = async () => {
            try {
                const userString = await AsyncStorage.getItem("user");
                if (userString !== null) {
                    const user = JSON.parse(userString);
                    setSocietyId(user.societyId);
                    setUserId(user.userId);
                }
            } catch (error) {
                console.error("Failed to fetch the user from async storage", error);
            }
        };
        getUserName();
    }, []);

    useEffect(() => {
        socketServices.initializeSocket();
        socketServices.emit('get_polls_by_society_id', { societyId });

        const handlePollsBySocietyId = (fetchedPolls) => {
            setPolls(fetchedPolls);
            const userVotes = {};
            fetchedPolls.forEach(poll => {
                if (poll.poll && Array.isArray(poll.poll.votes)) {
                    const userVote = poll.poll.votes.find(vote => vote.userId === userId);
                    if (userVote) {
                        userVotes[poll._id] = userVote.selectedOption;
                    }
                }
            });
            setCheckedOption(userVotes);
        };

        const handleVoteUpdate = (data) => {
            alert(data.message);
            setPolls(prevPolls => {
                const updatedPollIndex = prevPolls.findIndex(poll => poll._id === data.votes._id);
                if (updatedPollIndex !== -1) {
                    const updatedPolls = [...prevPolls];
                    updatedPolls[updatedPollIndex] = data.votes;
                    return updatedPolls;
                } else {
                    return prevPolls;
                }
            });
            setCheckedOption(prevState => ({ ...prevState, [data.votes._id]: null }));
        };

        const handleNewPollCreated = (newPoll) => {
            setPolls(prevPolls => [newPoll, ...prevPolls]);
        };

        socketServices.on('polls_by_society_id', handlePollsBySocietyId);
        socketServices.on('vote_update', handleVoteUpdate);
        socketServices.on('new_poll_created', handleNewPollCreated);

        return () => {
            socketServices.removeListener('polls_by_society_id', handlePollsBySocietyId);
            socketServices.removeListener('new_poll_created', handleNewPollCreated);
            socketServices.removeListener('vote_update', handleVoteUpdate);
        };
    }, [societyId, userId]);

    const handleRadioButtonPress = (optionValue, pollId) => {
        setCheckedOption(prevState => ({ ...prevState, [pollId]: optionValue }));
        const data = {
            userId: userId,
            pollId: pollId,
            selectedOption: optionValue
        };
        socketServices.emit('vote_for__polls_by_UserID', data);
    };

    const calculateVotePercentage = (votes, option) => {
        const totalVotes = votes.length;
        const optionVotes = votes.filter(vote => vote.selectedOption === option).length;
        return totalVotes === 0 ? 0 : (optionVotes / totalVotes);
    };
    const handleCreatePoll = () => {
        navigation.navigate('Create Poll'); // Adjust this to your Create Poll screen name
    };

    const isPollExpired = (expDate) => {
        const currentDate = new Date();
        return currentDate > new Date(expDate);
    };
    const ActivePolls = () => {
        const activePolls = polls.filter(item => !isPollExpired(item.poll.expDate));
        return (
            <ScrollView>
                {activePolls.length === 0 ? (
                    // If there are no active polls, show the "No Data Found" image
                    <View style={styles.noDataContainer}>
                        <Image
                            source={require('../../../../assets/Admin/Imgaes/nodatadound.png')} // Replace with your image path
                            style={styles.noDataImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.noDataText}>No More Active Polls </Text>
                    </View>
                ) : (
                    // If there are active polls, render them
                    activePolls.map((item) => (
                        <PollItem key={item._id} item={item} isExpired={false} />
                    ))
                )}
            </ScrollView>
        );
    };
    const ClosedPolls = () => {
        const closedPolls = polls.filter(item => isPollExpired(item.poll.expDate));
        return (
            <ScrollView>
                {closedPolls.length === 0 ? ( // Check if closedPolls is empty
                    <View style={styles.noDataContainer}>
                        <Image
                            source={require('../../../../assets/Admin/Imgaes/nodatadound.png')} // Replace with your image path
                            style={styles.noDataImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.noDataText}>No More Closed Polls </Text>
                    </View>
                ) : (
                    closedPolls.map((item) => (
                        <PollItem key={item._id} item={item} isExpired={true} />
                    ))
                )}
            </ScrollView>
        );
    };



    const PollItem = ({ item, isExpired }) => {
        return (
            <View style={styles.pollContainer}>
                <View>
                    <View style={styles.pollHeader}>
                        <Text style={styles.pollQuestion}>
                            {item.poll.question} <Text style={styles.voteCount}>({item.poll.votes.length} Votes)</Text>
                        </Text>
                        <View style={[styles.statusBadge, { backgroundColor: isExpired ? "#fee2e2" : "#dcfce7" }]}>
                            <Text style={{ color: isExpired ? "#dc2626" : "#22c55e" }}>
                                {isExpired ? "Closed" : "Active"}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.pollDescription}>
                        {item.poll.Description}
                    </Text>
                    {!isExpired ? (
                        item.poll.options.map((option, index) => (
                            <View key={index} style={styles.optionContainer}>
                                <RadioButton
                                    value={option}
                                    status={checkedOption[item._id] === option ? 'checked' : 'unchecked'}
                                    onPress={() => handleRadioButtonPress(option, item._id)}
                                    theme={{ colors: { primary: "#7D0431" } }}
                                />
                                <View style={styles.optionDetails}>
                                    <Text style={styles.optionText}>{option}</Text>
                                    <ProgressBar progress={calculateVotePercentage(item.poll.votes, option)} theme={{ colors: { primary: "#7D0431" } }} style={styles.progressBar} />
                                </View>
                            </View>
                        ))
                    ) : (
                        item.poll.options.map((option, index) => (
                            <View key={index} style={styles.optionContainer}>
                                <View style={styles.optionDetails}>
                                    <ProgressBar progress={calculateVotePercentage(item.poll.votes, option)} theme={{ colors: { primary: "#7D0431" } }} style={styles.progressBar} />
                                    <Text style={styles.optionText}>{option}</Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>
                <View style={styles.separator} />
                <Text style={styles.dateText}>
                    Posted On: {new Date(item.poll.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}, {new Date(item.poll.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <TabView
                navigationState={{ index, routes }}
                renderScene={SceneMap({
                    active: ActivePolls,
                    closed: ClosedPolls,
                })}
                onIndexChange={setIndex}
                initialLayout={{ width: Dimensions.get('window').width }}
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        style={{ backgroundColor: "transparent" }}
                        indicatorStyle={{ backgroundColor: "#7d0431" }}
                        labelStyle={{ color: "#222222", fontWeight: "500" }}
                    />
                )}
            />
            <FAB
                style={styles.fab}
                icon="plus"
                color='#fff'
                onPress={handleCreatePoll}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: "#f6f6f6",
    },
    pollContainer: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#fff",
        borderRadius: 8,
        elevation: 2,
    },
    pollHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    pollQuestion: {
        fontWeight: '700',
        fontSize: 18,
    },
    voteCount: {
        fontSize: 12,
        fontWeight: '400',
        color: "#777",
    },
    statusBadge: {
        padding: 5,
        borderRadius: 10,
        marginTop: 10,
        borderWidth: 1,
        borderColor: "#22c55e",
    },
    pollDescription: {
        fontWeight: '400',
        fontSize: 14,
    },
    optionContainer: {
        flexDirection: 'row',
        paddingVertical: 6,
    },
    optionDetails: {
        flexDirection: "column",
        justifyContent: "center",
        marginLeft: 10,
        flex: 1,
    },
    optionText: {

        fontSize: 14,
    },
    progressBar: {
        height: 5,
        borderRadius: 5,
        marginTop: 5,
    },
    separator: {
        height: 1,
        backgroundColor: "#eaeaea",
        marginVertical: 10,
    },
    dateText: {
        fontSize: 12,
        color: "#777",
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noDataImage: {
        width: 300,
        height: 300,
        marginTop: 100,
        alignItems: "center",
    },
    noDataText: {
        fontSize: 16,
        color: '#7D0431',
        fontWeight: '700',
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#630000',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    }
});

export default Polls;
