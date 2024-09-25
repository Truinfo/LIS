import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { createService } from './ServicesSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Avatar, Snackbar, TextInput } from 'react-native-paper';

const serviceTypes = [
    { label: "Select Service", value: "" },
    { label: "PestClean", value: "pestClean" },
    { label: "Appliance", value: "appliance" },
    { label: "Mechanic", value: "mechanic" },
    { label: "Moving", value: "moving" },
    { label: "Painter", value: "painter" },
    { label: "Electrician", value: "electrician" },
    { label: "Carpenter", value: "carpenter" },
    { label: "Water", value: "water" },
    { label: "Driver", value: "driver" },
    { label: "Paperboy", value: "paperBoy" },
    { label: "Cook", value: "cook" },
    { label: "Maid", value: "maid" },
    { label: "Plumber", value: "plumber" },
    { label: "Milkman", value: "milkMan" }
];

const timingOptions = [
    "10:00 to 11:00", "11:00 to 12:00", "12:00 to 13:00", "13:00 to 14:00",
    "14:00 to 15:00", "15:00 to 16:00", "16:00 to 17:00", "17:00 to 18:00",
    "18:00 to 19:00", "19:00 to 20:00"
];

const societyId = "6683b57b073739a31e8350d0";

const AddService = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [serviceType, setServiceType] = useState('');
    const [name, setName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [address, setAddress] = useState('');
    const [image, setImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTimings, setSelectedTimings] = useState([]);

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('societyId', societyId);
        formData.append('serviceType', serviceType);
        formData.append('name', name);
        formData.append('phoneNumber', mobileNumber);
        formData.append('address', address);
        selectedTimings.forEach(timing => formData.append('timings', timing));
        if (image) {
            formData.append('pictures', {
                uri: image.uri,
                type: image.type,
                name: image.uri.split('/').pop(),
            });
        }
console.log((formData))
        dispatch(createService(formData)).then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
                setSnackbarMessage(`${response.payload.message}`);
                setSnackbarVisible(true);
                setTimeout(() => navigation.navigate("Services"), 3000); // Navigate after 2 seconds
            }
        }).catch((error) => {
            console.error("Error:", error);
        });
    };

    const toggleTiming = (timing) => {
        setSelectedTimings((prevTimings) =>
            prevTimings.includes(timing)
                ? prevTimings.filter(item => item !== timing)
                : [...prevTimings, timing]
        );
    };
    const removeTiming = (timing) => {
        setSelectedTimings(selectedTimings.filter(item => item !== timing));
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
            setImage(result.assets[0].uri); 
            setImage(result.assets[0]); 
        }
    };
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.avatarContainer}>
                <Avatar.Image
                    size={120}
                    source={image ? { uri: image } : require('../../../../assets/User/Avatar/man (2).png')} // Use a placeholder image if there's no image selected
                    style={styles.avatar}
                />
                <TouchableOpacity style={styles.cameraButton} onPress={handleImagePick}>
                    <Icon name="camera" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
                {/* <Text style={styles.label}>Service Type</Text> */}
                <View >
                    <Picker
                        selectedValue={serviceType}
                        onValueChange={(itemValue) => setServiceType(itemValue)}
                        style={styles.picker}
                    >
                        {serviceTypes.map(type => (
                            <Picker.Item key={type.value} label={type.label} value={type.value} />
                        ))}
                    </Picker>
                </View>
            </View>

            <TextInput
                mode="outlined"
                label="Name"
                theme={{ colors: { primary: "#7d0431" } }}
                value={name}
                onChangeText={(text) => setName(text)}
                style={[styles.input, { backgroundColor: '#fff' }]}
            />

            <TextInput
                mode="outlined"
                label="Mobile Number"
                keyboardType="numeric"
                theme={{ colors: { primary: "#7d0431" } }}
                value={mobileNumber}
                onChangeText={(text) => setMobileNumber(text)}
                style={[styles.input, { backgroundColor: '#fff' }]}
            />

            <TextInput
                mode="outlined"
                label="Address"
                value={address}
                theme={{ colors: { primary: "#7d0431" } }}
                onChangeText={(text) => setAddress(text)}
                style={[styles.input, { backgroundColor: '#fff' }]}
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
                                    <TouchableOpacity onPress={() => removeTiming(timing)}>
                                        <Icon name="close" size={20} color="#7d0431" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    )}
                </ScrollView>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Add</Text>
            </TouchableOpacity>
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

                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
                action={{
                    label: 'Dismiss',
                    onPress: () => setSnackbarVisible(false),
                }}
            >
                {snackbarMessage}
            </Snackbar>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
        position: "realtive"
    },
    label: {
        marginBottom: 8,
        fontWeight: 'bold',
        color: '#333',
    },
    input: {
        marginBottom: 10,
    },
    picker: {
        height: 50,
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
    },

    avatarContainer: {
        alignSelf: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    avatar: {
        alignSelf: 'center',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: 50,
        padding: 5,
    },
    addButtonText: {
        color: '#7d0431',
        marginLeft: 10,
        fontWeight: "600",
        fontSize: 16
    },
    submitButton: {
        position: "absolute",
        bottom: 5,
        right: 0,
        marginHorizontal: 10,
        left: 0,
        backgroundColor: '#7d0431',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
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

});

export default AddService;
