import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert, StyleSheet, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createAdvertisements } from './AdvertisementSlice';
import { fetchResidentProfile } from './profileSlice';
import Dialog from 'react-native-dialog';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from "expo-image-picker";
const AddAdvertisements = ({ navigation }) => {
  const dispatch = useDispatch();
  const [societyId, setSocietyID] = useState([]);
  const fetchSocietyId = async () => {
    const storedAdmin = await AsyncStorage.getItem("societyAdmin");
    const societyAdmin = JSON.parse(storedAdmin) || {};
    return societyAdmin._id || "6683b57b073739a31e8350d0";
  };

  const [formData, setFormData] = useState({
    societyId: societyId,
    adv: "",
    phoneNumber: "",
    userName: "",
    status: "",
    details: {
      block: '',
      flat_No: '',
      flat_Area: '',
      rooms: '',
      washrooms: '',
      price: '',
      maintainancePrice: '',
      parkingSpace: '',
    },
    pictures: [],
    picturePreviews: [],
  });

  const profileData = useSelector(state => state.adminProfile.profile);
  const [blockOptions, setBlockOptions] = useState([]);
  const [flatOptions, setFlatOptions] = useState([]);

  const [errors, setErrors] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const successMessage = useSelector((state) => state.advertisements.successMessage || state.advertisements.error);
  const ErrorMessage = useSelector((state) => state.advertisements.error);
  const statusOptions = ['Occupied', 'Unoccupied'];
  const roomOptions = ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK'];

  useEffect(async () => {
    dispatch(fetchResidentProfile());
    setSocietyID(await fetchSocietyId())
  }, [dispatch]);

  useEffect(() => {
    if (profileData.blocks) {
      setBlockOptions(profileData.blocks.map(block => block.blockName));
    }
  }, [profileData.blocks]);

  useEffect(() => {
    const selectedBlock = profileData.blocks && profileData.blocks.find(block => block.blockName === formData.details.block);
    if (selectedBlock) {
      setFlatOptions(selectedBlock.flats.map(flat => flat.flatNumber));
    } else {
      setFlatOptions([]);
    }
  }, [formData.details.block, profileData.blocks]);

  const handleChange = (name, value) => {
    if (name.startsWith('details.')) {
      const detailsKey = name.split('.')[1];
      setFormData(prevFormData => ({
        ...prevFormData,
        details: {
          ...prevFormData.details,
          [detailsKey]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (newPictures) => {
    if (newPictures.length + formData.pictures.length > 5) {
      Alert.alert("You can upload a maximum of 5 pictures.");
      return;
    }

    const updatedPictures = [...formData.pictures, ...newPictures];
    const updatedPicturePreviews = newPictures.map(file => file.uri);

    setFormData(prevFormData => ({
      ...prevFormData,
      pictures: updatedPictures.slice(-5),  // Keep only the last 5 pictures
      picturePreviews: [...prevFormData.picturePreviews, ...updatedPicturePreviews].slice(-5),
    }));
  };

  const handleSubmit = async () => {
    const newErrors = {};

    // Validate form data
    Object.keys(formData).forEach(key => {
      if (!formData[key] && key !== 'details' && key !== 'pictures') {
        newErrors[key] = 'This field is required';
      }
    });

    Object.keys(formData.details).forEach(key => {
      if (!formData.details[key]) {
        newErrors[`details.${key}`] = 'This field is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare form data for submission
    const submissionData = new FormData();
    submissionData.append('societyId', formData.societyId);
    submissionData.append('adv', formData.adv);
    submissionData.append('userName', formData.userName);
    submissionData.append('status', formData.status);
    submissionData.append('phoneNumber', formData.phoneNumber);

    // Details must be sent as a JSON string
    submissionData.append('details', JSON.stringify(formData.details));
    // Append pictures (files)
    formData.pictures.forEach((picture) => {
      submissionData.append('pictures', {
        uri: picture.uri,
        type: picture.type,
        name: picture.name,
      });
    });
    // Dispatch or make an API call
    dispatch(createAdvertisements(submissionData))
      .then((response) => {
        if (response.meta.requestStatus === 'fulfilled') {
          // Handle success (reset form, show message, etc.)
          setDialogMessage('Advertisement added successfully!');
          setShowDialog(true);
          // Reset form
          setFormData({
            societyId: '',
            adv: "",
            phoneNumber: "",
            userName: "",
            status: "",
            details: {
              block: '',
              flat_No: '',
              flat_Area: '',
              rooms: '',
              washrooms: '',
              price: '',
              maintainancePrice: '',
              parkingSpace: '',
            },
            pictures: [],
            picturePreviews: [],
          });
          setTimeout(() => {
            setShowDialog(false);
            navigation.navigate("Advertisements");
          }, 2000);
        } else {
          // Handle failure
          setDialogMessage('Failed to add advertisement. Please try again.');
          setShowDialog(true);
          setTimeout(() => {
            setShowDialog(false);
          }, 2000);
        }
      }).catch(() => {
        // Handle errors
        setDialogMessage('Error occurred while submitting. Please try again.');
        setShowDialog(true);
        setTimeout(() => {
          setShowDialog(false);
        }, 2000);
      });
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
      if (!result.canceled) {
        const selectedImages = result.assets.map(asset => ({
          uri: asset.uri,
          name: asset.uri.split("/").pop(),
          type: "image/jpeg",
        }));

        // Call handleFileChange to update state
        handleFileChange(selectedImages);
      } else {
        Alert.alert("Cancelled", "Image selection was cancelled.");
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "An error occurred while picking the image.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.adv}
            onValueChange={(itemValue) => handleChange('adv', itemValue)}
            style={styles.picker} // This might not apply styles properly
          >
            <Picker.Item label="Select Advertisement" value="" />
            <Picker.Item label="Rent" value="Rent" />
            <Picker.Item label="Sale" value="Sale" />
          </Picker>
        </View>
        <TextInput placeholder="User Name" value={formData.userName} onChangeText={(text) => handleChange('userName', text)} style={styles.input} />
        <TextInput placeholder="Mobile Number" value={formData.phoneNumber} onChangeText={(text) => handleChange('phoneNumber', text)} style={styles.input} />
        <View style={styles.pickerContainer}>
          <Picker selectedValue={formData.status} onValueChange={(itemValue) => handleChange('status', itemValue)} style={styles.picker}>
            <Picker.Item label="Select Status" value="" />
            {statusOptions.map(status => <Picker.Item key={status} label={status} value={status} />)}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={formData.details.block} onValueChange={(itemValue) => handleChange('details.block', itemValue)} style={styles.picker}>
            <Picker.Item label="Select Block" value="" />
            {blockOptions.map(block => <Picker.Item key={block} label={block} value={block} />)}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={formData.details.flat_No} onValueChange={(itemValue) => handleChange('details.flat_No', itemValue)} style={styles.picker}>
            <Picker.Item label="Select Flat Number" value="" />
            {flatOptions.map(flat => <Picker.Item key={flat} label={flat} value={flat} />)}
          </Picker>
        </View>
        <TextInput placeholder="Flat Area" value={formData.details.flat_Area} onChangeText={(text) => handleChange('details.flat_Area', text)} style={styles.input} />
        <View style={styles.pickerContainer}>
          <Picker selectedValue={formData.details.rooms} onValueChange={(itemValue) => handleChange('details.rooms', itemValue)} style={styles.picker}>
            <Picker.Item label="Select Rooms" value="" />
            {roomOptions.map(room => <Picker.Item key={room} label={room} value={room} />)}
          </Picker>
        </View>
        <TextInput placeholder="Washrooms" value={formData.details.washrooms} onChangeText={(text) => handleChange('details.washrooms', text)} style={styles.input} />
        <TextInput placeholder="Price" value={formData.details.price} onChangeText={(text) => handleChange('details.price', text)} style={styles.input} />
        <TextInput placeholder="Maintenance Price" value={formData.details.maintainancePrice} onChangeText={(text) => handleChange('details.maintainancePrice', text)} style={styles.input} />
        <TextInput placeholder="Parking Space" value={formData.details.parkingSpace} onChangeText={(text) => handleChange('details.parkingSpace', text)} style={styles.input} />
        {/* Button to pick images */}
        <Button title="Add Images" onPress={handleImagePick} />
        <View style={styles.imagePreviewContainer}>
          {formData.picturePreviews.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.imagePreview} />
          ))}

        </View>

        <Button title="Add" onPress={handleSubmit} color="#841584" />
      </View>
      <Dialog.Container visible={showDialog}>
        <Dialog.Title>Advertisement</Dialog.Title>
        <Dialog.Description>{!ErrorMessage ? successMessage : ErrorMessage}</Dialog.Description>
        <Dialog.Button label="OK" onPress={() => setShowDialog(false)} />
      </Dialog.Container>
    </ScrollView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    backgroundColor: '#fefefe', // Light background for the picker
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: '#fefefe',
  },
  picker: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    backgroundColor: '#fefefe',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  imagePreview: {
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 10,
  },
});

export default AddAdvertisements;
