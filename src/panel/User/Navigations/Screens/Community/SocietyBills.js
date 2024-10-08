import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSocietyBills } from '../../../Redux/Slice/CommunitySlice/SocietyBillsSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
const SocietyBills = () => {
    const dispatch = useDispatch();
    const [societyId, setSocietyId] = useState('');
    const { society } = useSelector((state) => state.societyBills.societyBills);
    const { loading,error} = useSelector((state) => state.societyBills);
    useEffect(() => {
        const getUserName = async () => {
            try {
                const userString = await AsyncStorage.getItem("user");
                if (userString !== null) {
                    const user = JSON.parse(userString);
                    setSocietyId(user.societyId);
                }
            } catch (error) {
                console.error("Failed to fetch the user from async storage", error);
            }
        };

        getUserName();
    }, []);

    useEffect(() => {
        if (societyId) {
            dispatch(fetchSocietyBills(societyId));
        }
    }, [dispatch, societyId]);
    const downloadFile = async (relativeUrl) => {
        try {
            const baseUrl = "http://192.168.29.226:2000";
            const fullUrl = `${baseUrl}${relativeUrl}`;
            const fileName = relativeUrl.split('/').pop();
            const fileUri = FileSystem.documentDirectory + fileName;

            console.log('Attempting to download file from:', fullUrl);
            const { uri } = await FileSystem.downloadAsync(fullUrl, fileUri);
            console.log('File downloaded to:', uri);

            // Request media library permissions
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please grant access to your media library.');
                return;
            }

            // Ensure the file exists
            const fileInfo = await FileSystem.getInfoAsync(fileUri);
            if (!fileInfo.exists) {
                Alert.alert('Error', 'File not found.');
                return;
            }
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
            } else {
                console.log('Sharing is not available on this platform.');
            }
        } catch (error) {
            console.error('File download error:', error.message);
            Alert.alert('Error', 'Failed to download the file.');
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.billContainer}>
            <View style={{ width: "100%", position: 'relative' }}>
                <Image
                    source={{ uri: `https://livinsync.onrender.com${item.pictures}` }}
                    style={styles.billImage}
                    resizeMode="contain"
                />
                <View style={styles.chip}>
                    <Text style={styles.chipText}>{item.status}</Text>
                </View>

                <TouchableOpacity
                    style={styles.shareButton}
                    onPress={() => downloadFile(item.pictures)}
                >
                    <Ionicons name="share-social-outline" size={18} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.header}>
                <Text style={{ fontSize: 20, fontWeight: '600', color: "#202020" }}>{item.monthAndYear}</Text>
            </View>

            <View style={styles.amountContainer}>
                <View>
                    <Text style={{ fontSize: 16, fontWeight: '400', color: "#777" }}>{item.name}</Text>
                    <Text style={{ fontSize: 14, fontWeight: '400', color: "#777" }}>{new Date(item.date).toLocaleDateString()}</Text>
                </View>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>₹{item.amount}</Text>
            </View>
        </View>
    );

    const spinner = () => {
        return (
            <View style={[styles.containerSpin, styles.horizontalSpin]}>
                <ActivityIndicator size="large" color="#7d0431" />
            </View>
        );         
    };

    if (loading === "loading") {
        return spinner(); // Show spinner when loading
    }

    if (error) {
        return <Text>Error: {error}</Text>; // Show error if exists
    }
    return (
        <View style={styles.container}>
            <FlatList
                data={society?.bills || []}
                renderItem={renderItem}
                keyExtractor={item => item._id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    containerSpin: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: "80%"
    },
    horizontalSpin: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    container: {
        flex: 1,
        backgroundColor: "#f6f6f6",
        marginHorizontal: 10,
    },
    billContainer: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#fff',
        elevation: 2,
        marginTop: 10,
    },
    billImage: {
        height: 150,
        width: "100%",
        backgroundColor: "#ddd",
        borderRadius: 10,
    },
    chip: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: '#4caf50', // Green color for paid bills
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        zIndex: 1, // Ensure it appears on top of the image
    },
    shareButton: {
        position: 'absolute',
        bottom: 10, // Adjust the vertical positioning
        right: 10,  // Adjust the horizontal positioning
        backgroundColor: 'rgba(0, 0, 0, 0.08)', // Semi-transparent background
        padding: 8,  // Add some padding around the icon
        borderRadius: 20,  // Make it circular or rounded
    },
    chipText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    amountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
    },
});
export default SocietyBills;
