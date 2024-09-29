import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { createAmenity } from './AmenitiesSlice';
import * as ImagePicker from 'expo-image-picker'; // Using Expo Image Picker for image selection

const AddAmenity = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    societyId: '6683b57b073739a31e8350d0',
    amenityName: "",
    capacity: "",
    timings: "",
    location: "",
    cost: "",
    status: "",
    image: null,
    picturePreview: null,
  });

  const [errors, setErrors] = useState({});
  const successMessage = useSelector((state) => state.adminAmenities.successMessage || state.adminAmenities.error);

  const statusOptions = ['Available', 'Booked'];

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async () => {
    // Request permission for camera roll access
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    // Open the image picker
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      const selectedImage = result.assets[0];
      setFormData(prevFormData => ({
        ...prevFormData,
        image: selectedImage.uri,
        picturePreview: selectedImage.uri,
      }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (!formData[key] && key !== 'image' && key !== 'picturePreview' && key !== 'cost' && key !== 'capacity') {
        newErrors[key] = 'This field is required';
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const submissionData = new FormData();
    submissionData.append('societyId', formData.societyId);
    submissionData.append('amenityName', formData.amenityName);
    submissionData.append('timings', formData.timings);
    submissionData.append('location', formData.location);
    submissionData.append('status', formData.status);
    if (formData.cost) {
      submissionData.append('cost', formData.cost);
    }
    if (formData.image) {
      submissionData.append('image', {
        uri: formData.image,
        type: 'image/jpeg', // adjust according to your image type
        name: 'amenity_image.jpg', // you can also get the actual name from the picker
      });
    }

    dispatch(createAmenity(submissionData)).then((response) => {
      if (response.meta.requestStatus === 'fulfilled') {
        setFormData({
          societyId: '6683b57b073739a31e8350d0',
          amenityName: "",
          capacity: "",
          timings: "",
          location: "",
          cost: "",
          status: "",
          image: null,
          picturePreview: null,
        });
        Alert.alert("Success", successMessage);
        navigation.goBack(); // Adjust the route name according to your navigation setup
      } else {
        Alert.alert("Error", successMessage);
      }
    }).catch((error) => {
      console.error('Error:', error);
      Alert.alert("Error", "There was an error creating the amenity.");
    });
  };

  useEffect(() => {
    return () => {
      // Clean up URLs to avoid memory leaks if needed
    };
  }, [formData.picturePreview]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Amenity</Text>
      <TextInput
        style={styles.input}
        placeholder='Amenity Name'
        value={formData.amenityName}
        onChangeText={(value) => handleChange('amenityName', value)}
      />
      {errors.amenityName && <Text style={styles.error}>{errors.amenityName}</Text>}

      <TextInput
        style={styles.input}
        placeholder='Capacity'
        keyboardType='numeric'
        value={formData.capacity}
        onChangeText={(value) => handleChange('capacity', value)}
      />
      {errors.capacity && <Text style={styles.error}>{errors.capacity}</Text>}

      <TextInput
        style={styles.input}
        placeholder='Timings'
        value={formData.timings}
        onChangeText={(value) => handleChange('timings', value)}
      />
      {errors.timings && <Text style={styles.error}>{errors.timings}</Text>}

      <TextInput
        style={styles.input}
        placeholder='Location'
        value={formData.location}
        onChangeText={(value) => handleChange('location', value)}
      />
      {errors.location && <Text style={styles.error}>{errors.location}</Text>}

      <TextInput
        style={styles.input}
        placeholder='Cost'
        value={formData.cost}
        onChangeText={(value) => handleChange('cost', value)}
      />
      {errors.cost && <Text style={styles.error}>{errors.cost}</Text>}

      <Text style={styles.label}>Status</Text>
      {statusOptions.map((status) => (
        <TouchableOpacity
          key={status}
          style={styles.option}
          onPress={() => handleChange('status', status)}
        >
          <Text style={formData.status === status ? styles.selectedOption : styles.optionText}>{status}</Text>
        </TouchableOpacity>
      ))}
      {errors.status && <Text style={styles.error}>{errors.status}</Text>}

      {/* Image Preview above the Upload Image button */}
      {formData.picturePreview && (
        <Image
          source={{ uri: formData.picturePreview }}
          style={styles.imagePreview}
        />
      )}

      <Button title="Upload Image" onPress={handleFileChange} />
      <View style={{ marginTop: 30 }}>
        <Button title="Submit" onPress={handleSubmit} style={styles.submitButton} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#630000',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    fontSize: 12,
  },
  label: {
    fontWeight: 'bold',
    marginVertical: 10,
  },
  option: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 5,
    borderRadius: 4,
  },
  selectedOption: {
    backgroundColor: '#630000',
    color: '#fff',
  },
  optionText: {
    color: '#630000',
  },
  imagePreview: {
    width: 250,
    height: 200,
    marginVertical: 10,
  },
  submitButton: {
    marginTop: 30,
  },
});

export default AddAmenity;
