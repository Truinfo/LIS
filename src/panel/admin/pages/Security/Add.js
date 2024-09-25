import * as ImagePicker from "expo-image-picker";
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Modal } from 'react-native'
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { createSequrity } from './GateKeeperSlice';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddSecurity = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    societyId: '6683b57b073739a31e8350d0',
    name: '',
    email: '',
    phoneNumber: '',
    role: 'Sequrity',
    details: '',
    aadharNumber: '',
    address: {
      addressLine1: '',
      addressLine2: '',
      state: '',
      postalCode: '',
    },
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const successMessage = useSelector((state) => state.gateKeepers.successMessage);
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (name, value) => {
    if (name.startsWith('address.')) {
      const addressKey = name.split('.')[1];
      setFormData((prevFormData) => ({
        ...prevFormData,
        address: {
          ...prevFormData.address,
          [addressKey]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0]?.uri;
      if (uri) {
        setImageFile({ uri, name: uri.split("/").pop(), type: "image/jpeg" });
      }
      setModalVisible(false);
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0]?.uri;
        if (uri) {
          setImageFile({ uri, name: uri.split("/").pop(), type: "image/jpeg" });
        }
      }
      setModalVisible(false);
    } catch (error) {
      console.error("Error launching camera:", error);
    }
  };

  const deletePhoto = () => {
    setImageFile(null);
  };


  const handleAdd = () => {
    const newErrors = {};

    // Required field validation
    Object.keys(formData).forEach((key) => {
      if (!formData[key] && key !== 'details') {
        newErrors[key] = 'This field is required';
      }
    });

    // Address field validation
    Object.keys(formData.address).forEach((key) => {
      if (!formData.address[key]) {
        newErrors[`address.${key}`] = 'This field is required';
      }
    });

    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Mobile number format validation
    const mobileNumberRegex = /^\d{10}$/;
    if (formData.phoneNumber && !mobileNumberRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Mobile number must be 10 digits';
    }

    // Aadhar number format validation
    const aadharNumberRegex = /^\d{12}$/;
    if (formData.aadharNumber && !aadharNumberRegex.test(formData.aadharNumber)) {
      newErrors.aadharNumber = 'Aadhar Number must be 12 digits';
    }

    // Check for errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare submission data
    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'address') {
        submissionData.append(key, formData[key]);
      }
    });
    Object.keys(formData.address).forEach(key => {
      submissionData.append(`address[${key}]`, formData.address[key]);
    });

    if (imageFile) {
      submissionData.append("picture", {
        uri: imageFile.uri,
        name: imageFile.name,
        type: imageFile.type,
      });
    }

    dispatch(createSequrity(submissionData))
      .then((response) => {
        if (response.meta.requestStatus === 'fulfilled') {
          Toast.show({
            text1: 'Success',
            text2: 'Security added successfully!',
            type: 'success',
            autoHide: true,
            visibilityTime: 1000,
          });

          setTimeout(() => {
            navigation.goBack();
          }, 2000);

          setFormData({
            societyId: '6683b57b073739a31e8350d0',
            name: '',
            email: '',
            phoneNumber: '',
            role: 'Security',
            details: '',
            aadharNumber: '',
            address: {
              addressLine1: '',
              addressLine2: '',
              state: '',
              postalCode: '',
            },
            password: '',
          });
          setErrors({});
          setImageFile(null);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.form}>

          <View style={styles.textInputFields}>

            <TextInput
              mode="outlined"
              label="Name"
              value={formData.name}
              onChangeText={(value) => handleChange('name', value)}
              theme={{ colors: { primary: "#7d0431" } }}
              style={styles.textInput}
            />
            {errors.name && <Text style={styles.error}>{errors.name}</Text>}

            <TextInput
              mode="outlined"
              label="Email"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value.toLowerCase())}
              theme={{ colors: { primary: "#7d0431" } }}
              style={styles.textInput}
            />
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <TextInput
              mode="outlined"
              label="Phone Number"
              value={formData.phoneNumber}
              onChangeText={(value) => handleChange('phoneNumber', value)}
              theme={{ colors: { primary: "#7d0431" } }}
              style={styles.textInput}
              keyboardType="numeric"
            />
            {errors.phoneNumber && <Text style={styles.error}>{errors.phoneNumber}</Text>}

            <TextInput
              mode="outlined"
              label="Aadhar Number"
              value={formData.aadharNumber}
              onChangeText={(value) => handleChange('aadharNumber', value)}
              theme={{ colors: { primary: "#7d0431" } }}
              keyboardType="numeric"
              style={styles.textInput}
            />
            {errors.aadharNumber && <Text style={styles.error}>{errors.aadharNumber}</Text>}

            {/* Address Fields */}
            <TextInput
              mode="outlined"
              label="Address Line 1"
              value={formData.address.addressLine1}
              onChangeText={(value) => handleChange('address.addressLine1', value)}
              theme={{ colors: { primary: "#7d0431" } }}
              style={styles.textInput}
            />
            {errors['address.addressLine1'] && <Text style={styles.error}>{errors['address.addressLine1']}</Text>}

            <TextInput
              mode="outlined"
              label="Address Line 2"
              value={formData.address.addressLine2}
              onChangeText={(value) => handleChange('address.addressLine2', value)}
              theme={{ colors: { primary: "#7d0431" } }}
              style={styles.textInput}
            />
            {errors['address.addressLine2'] && <Text style={styles.error}>{errors['address.addressLine2']}</Text>}

            <TextInput
              mode="outlined"
              label="State"
              value={formData.address.state}
              onChangeText={(value) => handleChange('address.state', value)}
              theme={{ colors: { primary: "#7d0431" } }}
              style={styles.textInput}
            />
            {errors['address.state'] && <Text style={styles.error}>{errors['address.state']}</Text>}

            <TextInput
              mode="outlined"
              label="Postal Code"
              value={formData.address.postalCode}
              onChangeText={(value) => handleChange('address.postalCode', value)}
              theme={{ colors: { primary: "#7d0431" } }}
              keyboardType="numeric"
              style={styles.textInput}
            />
            {errors['address.postalCode'] && <Text style={styles.error}>{errors['address.postalCode']}</Text>}

            <TextInput
              mode="outlined"
              label="Password"
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              secureTextEntry={true}
              theme={{ colors: { primary: "#7d0431" } }}
              style={styles.textInput}
            />
            {errors.password && <Text style={styles.error}>{errors.password}</Text>}
          </View>
          {/* Image Preview */}
          {imageFile && (
            <View style={styles.imagePreview}>
              <Image source={{ uri: imageFile.uri }} style={styles.image} />
              <TouchableOpacity onPress={deletePhoto} style={styles.removeImageButton}>
                <Text style={styles.removeImageText}>Remove Image</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.uploadButton}>
            <Text style={styles.uploadButtonText}>{imageFile ? 'Change Profile Photo' : 'Add Profile Photo'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleAdd} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Add Security</Text>
          </TouchableOpacity>
        </View>

        {/* Image Selection Modal */}
        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Image Source</Text>
              <TouchableOpacity onPress={pickImage} style={styles.modalButtonIcon}>
                <Text style={styles.modalButtonText}>Pick from Gallery  </Text>
                <Icon name="photo-library" size={24} color="#7D0431" />
              </TouchableOpacity>
              <TouchableOpacity onPress={takePhoto} style={styles.modalButtonIcon}>
                <Text style={styles.modalButtonText}>Take a Photo  </Text>
                <Icon name="photo-camera" size={24} color="#7D0431" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonCancel} >Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Toast />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  form: {
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  imagePreview: {
    marginBottom: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeImageButton: {
    marginTop: 5,
    padding: 5,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  removeImageText: {
    color: 'white',
  },
  uploadButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#7D0431',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    justifyContent: "center",
    color: '#7D0431'
  },
  modalButtonIcon: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  modalButton: {
    alignItems: 'center',
    marginBottom: 15,
  },
  modalButtonText: {
    fontSize: 16,
  },
  modalButtonCancel: {
    marginTop: 15,
    color: 'red',
    fontSize: 16,
  },
  textInputFields: {
    marginBottom: 20,
  },
  textInput: {
    marginBottom: 8,
  }
});

export default AddSecurity;

