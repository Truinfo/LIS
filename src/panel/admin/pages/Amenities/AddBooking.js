import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { IoArrowBackSharp } from "react-icons/io5"; // You can replace this with a suitable icon library for React Native
import Dialog from '../../DialogBox/DialogBox';
import { bookAmenity } from './BookingSlice';

const AddBooking = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const { id } = route.params;
  const [formData, setFormData] = useState({
    userId: '',
    payed: '',
    pending: '',
    dateOfBooking: '',
    status: '',
  });

  const [errors, setErrors] = useState({});
  const navigation = useNavigation();
  const [showDialog, setShowDialog] = useState(false);
  const successMessage = useSelector((state) => state.bookings.successMessage);
  const statusOptions = ["InProgress", "Completed", "Cancelled"];

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (!formData[key]) {
        newErrors[key] = 'This field is required';
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const response = await dispatch(bookAmenity({ id, formData }));
      if (response.meta.requestStatus === 'fulfilled') {
        setFormData({
          userId: '',
          payed: '',
          pending: '',
          dateOfBooking: '',
          status: '',
        });
        setShowDialog(true);
        setTimeout(() => {
          setShowDialog(false);
          navigation.navigate("Bookings"); // Update with your actual route name
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "An error occurred while booking the amenity.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}><IoArrowBackSharp /></Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Booking</Text>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder='User Id'
          value={formData.userId}
          onChangeText={(value) => handleChange('userId', value)}
        />
        {errors.userId && <Text style={styles.errorText}>{errors.userId}</Text>}

        <TextInput
          style={styles.input}
          placeholder='Paid'
          value={formData.payed}
          onChangeText={(value) => handleChange('payed', value)}
          keyboardType='numeric'
        />
        {errors.payed && <Text style={styles.errorText}>{errors.payed}</Text>}

        <TextInput
          style={styles.input}
          placeholder='Pending'
          value={formData.pending}
          onChangeText={(value) => handleChange('pending', value)}
          keyboardType='numeric'
        />
        {errors.pending && <Text style={styles.errorText}>{errors.pending}</Text>}

        <TextInput
          style={styles.input}
          placeholder='Date and Time'
          value={formData.dateOfBooking}
          onChangeText={(value) => handleChange('dateOfBooking', value)}
          // Use a DateTime picker here if needed
        />
        {errors.dateOfBooking && <Text style={styles.errorText}>{errors.dateOfBooking}</Text>}

        <View style={styles.selectContainer}>
          <Text style={styles.selectLabel}>Status</Text>
          <Picker
            selectedValue={formData.status}
            style={styles.picker}
            onValueChange={(value) => handleChange('status', value)}>
            {statusOptions.map((status) => (
              <Picker.Item key={status} label={status} value={status} />
            ))}
          </Picker>
          {errors.status && <Text style={styles.errorText}>{errors.status}</Text>}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add</Text>
        </TouchableOpacity>
      </ScrollView>

      <Dialog
        message={successMessage}
        showDialog={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#630000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#630000',
  },
  formContainer: {
    paddingVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  selectContainer: {
    marginBottom: 10,
  },
  selectLabel: {
    marginBottom: 5,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#630000',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default AddBooking;
