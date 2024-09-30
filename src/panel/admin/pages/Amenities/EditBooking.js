import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Alert, ScrollView, Modal } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from "react-redux";
import { Picker } from '@react-native-picker/picker';
import { getAmenityByIdAndUserId, updateAmenityBooking } from "./BookingSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditBooking = () => {
  const route = useRoute();
  const { id, userId } = route.params;
  const dispatch = useDispatch();
  const successMessage = useSelector((state) => state.adminBooking.successMessage);
  const booking = useSelector((state) => state.adminBooking.booking);
  const statusOptions = ["InProgress", "Completed", "Cancelled"];
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();
  const [showDialog, setShowDialog] = useState(false);
  const [editDate, setEditDate] = useState(false);
  const [initialDate, setInitialDate] = useState('');
  const fetchSocietyId = async () => {
    const storedAdmin = await AsyncStorage.getItem("societyAdmin");
    const societyAdmin = JSON.parse(storedAdmin) || {};
    return societyAdmin._id || "6683b57b073739a31e8350d0"; // Default ID
  };

  const [formState, setFormState] = useState({
    payed: '',
    pending: '',
    dateOfBooking: '',
    status: '',
  });
  useEffect(() => {
    dispatch(getAmenityByIdAndUserId({ userId }));
  }, [dispatch]);

  useEffect(() => {
    if (booking) {
      const matchedBookings = booking?.list.filter((booking) => booking._id === id);
      setFormState({
        payed: matchedBookings[0].payed || '',
        pending: matchedBookings[0].pending || '',
        dateOfBooking: matchedBookings[0].dateOfBooking || '',
        status: matchedBookings[0].status || '',
      });
      setInitialDate(matchedBookings[0].dateOfBooking || '');
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
      const societyId = fetchSocietyId()
      dispatch(updateAmenityBooking({ societyId, userId, formData }))
        .then((response) => {
          if (response.type === "booking/updateAmenityBooking/fulfilled") {
            setShowDialog(true);
            setTimeout(() => {
              setShowDialog(false);

            }, 2000);

            navigation.goBack()
          } else {
            Alert.alert("error", "failed")
          }
        })
        .catch((error) => {
          Alert.alert("Error", "An error occurred while updating the booking.");
        });
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      {/* Modal for success dialog */}
      <Modal
        visible={showDialog}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDialog(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.dialog}>
            <Text style={styles.dialogText}>{successMessage || "Booking updated successfully!"}</Text>
            <Button title="OK" onPress={() => setShowDialog(false)} color="#630000" />
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialog: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  dialogText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default EditBooking;
