import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServicePersonById, updateServicePerson, deleteUserService } from './ServicesSlice';
import { View, Alert, ScrollView, TouchableOpacity, Modal, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Text, TextInput, Button, IconButton, Avatar } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ImagebaseURL } from '../../../Security/helpers/axios';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const timingOptions = [
    "10:00 to 11:00", "11:00 to 12:00", "12:00 to 13:00", "13:00 to 14:00",
    "14:00 to 15:00", "15:00 to 16:00", "16:00 to 17:00", "17:00 to 18:00",
    "18:00 to 19:00", "19:00 to 20:00"
];
const EditService = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute();
    const { userid, serviceType } = route.params;

    const societyId = "6683b57b073739a31e8350d0";
    const [updatedData, setUpdatedData] = useState({
        name: '',
        phoneNumber: '',
        address: '',
        timings: [],
        pictures: '',
        qrImages: '',
        list: [],
    });

    const [newPicturesFile, setNewPicturesFile] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTimings, setSelectedTimings] = useState([]);
    const profile = useSelector((state) => state.staff.data);
    const successMessage = useSelector((state) => state.staff.successMessage);

    useEffect(() => {
        if (serviceType && userid) {
            dispatch(fetchServicePersonById({ serviceType, userid }));
        }
    }, [dispatch, serviceType, userid]);

    useEffect(() => {
        if (profile) {
            console.log('Fetched Profile:', profile); // Log the profile to check its structure
            setUpdatedData({
                name: profile.name || '',
                phoneNumber: profile.phoneNumber || '',
                address: profile.address || '',
                timings: profile.timings || [],
                pictures: profile.pictures || '',
                qrImages: profile.qrImages || '',
                list: profile.list || [],
            });
            setSelectedTimings(profile.timings || []);
        }
    }, [profile]);


    const handleInputChange = (name, value) => {
        setUpdatedData({
            ...updatedData,
            [name]: value,
        });
    };

    const toggleTiming = (timing) => {
        setSelectedTimings((prev) =>
            prev.includes(timing) ? prev.filter(t => t !== timing) : [...prev, timing]
        );
    };
    const handleUpdate = () => {
        if (serviceType && userid) {
            // Update timings in updatedData before submitting
            const updatedFormData = {
                ...updatedData,
                timings: selectedTimings, // Ensure timings are set from selectedTimings
            };

            const { name, phoneNumber, address, timings } = updatedFormData;
            const formData = new FormData();
            formData.append('societyId', societyId);
            formData.append('serviceType', serviceType);
            formData.append('userid', userid);
            formData.append('name', name);
            formData.append('phoneNumber', phoneNumber);
            formData.append('address', address);

            timings.forEach((timing) => {
                formData.append('timings', timing);
            });

            if (newPicturesFile) {
                const fileToUpload = {
                  uri: newPicturesFile.uri,
                  name: 'picture.jpg',
                  type: 'image/jpeg',
                };
                formData.append('pictures', fileToUpload);
              }
            dispatch(updateServicePerson(formData))
                .then((response) => {
                    if (response.type === 'staff/updateServicePerson/fulfilled') {
                        Alert.alert("Success", response.type);
                        // Fetch updated service person information
                        dispatch(fetchServicePersonById({ serviceType, userid }));
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    };


    // const handleUpdate = () => {
    //     if (serviceType && userid) {
    //         const { name, phoneNumber, address, timings } = updatedData;
    //         const formData = new FormData();
    //         formData.append('societyId', societyId);
    //         formData.append('serviceType', serviceType);
    //         formData.append('userid', userid);
    //         formData.append('name', name);
    //         formData.append('phoneNumber', phoneNumber);
    //         formData.append('address', address);

    //         timings.forEach((timing) => {
    //             formData.append('timings', timing);
    //         });

    //         if (newPicturesFile) {
    //             formData.append('pictures', newPicturesFile);
    //         }

    //         dispatch(updateServicePerson(formData))
    //             .then((response) => {
    //                 // Check if the response type matches
    //                 if (response.type === 'staff/updateServicePerson/fulfilled') {
    //                     Alert.alert("Success", response.type);
    //                     // Fetch updated service person information
    //                     dispatch(fetchServicePersonById({ serviceType, userid }));
    //                 }
    //             })
    //             .catch((error) => {
    //                 console.error("Error:", error);
    //             });
    //     }
    // };
    const handleUpdateTimings = () => {
        setUpdatedData({ ...updatedData, timings: selectedTimings });
        setModalVisible(false);
    };
    const handleImagePick = async () => {
        Alert.alert(
            'Select Image Source',
            'Choose an option to upload an image:',
            [
                {
                    text: 'Camera',
                    onPress: () => pickImage(ImagePicker.launchCameraAsync),
                },
                {
                    text: 'Gallery',
                    onPress: () => pickImage(ImagePicker.launchImageLibraryAsync),
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ]
        );
    };

    const pickImage = async (launchFunction) => {
        let result = await launchFunction({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setNewPicturesFile(result.assets[0].uri); // Store the URI for use in the image upload
            setNewPicturesFile(result.assets[0]); // Store the asset for form submission
        }
    };

    const handleDeleteListItem = (itemIndex) => {
        if (serviceType && userid) {
            const userIdToDelete = updatedData.list[itemIndex].userId;
            dispatch(deleteUserService({ societyId, userid, userIdToDelete, serviceType }))
                .then(() => {
                    Alert.alert("Deleted", "Item deleted successfully");
                    dispatch(fetchServicePersonById({ serviceType, userid }));
                })
                .catch((error) => {
                    console.error('Deletion failed:', error);
                });
        }
    };
    console.log(userid)
    return (
        <ScrollView style={{ padding: 20 }}>
            <View>
                {profile && (
                    <View>
                        {console.log(profile, "profile")}
                        <View style={styles.avatarContainer}>
                            <Avatar.Image
                                size={120}
                                source={{ uri: newPicturesFile ? newPicturesFile : `${ImagebaseURL}${updatedData.pictures}` }}
                                style={styles.avatar}
                            />
                            <TouchableOpacity style={styles.cameraButton} onPress={handleImagePick}>
                                <Ionicons name="camera" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                        {/* <Avatar.Image
                            source={{ uri: newPicturesFile ? URL.createObjectURL(newPicturesFile) : `${ImagebaseURL}${updatedData.pictures}` }}
                            size={100}
                            style={{ borderRadius: 50, marginBottom: 20, alignSelf: "center" }}
                        /> */}
                        <TextInput
                            label="Service Type"
                            mode="outlined"
                            value={serviceType}
                            disabled={true}
                            style={{ marginBottom: 10 }}
                        />
                        <TextInput
                            label="Name"
                            value={updatedData.name}
                            onChangeText={(text) => handleInputChange('name', text)}
                            mode="outlined"
                            style={{ marginBottom: 10 }}
                        />
                        <TextInput
                            label="Mobile Number"
                            value={updatedData.phoneNumber}
                            onChangeText={(text) => handleInputChange('phoneNumber', text)}
                            mode="outlined"
                            style={{ marginBottom: 10 }}
                        />
                        <TextInput
                            label="Address"
                            value={updatedData.address}
                            onChangeText={(text) => handleInputChange('address', text)}
                            mode="outlined"
                            style={{ marginBottom: 10 }}
                        />
                        <View style={styles.formGroup}>
                            <TouchableOpacity onPress={() => setModalVisible(true)}>
                                <Text style={styles.addButtonText}>Add Timing +</Text>
                            </TouchableOpacity>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                style={styles.chipScrollView}
                            >
                                {selectedTimings.length > 0 && (
                                    <View style={styles.chipContainer}>
                                        {selectedTimings.map((timing, index) => (
                                            <View key={index} style={styles.chip}>
                                                <Text style={styles.chipText}>{timing}</Text>
                                                <TouchableOpacity onPress={() => setSelectedTimings(prev => prev.filter(t => t !== timing))}>
                                                    <Icon name="close" size={20} color="#7d0431" />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </ScrollView>
                        </View>

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => setModalVisible(false)}
                        >
                            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                                <View style={styles.modalContainer}>
                                    <TouchableWithoutFeedback>
                                        <View style={styles.modalView}>
                                            <Text style={styles.modalTitle}>Select Timings</Text>
                                            {timingOptions.map(option => (
                                                <TouchableOpacity key={option} onPress={() => toggleTiming(option)}>
                                                    <Text style={[styles.optionText, selectedTimings.includes(option) && styles.selectedOption]}>
                                                        {option}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                            <TouchableOpacity onPress={handleUpdateTimings}>
                                                <Text style={styles.closeButtonText}>Update Timings</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                                <Text style={styles.closeButtonText}>Close</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </TouchableWithoutFeedback>
                        </Modal>


                        <Button mode="contained" onPress={handleUpdate} style={{ marginTop: 20 }}>
                            Update
                        </Button>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default EditService;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
    },
    optionText: {
        fontSize: 16,
        paddingVertical: 5,
    },
    selectedOption: {
        fontWeight: 'bold',
        color: '#7d0431', // Selected option color
    },
    closeButtonText: {
        marginTop: 10,
        color: 'red',
    },
    timingText: {
        fontSize: 16,
        paddingVertical: 2,
    },
    chipScrollView: {
        maxHeight: 160,
        overflow: 'scroll',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    chip: {
        backgroundColor: '#ddd',
        borderRadius: 16,
        padding: 8,
        margin: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    chipText: {
        marginRight: 8,
        color: '#333',
    },
    chipRemoveText: {
        color: '#7d0431',
        fontWeight: 'bold',
        fontSize: 16,
    },
    avatarContainer: {
        alignSelf: 'center',
        marginBottom: 20,
        position: 'relative', // Needed for positioning camera button
    },
    avatar: {
        alignSelf: 'center',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Your primary color
        borderRadius: 50,
        padding: 5,
    },
})