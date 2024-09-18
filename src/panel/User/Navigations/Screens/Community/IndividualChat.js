import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-elements";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import socketServices from "../../../Socket/SocketServices"
import people from "../../../../../assets/User/Avatar/user.png";
const IndividualChat = () => {
    const navigation = useNavigation();
    const [chatList, setChatList] = useState([]);
    const societyId = "6683b57b073739a31e8350d0";
    const id = "6694f1e2fef273737d9196c7";
    useEffect(() => {
        // Ensure socket initialization
        socketServices.initializeSocket();
        socketServices.emit('get_resident_individual_chat_list', { id });
        // Handle any errors
        socketServices.on('error', (error) => {
            console.error('Socket error:', error);
        });
        socketServices.on('chat_list_Residents', (chatList) => {
            setChatList(chatList);
        });
        return () => {
            socketServices.removeListener('chat_list_Residents');
            socketServices.removeListener('error');
        };
    }, [societyId])
    const renderItem = ({ item }) => {
        const isSingleParticipant = item.participants.length === 1 && item.participants[0]._id === id;
        const otherParticipant = item.participants.find(participant => participant._id !== id);
        return (
            <TouchableOpacity onPress={() => navigation.navigate("IndividualChatRoom", { item })}>
                <View style={styles.itemContainer}>
                    <Avatar
                        source={people}
                        rounded
                        size={50}
                        containerStyle={styles.avatarContainer}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.name}>
                            {isSingleParticipant ? "Admin" : (otherParticipant ? otherParticipant.name : "")}
                        </Text>
                        <Text style={styles.person}>
                            {item.participants.length === 2 ? otherParticipant.mobileNumber : ""}
                        </Text>
                    </View>
                    <MaterialIcons
                        name="arrow-forward-ios"
                        size={24}
                        color="black"
                        style={styles.icon}
                    />
                </View>
            </TouchableOpacity>
        );
    };
    const ItemSeparator = () => <View style={styles.separator} />;
    return (
        <View style={styles.container}>
            <FlatList
                data={chatList}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                ItemSeparatorComponent={ItemSeparator}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
        padding: 10,
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "lightgray",
    },
    textContainer: {
        marginLeft: 10,
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 15,
    },
    person: {
        fontSize: 14,
        color: "#666",
        marginLeft: 15,
    },
    avatarContainer: {
        borderWidth: 1,
        borderColor: "white",
    },
    icon: {
        marginLeft: "auto",
    },
    separator: {
        height: 10,
    },
});

export default IndividualChat;
