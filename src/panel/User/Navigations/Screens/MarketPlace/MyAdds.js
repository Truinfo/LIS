import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { ResidentsAdds } from '../../../Redux/Slice/MarketPlaceSlice/MarketPlace';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ImagebaseURL } from '../../../../Security/helpers/axios';

const MyAdds = () => {
    const [societyId, setSocietyId] = useState("");
    const [userId, setUserId] = useState("");
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false); // State for dropdown visibility
    const navigation = useNavigation();
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
            if (userId) {
                dispatch(ResidentsAdds(userId));
            }
        }, [userId, dispatch]),
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Property Details", { id: item._id })}
        >
            {item.pictures && item.pictures.length > 0 ? (
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: `${ImagebaseURL}${item.pictures[0].img}` }}
                        style={styles.image}
                    />
                    <TouchableOpacity onPress={() => toggleMenu(item)} style={styles.menuIcon}>
                        <Icon name="more-vert" size={24} color="#fff" />
                    </TouchableOpacity>
                    {menuVisible && selectedProperty === item && (
                        <View style={styles.dropdownMenu}>
                            <TouchableOpacity onPress={() => handleMenuAction('edit', item._id)}>
                                <Text style={styles.dropdownItem}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleMenuAction('delete', item._id)}>
                                <Text style={styles.dropdownItem}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            ) : null}
            <View style={styles.infoContainer}>
                <Text style={styles.title}>{item.title}</Text>
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

    const toggleMenu = (property) => {
        if (selectedProperty === property) {
            setMenuVisible(!menuVisible);
        } else {
            setSelectedProperty(property);
            setMenuVisible(true);
        }
    };

    const handleMenuAction = (action, propertyId) => {
        if (action === 'edit') {
            navigation.navigate("Edit Property", { id: propertyId });
            setMenuVisible(false); // Close the menu after action
        } else if (action === 'delete') {
            Alert.alert(
                "Delete Property",
                "Are you sure you want to delete this property?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Delete", onPress: () => {
                            // Add delete logic here
                            console.log(`Deleting property with ID: ${propertyId}`);
                            setMenuVisible(false); // Close the menu after action
                        }
                    },
                ]
            );
        }
    };

    if (loading) {
        return <Text>Loading.</Text>;
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
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 150,
    },
    menuIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 5,
    },
    dropdownMenu: {
        position: 'absolute',
        top: 40, // Adjust based on your design
        right: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        elevation: 4,
        zIndex: 1,
    },
    dropdownItem: {
        padding: 10,
        color: '#333',
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
    contact: {
        width: 70,
        color: "#222",
        fontWeight: "bold",
    },
    fab: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#7d0431',
        right: 16,
        bottom: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MyAdds;
