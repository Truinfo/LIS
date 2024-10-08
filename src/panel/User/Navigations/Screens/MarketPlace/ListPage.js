import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { getSocityAdds } from '../../../Redux/Slice/MarketPlaceSlice/MarketPlace';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FAB } from 'react-native-paper';
// import Icon from 'react-native-vector-icons/MaterialIcons';  // Uncomment if you have the icon library installed
import { ImagebaseURL } from '../../../../Security/helpers/axios';
const ListPage = () => {
    const [societyId, setSocietyId] = useState("");
    const [userId, setUserId] = useState("");
    const navigation = useNavigation()
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.MarketPlace);
    const Properties = useSelector((state) => state.MarketPlace.Properties || []);

    useEffect(() => {
        const getUserName = async () => {
            try {
                const userString = await AsyncStorage.getItem("user");
                if (userString !== null) {
                    const user = JSON.parse(userString);
                    setSocietyId(user.societyId);
                    setUserId(user._id);
                }
            } catch (error) {
                console.error("Failed to fetch the user from async storage", error);
            }
        };
        getUserName();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            if (societyId) {
                dispatch(getSocityAdds(societyId));
            }
        }, [societyId, dispatch]),);

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Property Details", { id: item._id })}>
            {item.pictures && item.pictures.length > 0 ? (
                <Image source={{ uri: `${ImagebaseURL}${item.pictures[0].img}` }} style={styles.image} />
            ) : (
                null
            )}
            <View style={styles.infoContainer}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingRight: 20 }}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={{ color: "#222", fontWeight: 700, fontSize: 20 }}>{item.price}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <Text style={styles.contact}>Price</Text>
                    <Text style={{ color: "#222" }}>: {item.price}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <Text style={styles.contact}>Contact</Text>
                    <Text style={{ color: "#222" }}>: {item.contactNumber}</Text>
                </View>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </TouchableOpacity>
    );
    if (loading) {
        return <Text>loading.</Text>;
    }
    if (Properties.length === 0 && !loading) {
        return <Text>No properties available.</Text>;
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={Properties}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.container}
            />
            <FAB
                style={styles.fab}
                icon="plus"
                color='#fff'
                onPress={() => navigation.navigate("Add Property")}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#f8f8f8',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    image: {
        width: '100%',
        height: 150,
    },
    infoContainer: {
        padding: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5, // Add space between rows if needed
    },
    contact: {
        // Set a fixed width for the contact label
        width: 70, // Adjust the width based on your design
        color: "#222",
        fontWeight: "bold", // Make the contact label bold
    },
    value: {
        color: "#222",
        flex: 1, // This makes the value take the remaining space
    },
    // Floating Action Button (FAB) styling
    fab: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#7d0431',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 20,  // Position from bottom
        right: 20,   // Position from right
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    fabText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default ListPage;
