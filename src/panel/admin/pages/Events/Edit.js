// EditEvent.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
  Platform,
} from 'react-native';
import { ActivityIndicator, TextInput, Button } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { updateEvent } from './EventSlice';
import { ImagebaseURL } from '../../../Security/helpers/axios'; // Adjust the path as needed
import Icon from 'react-native-vector-icons/MaterialIcons';

const EditEvent = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { eventId } = route.params;

  const events = useSelector(state => state.societyEvents.event);
  const event = events.find((event) => event._id === eventId);
  const successMessage = useSelector((state) => state.societyEvents.successMessage);
  const status = useSelector((state) => state.societyEvents.status);
  const error = useSelector((state) => state.societyEvents.error);

  const [formData, setFormData] = useState({
    name: '',
    startDate: new Date(),
    endDate: new Date(),
    activities: [],
  });

  const [pictures, setPictures] = useState([]); // Existing pictures
  const [uploadedImages, setUploadedImages] = useState([]); // New images
  const [previewImages, setPreviewImages] = useState([]); // Previews for display

  const [modalVisible, setModalVisible] = useState(false);

  // Separate Picker States
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentPickerField, setCurrentPickerField] = useState(null); // 'startDate', 'endDate', 'activity_start', 'activity_end'
  const [currentActivityIndex, setCurrentActivityIndex] = useState(null);
  const [tempDate, setTempDate] = useState(new Date());
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || '',
        startDate: event.startDate ? new Date(event.startDate) : new Date(),
        endDate: event.endDate ? new Date(event.endDate) : new Date(),
        activities: event.activities
          ? event.activities.map(activity => ({
            type: activity.type || '',
            startDate: activity.startDate ? new Date(activity.startDate) : new Date(),
            endDate: activity.endDate ? new Date(activity.endDate) : new Date(),
          }))
          : [],
      });
      setPictures(event.pictures || []);
      const imagePreviews = event.pictures?.map((pic) => `${ImagebaseURL}${pic.img}`) || [];
      setPreviewImages(imagePreviews);
    }
  }, [event]);

  useEffect(() => {
    if (successMessage) {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: successMessage,
      });
      // Optionally navigate back after success
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    }
  }, [successMessage, navigation]);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error,
      });
    }
  }, [error]);

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleActivityChange = (index, field, value) => {
    const updatedActivities = [...formData.activities];
    updatedActivities[index] = { ...updatedActivities[index], [field]: value };
    setFormData({ ...formData, activities: updatedActivities });
  };

  const addActivity = () => {
    setFormData((prevData) => ({
      ...prevData,
      activities: [...prevData.activities, { type: '', startDate: new Date(), endDate: new Date() }],
    }));
  };

  const removeActivity = (index) => {
    const updatedActivities = [...formData.activities];
    updatedActivities.splice(index, 1);
    setFormData({ ...formData, activities: updatedActivities });
  };

  const handleImagePicker = async (source) => {
    const permissionResult =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Toast.show({
        type: 'error',
        text1: 'Permission Denied',
        text2: 'You need to grant camera or gallery permissions.',
      });
      return;
    }

    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    };

    let result;
    if (source === 'camera') {
      result = await ImagePicker.launchCameraAsync(options);
    } else {
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.uri.split('/').pop(),
        type: asset.type || 'image/jpeg', // Adjust if needed
      }));

      // Check if total images exceed 5
      if (uploadedImages.length + selectedImages.length + pictures.length > 5) {
        Toast.show({
          type: 'error',
          text1: 'Image Limit Exceeded',
          text2: 'You can only upload up to 5 images.',
        });
        return;
      }

      setUploadedImages([...uploadedImages, ...selectedImages]);
      setPreviewImages([
        ...previewImages,
        ...selectedImages.map((img) => img.uri),
      ]);
    }
    setModalVisible(false);
  };

  const deleteImage = (index, isExisting = false) => {
    if (isExisting) {
      const updatedPictures = [...pictures];
      updatedPictures.splice(index, 1);
      setPictures(updatedPictures);
      setPreviewImages(
        updatedPictures.map((pic) => `${ImagebaseURL}${pic.img}`)
      );
    } else {
      const imageIndex = index - pictures.length;
      const updatedUploadedImages = [...uploadedImages];
      updatedUploadedImages.splice(imageIndex, 1);
      setUploadedImages(updatedUploadedImages);
      setPreviewImages(updatedUploadedImages.map((img) => img.uri));
    }
  };

  const validateForm = () => {
    let tempErrors = {};
    tempErrors.name = formData.name ? '' : 'Name is required.';
    tempErrors.startDate = formData.startDate ? '' : 'Start date is required.';
    tempErrors.endDate = formData.endDate ? '' : 'End date is required.';
    // Add more validations as needed, e.g., date ranges

    // Validate activities
    formData.activities.forEach((activity, index) => {
      if (!activity.type) {
        tempErrors[`activity_type_${index}`] = 'Title is required.';
      }
      if (!activity.startDate) {
        tempErrors[`activity_startDate_${index}`] = 'Start date is required.';
      }
      if (!activity.endDate) {
        tempErrors[`activity_endDate_${index}`] = 'End date is required.';
      }
    });

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === '');
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('startDate', formData.startDate.toISOString());
      data.append('endDate', formData.endDate.toISOString());
      data.append('activities', JSON.stringify(formData.activities.map(activity => ({
        type: activity.type,
        startDate: activity.startDate.toISOString(),
        endDate: activity.endDate.toISOString(),
      }))));

      // Append new uploaded images
      uploadedImages.forEach((image, index) => {
        data.append('pictures', {
          uri: image.uri,
          name: image.name || `image_${index}.jpg`,
          type: image.type,
        });
      });

      // Optionally, handle removal of existing pictures by sending their IDs or filenames
      // This depends on your backend implementation

      dispatch(updateEvent({ id: eventId, formData: data }));
    } else {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fix the errors before submitting.',
      });
    }
  };

  // Date Picker Handler
  const onChangeDate = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      // Close the date picker without doing anything
      setShowDatePicker(false);
      setCurrentPickerField(null);
      setCurrentActivityIndex(null);
      return;
    }

    const currentDate = selectedDate || tempDate;
    setTempDate(currentDate);
    setShowDatePicker(false);  // Close the date picker immediately

    // Open time picker after a small delay to avoid flicker
    setTimeout(() => setShowTimePicker(true), 100);
  };

  // Time Picker Handler
  const onChangeTime = (event, selectedTime) => {
    if (event.type === 'dismissed') {
      setShowTimePicker(false);
      setCurrentPickerField(null);
      setCurrentActivityIndex(null);
      return;
    }

    const currentTime = selectedTime || tempDate;
    setShowTimePicker(false);

    // Combine date and time
    const combinedDate = new Date(tempDate);
    combinedDate.setHours(currentTime.getHours());
    combinedDate.setMinutes(currentTime.getMinutes());

    setFieldDate(combinedDate);
    setCurrentPickerField(null);
    setCurrentActivityIndex(null);
  };

  const setFieldDate = (date) => {
    const { field, activityIndex } = { field: currentPickerField, activityIndex: currentActivityIndex };
    if (field === 'startDate') {
      setFormData(prevData => ({
        ...prevData,
        startDate: date,
      }));
    } else if (field === 'endDate') {
      setFormData(prevData => ({
        ...prevData,
        endDate: date,
      }));
    } else if (field === 'activity_start') {
      const updatedActivities = [...formData.activities];
      updatedActivities[activityIndex].startDate = date;
      setFormData({ ...formData, activities: updatedActivities });
    } else if (field === 'activity_end') {
      const updatedActivities = [...formData.activities];
      updatedActivities[activityIndex].endDate = date;
      setFormData({ ...formData, activities: updatedActivities });
    }
  };

  // Function to open the picker
  const openPicker = (field, activityIndex = null) => {
    setCurrentPickerField(field);
    setCurrentActivityIndex(activityIndex);
    setShowTimePicker(false); // Ensure time picker is closed when opening date picker
    setShowDatePicker(true);
  };

  return (
    <ScrollView style={styles.container}>

      <View style={styles.form}>
        {/* Event Name */}
        <TextInput
          mode="outlined"
          label="Event Name *"
          value={formData.name}
          onChangeText={(value) => handleChange('name', value)}
          style={styles.textInput}
          theme={{ colors: { primary: "#7d0431" } }}
          error={!!errors.name}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        {/* Start Date */}
        <TouchableOpacity
          onPress={() => openPicker('startDate')}
          style={styles.datePickerButton}
        >
          <Text style={styles.datePickerText}>Start Date *</Text>
          <Text style={styles.selectedDateText}>{formData.startDate.toLocaleString()}</Text>
        </TouchableOpacity>
        {errors.startDate && <Text style={styles.errorText}>{errors.startDate}</Text>}

        {/* End Date */}
        {/* End Date */}
        <TouchableOpacity
          onPress={() => openPicker('endDate')}
          style={styles.datePickerButton}
        >
          <Text style={styles.datePickerText}>End Date *</Text>
          <Text style={styles.selectedDateText}>{formData.endDate.toLocaleString()}</Text>
        </TouchableOpacity>
        {errors.endDate && <Text style={styles.errorText}>{errors.endDate}</Text>}

        {/* Activities */}
        <Text style={styles.activitiesHeader}>Activities</Text>
        {formData.activities.map((activity, index) => (
          <View key={index} style={styles.activityContainer}>
            <TextInput
              mode="outlined"
              label={`Activity Title *`}
              value={activity.type}
              onChangeText={(value) => handleActivityChange(index, 'type', value)}
              style={styles.textInput}
              error={!!errors[`activity_type_${index}`]}
              theme={{ colors: { primary: "#7d0431" } }}
            />
            {errors[`activity_type_${index}`] && (
              <Text style={styles.errorText}>{errors[`activity_type_${index}`]}</Text>
            )}

            <TouchableOpacity
              onPress={() => openPicker('activity_start', index)}
              style={styles.datePickerButton}
            >
              <Text style={styles.datePickerText}>Activity Start Date *</Text>
              <Text style={styles.selectedDateText}>{activity.startDate.toLocaleString()}</Text>
            </TouchableOpacity>
            {errors[`activity_startDate_${index}`] && (
              <Text style={styles.errorText}>{errors[`activity_startDate_${index}`]}</Text>
            )}

            <TouchableOpacity
              onPress={() => openPicker('activity_end', index)}
              style={styles.datePickerButton}
            >
              <Text style={styles.datePickerText}>Activity End Date *</Text>
              <Text style={styles.selectedDateText}>{activity.endDate.toLocaleString()}</Text>
            </TouchableOpacity>
            {errors[`activity_endDate_${index}`] && (
              <Text style={styles.errorText}>{errors[`activity_endDate_${index}`]}</Text>
            )}

            <TouchableOpacity onPress={() => removeActivity(index)} style={styles.removeActivityButton}>
              <Icon name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
        <Button mode="contained" onPress={addActivity} style={styles.addActivityButton}>
          Add Activity
        </Button>

        {/* Image Upload */}
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.imageUploadButton}>
          <Text style={styles.imageUploadButtonText}>Upload Images</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Images</Text>
        <FlatList
          data={previewImages}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: item }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => deleteImage(index, index < pictures.length)}
              >
                <Icon name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        />
        {previewImages.length < 5 && (
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addImageButton}>
            <Icon name="add-a-photo" size={30} color="#7D0431" />
            <Text style={styles.addImageText}>Add Image</Text>
          </TouchableOpacity>
        )}

        {/* Submit Button */}
        <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
          Update Event
        </Button>
      </View>

      {/* Modal for Image Picker */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Image Source</Text>
            <TouchableOpacity onPress={() => handleImagePicker('camera')} style={styles.modalButtonIcon}>
              <Text>Take a Photo  </Text>
              <Icon name="photo-camera" size={24} color="#7D0431" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleImagePicker('gallery')} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Pick from Gallery  </Text>
              <Icon name="photo-library" size={24} color="#7D0431" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
              <Text style={styles.modalButtonCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {/* <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Image Source</Text>
              <TouchableOpacity onPress={pickImage} style={styles.modalButtonIcon}>
                <Text>Pick from Gallery  </Text>
                <Icon name="photo-library" size={24} color="#7D0431" />
              </TouchableOpacity>
              <TouchableOpacity onPress={takePhoto} style={styles.modalButtonIcon}>
                <Text>Take a Photo  </Text>
                <Icon name="photo-camera" size={24} color="#7D0431" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                <Text style={styles.modalButtonCancel} >Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal> */}

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={tempDate}
          mode="time"
          display="default"
          onChange={onChangeTime}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#630000',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
  form: {
    flex: 1,
  },
  textInput: {
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  activitiesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  activitiesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#630000',
  },
  addButton: {
    backgroundColor: '#7D0431',
  },
  activityContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  activityLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#630000',
  },
  removeActivityButton: {
    marginTop: 10,
    
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#630000',
    marginVertical: 10,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 15,
    padding: 2,
  },
  addImageButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  addImageText: {
    marginTop: 5,
    color: '#7D0431',
  },
  submitButton: {
    backgroundColor: '#7D0431',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  datePickerButton: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#7D0431',
    fontWeight: '600',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  modalButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#7D0431',
  },
  modalCancelButton: {
    marginTop: 20,
  },
  modalCancelText: {
    color: 'red',
    fontSize: 16,
  },
});


export default EditEvent;
