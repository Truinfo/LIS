import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getSequrityPerson, updateSequrity } from './GateKeeperSlice';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Modal } from 'react-native';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import { ImagebaseURL } from '../../../Security/helpers/axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
const EditSecurity = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { sequrityId } = route.params;
  const profile = useSelector((state) => state.gateKeepers.sequrity);
  const successMessage = useSelector((state) => state.gateKeepers.successMessage);
  const status = useSelector((state) => state.gateKeepers.status);
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
      setModalVisible(false);
    }
  };

  const deletePhoto = () => {
    setPreviewImage(null);
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
      });
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      Toast.show({
        text1: 'Error',
        text2: 'Failed to update security. Please try again.',
        type: 'error',
      });
    }
  };
  if (status === 'loading') {
    return <ActivityIndicator size="large" color="#630000" style={styles.loader} />;
}

if (status === 'failed') {
    return <Text style={styles.errorText}>Error: {error}</Text>;
}
  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          mode="outlined"
          label='Name'
          value={formData.name}
          onChangeText={(value) => handleChange('name', value)}
          theme={{ colors: { primary: "#7d0431" } }}
          style={styles.textInput}
        />

        <TextInput
          mode="outlined"
          label='Email'
          value={formData.email}
          onChangeText={(value) => handleChange('email', value)}
          theme={{ colors: { primary: "#7d0431" } }}
          style={styles.textInput}
        />
        <TextInput
          mode="outlined"
          label='Mobile Number'
          value={formData.phoneNumber}
          onChangeText={(value) => handleChange('phoneNumber', value)}
          theme={{ colors: { primary: "#7d0431" } }}
          style={styles.textInput}
          keyboardType="numeric"
        />
        <TextInput
          mode="outlined"
          label='Aadhar Number'
          value={formData.aadharNumber?.toString() || ''}
          onChangeText={(value) => handleChange('aadharNumber', value)}
          theme={{ colors: { primary: "#7d0431" } }}
          style={styles.textInput}
          keyboardType="numeric"
        />

        <TextInput
          mode="outlined"
          label='Address Line 1'
          value={formData.address.addressLine1}
          onChangeText={(value) => handleChange('address.addressLine1', value)}
          theme={{ colors: { primary: "#7d0431" } }}
          style={styles.textInput}
        />
        <TextInput
          mode="outlined"
          label='Address Line 2'
          value={formData.address.addressLine2}
          onChangeText={(value) => handleChange('address.addressLine2', value)}
          theme={{ colors: { primary: "#7d0431" } }}
          style={styles.textInput}
        />
        <TextInput
          mode="outlined"
          label='State'
          value={formData.address.state}
          onChangeText={(value) => handleChange('address.state', value)}
          theme={{ colors: { primary: "#7d0431" } }}
          style={styles.textInput}
        />
        <TextInput
          mode="outlined"
          label='Postal Code'
          value={formData.address.postalCode}
          onChangeText={(value) => handleChange('address.postalCode', value)}
          theme={{ colors: { primary: "#7d0431" } }}
          style={styles.textInput}
        />

        {/* Preview Image */}
        {previewImage ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: previewImage }} style={styles.image} />
            <TouchableOpacity onPress={deletePhoto} style={styles.removeImageButton}>
              <Text style={styles.removeImageText}>Remove Image</Text>
            </TouchableOpacity>
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
            <TouchableOpacity onPress={() => handleImagePicker('gallery')} style={styles.modalButtonIcon}>
            <Text>Pick from Gallery  </Text>
            <Icon name="photo-library" size={24} color="#7D0431" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleImagePicker('camera')} style={styles.modalButtonIcon}>
              <Text>Take a Photo  </Text>
              <Icon name="photo-camera" size={24} color="#7D0431" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonCancel}>Cancel</Text>
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
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
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
    backgroundColor: '#7D0431',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
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
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButton: {
    padding: 10,
  },
  modalButtonText: {
    textAlign: 'center',
  },
  modalButtonCancel: {
    textAlign: 'center',
    color: "#7D0431",
  },
  removeImageButton: {
    marginTop: 8,
    marginBottom: 10,
    padding: 5,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  removeImageText: {
    color: 'white',
  },
  textInputFields: {
    marginBottom: 20,
  },
  textInput: {
    marginBottom: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default EditSecurity;
