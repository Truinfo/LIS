import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';  // Updated to use useRoute
import { useDispatch, useSelector } from 'react-redux';
import { getOne, updatePaymentDetails } from './SocietyMaintainanceSlice';
import { ImagebaseURL } from '../../../Security/helpers/axios';
import { launchImageLibrary } from 'react-native-image-picker';
import { ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from "expo-image-picker";
const EditAdminMaintaince = () => {
    const route = useRoute();  // Use this to access route params
    const { blockno, flatno, monthAndYear } = route.params;  // Access params via route.params
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { status, error } = useSelector((state) => state.adminMaintainance);
    const maintainance = useSelector(state => state.adminMaintainance.maintainances);
    const successMessage = useSelector(state => state.adminMaintainance.successMessage);
    const [errors, setErrors] = useState({});
    const [showDialog, setShowDialog] = useState(false);
    const societyId = "6683b57b073739a31e8350d0";
    const [previewImage, setPreviewImage] = useState('');
    const [formState, setFormState] = useState({
        societyId: societyId,
        userId: '',
        name: '',
        blockno: '',
        flatno: '',
        paidAmount: '',
        transactionType: 'Cash',
        status: 'Confirm',
        monthAndYear: monthAndYear,
        pictures: null,
    });

    useEffect(() => {

        dispatch(getOne({ blockno, flatno, monthAndYear }));
    }, [dispatch, blockno, flatno, monthAndYear]);

    useEffect(() => {
        if (maintainance) {
            setFormState({
                societyId: societyId,
                userId: maintainance.userId || '',
                name: maintainance.name || '',
                blockno: maintainance.blockno || '',
                flatno: maintainance.flatno || '',
                paidAmount: maintainance.paidAmount || '',
                transactionType: 'Cash',
                status: 'Confirm',
                monthAndYear: monthAndYear,
                pictures: null,
            });
            setPreviewImage(maintainance.pictures);
        }
    }, [maintainance]);

    const handleInputChange = (name, value) => {
        setFormState(prevState => ({ ...prevState, [name]: value }));
    };

    const validateForm = () => {
        let tempErrors = {};
        tempErrors.userId = formState.userId ? "" : "User Id is required.";
        tempErrors.name = formState.name ? "" : "Name is required.";
        tempErrors.paidAmount = formState.paidAmount ? "" : "Amount is required.";
        tempErrors.monthAndYear = formState.monthAndYear ? "" : "Month and Year are required.";
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };

    const handleSubmit = () => {
        if (validateForm()) {
            const { pictures, ...formData } = formState;
            const updateData = new FormData();

            for (const key in formData) {
                updateData.append(key, formData[key]);
            }

            if (pictures && pictures.uri) {
                updateData.append('pictures', {
                    uri: pictures.uri,
                    type: pictures.type,
                    name: pictures.name
                });
            }
            dispatch(updatePaymentDetails({ formData: updateData }))
                .then(() => {
                    setShowDialog(true);
                    setTimeout(() => {
                        setShowDialog(false);
                    }, 2000);
                    dispatch(getOne({ blockno, flatno, monthAndYear }));
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        }
    };
    const handleFileChange = (selectedImages) => {
        if (!selectedImages || selectedImages.length === 0) {
            Alert.alert("No Images Selected", "Please select an image.");
            return;
        }

        const newPicture = {
            uri: selectedImages[0].uri, // Assuming you want the first image
            type: selectedImages[0].type,
            fileName: selectedImages[0].fileName,
        };

        // Set the new image as the only picture in the state
        setPreviewImage(newPicture.uri);
        setFormState(prevData => ({
            ...prevData,
            pictures: newPicture, // Update to hold a single image object
        }));
    };
    const handleImagePick = async () => {
        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
                Alert.alert("Permission Required", "You need to grant permissions to access the gallery.");
                return;
            }

            const options = {
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                allowsMultipleSelection: true, // Allow multiple selection
            };

            const result = await ImagePicker.launchImageLibraryAsync(options);
            if (!result.canceled && result.assets) {
                // Call handleFileChange to update state with selected images
                handleFileChange(result.assets);
            } else {
                Alert.alert("Cancelled", "Image selection was cancelled.");
            }
        } catch (error) {
            console.error("Image picker error:", error);
            Alert.alert("Error", "An error occurred while picking the image.");
        }
    };

    if (status === "loading") {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#7d0431" />
            </View>
        );
    }
    return (
        <View style={{ flex: 1, padding: 20 }}>
            <View style={{ marginBottom: 20 }}>
                <TouchableOpacity onPress={handleImagePick}>

                    <View>
                        <Button onPress={handleImagePick} title="Upload Image" color="#630000" />
                    </View>
                </TouchableOpacity>
                {previewImage ? (
                    <Image
                        source={{ uri: previewImage.startsWith('file:') ? previewImage : `${ImagebaseURL}${previewImage}` }}
                        style={{ width: '100%', height: 200, borderRadius: 10, marginTop: 10 }}
                    />
                ) : null}
            </View>
            <TextInput
                placeholder="User Id"
                value={formState.userId}
                onChangeText={(text) => handleInputChange('userId', text)}
                style={{ borderBottomWidth: 1, borderColor: '#630000', marginBottom: 10, padding: 8 }}
            />
            {errors.userId && <Text style={{ color: 'red' }}>{errors.userId}</Text>}
            <TextInput
                placeholder="Name"
                value={formState.name}
                onChangeText={(text) => handleInputChange('name', text)}
                style={{ borderBottomWidth: 1, borderColor: '#630000', marginBottom: 10, padding: 8 }}
            />
            {errors.name && <Text style={{ color: 'red' }}>{errors.name}</Text>}

            <TextInput
                placeholder="Month And Year"
                value={formState.monthAndYear}
                onChangeText={(text) => handleInputChange('monthAndYear', text)}
                style={{ borderBottomWidth: 1, borderColor: '#630000', marginBottom: 10, padding: 8 }}
                editable={false}
            />
            {errors.monthAndYear && <Text style={{ color: 'red' }}>{errors.monthAndYear}</Text>}

            <TextInput
                placeholder="Block-No"
                value={formState.blockno}
                onChangeText={(text) => handleInputChange('blockno', text)}
                style={{ borderBottomWidth: 1, borderColor: '#630000', marginBottom: 10, padding: 8 }}
                editable={false}
            />

            <TextInput
                placeholder="Flat-No"
                value={formState.flatno}
                onChangeText={(text) => handleInputChange('flatno', text)}
                style={{ borderBottomWidth: 1, borderColor: '#630000', marginBottom: 10, padding: 8 }}
                editable={false}
            />

            <TextInput
                placeholder="Paid Amount"
                value={formState.paidAmount}
                onChangeText={(text) => handleInputChange('paidAmount', text)}
                style={{ borderBottomWidth: 1, borderColor: '#630000', marginBottom: 10, padding: 8 }}
            />
            {errors.paidAmount && <Text style={{ color: 'red' }}>{errors.paidAmount}</Text>}

            <Button title="Submit" color="#630000" onPress={handleSubmit} />

            <Modal
                animationType="slide"
                transparent={true}
                visible={showDialog}
                onRequestClose={() => {
                    setShowDialog(false);
                }}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>{successMessage || "Maintenance Updated"}</Text>
                        <Button title="Close" onPress={() => setShowDialog(false)} color="#630000" />
                    </View>
                </View>
            </Modal>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    backButton: {
        marginBottom: 20,
    },
    backButtonText: {
        fontSize: 20,
        color: '#630000',
    },
    title: {
        fontSize: 23,
        fontWeight: '700',
        color: '#630000',
        marginBottom: 20,
    },
    form: {
        marginTop: 20,
    },
    input: {
        height: 50,
        borderColor: '#630000',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginVertical: 10,
        backgroundColor: '#fff',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
    imagePreview: {
        width: '100%',
        height: 200,
        marginBottom: 20,
        borderRadius: 10,
    },
    uploadButton: {
        backgroundColor: '#fff',
        borderColor: '#630000',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    uploadButtonText: {
        color: '#630000',
        fontWeight: '600',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        color: '#630000',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default EditAdminMaintaince;
