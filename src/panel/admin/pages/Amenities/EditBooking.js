import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from "react-redux";
import { Picker } from '@react-native-picker/picker'; // For dropdown selection
// import { IoArrowBackSharp } from "react-icons/io5"; // You can use a similar icon package for React Native
// import Dialog from '../../DialogBox/DialogBox';
import { getAmenityByIdAndUserId, updateAmenityBooking } from "./BookingSlice";

const EditBooking = () => {
  const route = useRoute();
  const { id, userId } = route.params;
  const dispatch = useDispatch();
  const successMessage = useSelector((state) => state.bookings.successMessage);
  const booking = useSelector((state) => state.bookings.booking);
  const statusOptions = ["InProgress", "Completed", "Cancelled"];
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();
  const [showDialog, setShowDialog] = useState(false);
  const [editDate, setEditDate] = useState(false);
  const [initialDate, setInitialDate] = useState('');

  const [formState, setFormState] = useState({
    payed: '',
    pending: '',
    dateOfBooking: '',
    status: '',
  });

  useEffect(() => {
    dispatch(getAmenityByIdAndUserId({ id, userId }));
  }, [dispatch]);

  useEffect(() => {
    if (booking) {
      setFormState({
        payed: booking.payed || '',
        pending: booking.pending || '',
        dateOfBooking: booking.dateOfBooking || '',
        status: booking.status || '',
      });
      setInitialDate(booking.dateOfBooking || '');
    }
  }, [booking]);

  const handleInputChange = (name, value) => {
    setFormState({ ...formState, [name]: value });
  };

  const validateForm = () => {
    let tempErrors = {};
    tempErrors.payed = formState.payed ? "" : "Payed is required.";
    tempErrors.pending = formState.pending ? "" : "Pending is required.";
    tempErrors.dateOfBooking = formState.dateOfBooking ? "" : "Date is required.";
    tempErrors.status = formState.status ? "" : "Status is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const { ...formData } = formState;
      dispatch(updateAmenityBooking({ id, userId, formData }))
        .then(() => {
          setShowDialog(true);
          setTimeout(() => {
            setShowDialog(false);
            setFormState((prev) => ({ ...prev, dateOfBooking: initialDate }));
          }, 2000);
          dispatch(getAmenityByIdAndUserId({ id, userId }));
        })
        .catch((error) => {
          Alert.alert("Error", "An error occurred while updating the booking.");
        });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}><IoArrowBackSharp /></Text>
        </TouchableOpacity>
        <Text style={styles.title}>Edit Booking</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Paid*"
          value={formState.payed}
          onChangeText={(value) => handleInputChange('payed', value)}
        />
        {errors.payed && <Text style={styles.errorText}>{errors.payed}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Pending*"
          value={formState.pending}
          onChangeText={(value) => handleInputChange('pending', value)}
        />
        {errors.pending && <Text style={styles.errorText}>{errors.pending}</Text>}

        {editDate ? (
          <TextInput
            style={styles.input}
            placeholder="Date and Time*"
            value={formState.dateOfBooking}
            onChangeText={(value) => handleInputChange('dateOfBooking', value)}
            keyboardType="default"
          />
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Date and Time*"
              value={new Date(formState.dateOfBooking).toLocaleString()}
              editable={false}
            />
            <Button title="Change Time" onPress={() => setEditDate(true)} color="#630000" />
          </>
        )}
        {errors.dateOfBooking && <Text style={styles.errorText}>{errors.dateOfBooking}</Text>}

        <Picker
          selectedValue={formState.status}
          style={styles.picker}
          onValueChange={(value) => handleInputChange('status', value)}
        >
          {statusOptions.map((status) => (
            <Picker.Item key={status} label={status} value={status} />
          ))}
        </Picker>
        {errors.status && <Text style={styles.errorText}>{errors.status}</Text>}

        <Button
          title="Update"
          onPress={handleSubmit}
          color="#630000"
        />
      </View>

      <Dialog
        message={successMessage}
        showDialog={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
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
    fontSize: 23,
    fontWeight: '700',
    color: '#630000',
  },
  formContainer: {
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default EditBooking;
