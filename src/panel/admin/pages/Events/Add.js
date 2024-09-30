import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createEvent } from './EventSlice';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput } from 'react-native-paper';

const AddEvent = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { successMessage, error } = useSelector(state => state.societyEvents);

  const [name, setName] = useState('');
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [activities, setActivities] = useState([{ type: '', startDate: new Date(), endDate: new Date() }]);
  const [pictures, setPictures] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Date and Time Picker Handlers...
  // (Keep the existing onChangeDate, onChangeTime, and setFieldDate methods)
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentPickerField, setCurrentPickerField] = useState(null); // 'startDate', 'endDate', 'activity_start', 'activity_end'
  const [currentActivityIndex, setCurrentActivityIndex] = useState(null);
  const [tempDate, setTempDate] = useState(new Date());
  const [errors, setErrors] = useState({});

  

  const handleSubmit = async () => {
    if (!name || !startDateTime || !endDateTime) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    const newEvent = new FormData();
    newEvent.append('societyId', '6683b57b073739a31e8350d0');
    newEvent.append('name', name);
    newEvent.append('startDate', startDateTime.toISOString());
    newEvent.append('endDate', endDateTime.toISOString());

    pictures.forEach(picture => {
      newEvent.append('pictures', {
        uri: picture.uri,
        type: picture.type,
        name: picture.fileName,
      });
    });

    newEvent.append('activities', JSON.stringify(activities));

    setIsLoading(true);
    try {
      const response = await dispatch(createEvent(newEvent));
      if (response.type === 'event/AddEvent/fulfilled') {
        Alert.alert('Success', 'Event created successfully!');
        // Clear the form after successful submission
        setName('');
        setStartDateTime(new Date());
        setEndDateTime(new Date());
        setActivities([{ type: '', startDate: new Date(), endDate: new Date() }]);
        setPictures([]);
        setImagePreviews([]);
        navigation.navigate('EventList');
      } else {
        Alert.alert('Error', 'Failed to create event.');
      }
    } catch (err) {
      console.error('Error:', err);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivityChange = (index, field, value) => {
    const newActivities = [...activities];
    newActivities[index][field] = value;
    setActivities(newActivities);
  };

  const addActivity = () => {
    if (
      activities.some(
        activity => !activity.type || !activity.startDate || !activity.endDate
      )
    ) {
      Alert.alert(
        'Validation Error',
        'Please fill in all fields before adding a new activity.'
      );
      return;
    }
    setActivities([
      ...activities,
      { type: '', startDate: new Date(), endDate: new Date() },
    ]);
  };

  const removeActivity = index => {
    const newActivities = activities.filter((_, i) => i !== index);
    setActivities(newActivities);
  };

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 0,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const selectedImages = response.assets.map(asset => ({
          uri: asset.uri,
          type: asset.type,
          fileName: asset.fileName,
        }));
        setPictures(selectedImages);
        setImagePreviews(selectedImages.map(img => img.uri));
      }
    });
  };

  const onChangeDate = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return; // Early return if dismissed
    }
  
    const currentDate = selectedDate || tempDate;
    setTempDate(currentDate);
    setShowDatePicker(false);
    // Show time picker after selecting the date
    setShowTimePicker(true);
  };
  
  const onChangeTime = (event, selectedTime) => {
    if (event.type === 'dismissed') {
      setShowTimePicker(false);
      return; // Early return if dismissed
    }
  
    const currentTime = selectedTime || tempDate;
    const combinedDate = new Date(tempDate);
    combinedDate.setHours(currentTime.getHours());
    combinedDate.setMinutes(currentTime.getMinutes());
    
    setFieldDate(combinedDate); // Use this to set the date in your state
    setShowTimePicker(false);
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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <TextInput
          mode="outlined"
          label="Event Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
          theme={{ colors: { primary: "#7d0431" } }}
        />
        
        {/* Date Pickers */}
        {/* Start and End Date Picker Buttons */}
        <TouchableOpacity onPress={() => openPicker('startDate')} style={styles.datePickerButton}>
          <Text style={styles.datePickerText}>Start Date: {startDateTime.toLocaleString()}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => openPicker('endDate')} style={styles.datePickerButton}>
          <Text style={styles.datePickerText}>End Date: {endDateTime.toLocaleString()}</Text>
        </TouchableOpacity>

        {/* DateTimePicker */}
        {showDatePicker && <DateTimePicker value={tempDate} mode="datetime" display="default" onChange={onChangeDate} />}
        {showTimePicker && <DateTimePicker value={tempDate} mode="time" display="default" onChange={onChangeTime} />}

        {/* Image Upload */}
        <TouchableOpacity onPress={handleImagePicker} style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Upload Images</Text>
        </TouchableOpacity>

        {/* Image Previews */}
        <View style={styles.imagePreviewContainer}>
          {imagePreviews.map((imageUri, index) => (
            <Image key={index} source={{ uri: imageUri }} style={styles.imagePreview} />
          ))}
        </View>

        {/* Activities Section */}
        <Text style={styles.activitiesHeader}>Activities</Text>
        {activities.map((activity, index) => (
          <View key={index} style={styles.activityContainer}>
            <TextInput
              mode="outlined"
              label="Activity Type"
              value={activity.type}
              onChangeText={text => handleActivityChange(index, 'type', text)}
              theme={{ colors: { primary: "#7d0431" } }}
              style={styles.input}
            />
            <TouchableOpacity onPress={() => openPicker('activity_start', index)} style={styles.datePickerButton}>
              <Text style={styles.datePickerText}>Activity Start Date: {activity.startDate.toLocaleString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openPicker('activity_end', index)} style={styles.datePickerButton}>
              <Text style={styles.datePickerText}>Activity End Date: {activity.endDate.toLocaleString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeActivity(index)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Remove Activity</Text>
            </TouchableOpacity>
          </View>
        ))}
        
        <TouchableOpacity onPress={addActivity} style={styles.addActivityButton}>
          <Text style={styles.addActivityButtonText}>Add Activity</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit</Text>
          )}
        </TouchableOpacity>

        {showDatePicker && (
        <DateTimePicker
          value={tempDate}
          mode="datetime"
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


      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  form: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  datePickerButton: {
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  activityContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#f0f0f0',
  },
  uploadButton: {
    backgroundColor: '#7d0431',
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  imagePreview: {
    width: 80,
    height: 80,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  activitiesHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    padding: 8,
    borderRadius: 4,
    marginTop: 10,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
  },
  addActivityButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addActivityButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddEvent;
