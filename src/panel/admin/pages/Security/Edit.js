import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getSequrityPerson, updateSequrity } from './GateKeeperSlice';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import { ImagebaseURL } from '../../../Security/helpers/axios';

const EditSecurity = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { sequrityId } = route.params;

  const profile = useSelector((state) => state.gateKeepers.sequrity);
  const aadharNumber =profile.aadharNumber
  const successMessage = useSelector((state) => state.gateKeepers.successMessage);
console.log("aadharNumber", aadharNumber)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    role: 'Security',
    aadharNumber: '',
    address: {
      addressLine1: '',
      addressLine2: '',
      state: '',
      postalCode: '',
    },
    picture: null,
  });

  const [previewImage, setPreviewImage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    dispatch(getSequrityPerson(sequrityId));
  }, [dispatch, sequrityId]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        role: profile.role,
        aadharNumber: profile.aadharNumber,
        address: {
          addressLine1: profile.address?.addressLine1 || '',
          addressLine2: profile.address?.addressLine2 || '',
          state: profile.address?.state || '',
          postalCode: profile.address?.postalCode || '',
        },
        picture: null,
      });
      setPreviewImage(`${ImagebaseURL}${profile.pictures}`);
    }
  }, [profile]);

  const handleChange = (name, value) => {
    if (name.startsWith('address.')) {
      const addressKey = name.split('.')[1];
      setFormData(prevFormData => ({
        ...prevFormData,
        address: {
          ...prevFormData.address,
          [addressKey]: value,
        },
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleImagePicker = async (source) => {
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    };

    let result;
    if (source === 'camera') {
      result = await ImagePicker.launchCameraAsync(options);
    } else {
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setFormData(prevData => ({
        ...prevData,
        picture: { uri, name: uri.split('/').pop(), type: 'image/jpeg' },
      }));
      setPreviewImage(uri);
    }
  };

  const handleSubmit = async () => {
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'address') {
        Object.keys(formData[key]).forEach(nestedKey => {
          data.append(`address[${nestedKey}]`, formData[key][nestedKey]);
        });
      } else if (key === 'picture' && formData[key]) {
        data.append('picture', formData[key]);
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      await dispatch(updateSequrity({ sequrityId, formData: data }));
      Toast.show({
        text1: 'Success',
        text2: successMessage || 'Security updated successfully!',
        type: 'success',
        position: 'top',
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error:", error);
      Toast.show({
        text1: 'Error',
        text2: 'Failed to update security. Please try again.',
        type: 'error',
        position: 'top',
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          placeholder='Name'
          value={formData.name}
          onChangeText={(value) => handleChange('name', value)}
          style={styles.input}
        />
        <TextInput
          placeholder='Email'
          value={formData.email}
          onChangeText={(value) => handleChange('email', value)}
          style={styles.input}
        />
        <TextInput
          placeholder='Mobile Number'
          value={formData.phoneNumber}
          onChangeText={(value) => handleChange('phoneNumber', value)}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          placeholder='Aadhar Number'
          value={formData.aadharNumber}
          onChangeText={(value) => handleChange('aadharNumber', value)}
          style={styles.input}
          keyboardType="numeric"
        />
        
        {/* Address Fields */}
        <TextInput
          placeholder='Address Line 1'
          value={formData.address.addressLine1}
          onChangeText={(value) => handleChange('address.addressLine1', value)}
          style={styles.input}
        />
        <TextInput
          placeholder='Address Line 2'
          value={formData.address.addressLine2}
          onChangeText={(value) => handleChange('address.addressLine2', value)}
          style={styles.input}
        />
        <TextInput
          placeholder='State'
          value={formData.address.state}
          onChangeText={(value) => handleChange('address.state', value)}
          style={styles.input}
        />
        <TextInput
          placeholder='Postal Code'
          value={formData.address.postalCode}
          onChangeText={(value) => handleChange('address.postalCode', value)}
          style={styles.input}
        />

        {/* Preview Image */}
        {previewImage ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: previewImage }} style={styles.image} />
          </View>
        ) : null}

        {/* Image Picker Modal */}
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.imageButton}>
          <Text style={styles.imageButtonText}>Choose Image</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Update Security Person</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Image Source</Text>
              <TouchableOpacity onPress={() => handleImagePicker('gallery')} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Pick from Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleImagePicker('camera')} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Take a Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  form: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  imageButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  imageButtonText: {
    color: 'white',
  },
  imageContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
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
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  modalButton: {
    padding: 10,
  },
  modalButtonText: {
    textAlign: 'center',
  },
});

export default EditSecurity;
