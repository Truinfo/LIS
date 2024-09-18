import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSocietyBills } from '../../../Redux/Slice/CommunitySlice/SocietyBillsSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList, Image,  StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system'; // Import FileSystem from expo
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
const SocietyBills = () => {
    const dispatch = useDispatch();
    const [societyId, setSocietyId] = useState('');
    const { society } = useSelector((state) => state.societyBills.societyBills);

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
            const baseUrl = "https://livinsync.onrender.com";
            const fullUrl = `${baseUrl}${relativeUrl}`;
            const fileName = relativeUrl.split('/').pop();
            const fileUri = FileSystem.documentDirectory + fileName;
            const { uri } = await FileSystem.downloadAsync(fullUrl, fileUri);

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
            <View style={{ width: "100%" }}>
                <Image
                    source={{ uri: `https://livinsync.onrender.com${item.pictures}` }}
                    style={{ height: 200, width: "100%" ,backgroundColor:"#ddd",borderRadius:10}}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.header}>
                <Text style={{ fontSize: 20, fontWeight: '600' }}>{item.monthAndYear}</Text>
                <View style={styles.chip}>
                    <Text style={styles.chipText}>{item.status}</Text>
                </View>
            </View>
            <Text style={{ fontSize: 16, fontWeight: '500', color: "#777" }}>{item.name}</Text>
            <Text style={{ fontSize: 14, fontWeight: '500', color: "#777" }}>{new Date(item.date).toLocaleDateString()}</Text>
            <View style={styles.amountContainer}>
                <Text style={{ fontSize: 18, fontWeight: '600' }}>₹{item.amount}</Text>
                <TouchableOpacity
                    style={styles.downloadButton}
                    onPress={() => downloadFile(item.pictures)}
                >
                    <Text style={{ color: "#ffffff", fontWeight: 500 }}>Share File</Text>
                </TouchableOpacity>
            </View>

        </View>
    );

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
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
    },
    billContainer: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    chip: {
        backgroundColor: '#4caf50', // Green color for paid bills
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    chipText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    amountContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        marginTop: 5,
    },
    downloadButton: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#7d0431",
    }
});

export default SocietyBills;
