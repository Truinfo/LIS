import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { checkAttendanceStatus, sequrityCheckIn, sequrityCheckOut } from './GateKeeperSlice';
import Toast from 'react-native-toast-message';
import { useRoute } from '@react-navigation/native';

const AttendanceForm = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const { sequrityId } = route.params;
  const data = useSelector((state) => state.gateKeepers.sequrity);
  const sequrity = data?.status || '';
  const sequrityAttendance = data?.attendanceRecords || {};

  const [attendance, setAttendance] = useState({
    date: new Date().toISOString().slice(0, 10),
    status: '',
    checkInDateTime: '',
    checkOutDateTime: '',
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const [today] = useState(new Date().toISOString().slice(0, 10));
  const selectedDate = new Date(attendance.date).toISOString().slice(0, 10);

  useEffect(() => {
    const formattedDate = new Date(attendance.date).toISOString();
    dispatch(checkAttendanceStatus({ sequrityId, date: formattedDate }));
  }, [dispatch, sequrityId, attendance.date]);

  const handleAttendanceChange = (name, value) => {
    setAttendance((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const handleCheckin = async () => {
    try {
      if (selectedDate !== today) {
        Alert.alert('Error', 'You can only check in today.');
        return;
      }
  
      let formData = {
        date: attendance.date,
        status: attendance.status,
      };
  
      if (attendance.status === 'present') {
        formData.checkInDateTime = new Date().toISOString();
      }

      const response = await dispatch(sequrityCheckIn({ sequrityId, formData }));

      if (response.meta.requestStatus === 'fulfilled') {
        Toast.show({
          text1: 'Check-in Successful',
          text2: "Successfully Added",
          type: 'success',
        });

        await dispatch(checkAttendanceStatus({ sequrityId, date: new Date(attendance.date).toISOString() }));
      } else {
        Toast.show({
          text1: 'Check-in Failed',
          text2: 'An error occurred during check-in.',
          type: 'error',
        });
      }
    } catch (error) {
      console.error("Error during check-in:", error);
      Toast.show({
        text1: 'Check-in Failed',
        text2: 'An error occurred during check-in.',
        type: 'error',
      });
    }
  };
  
  

  const handleCheckout = async () => {
    const formData = {
      checkOutDateTime: new Date().toISOString(),
    };
    const attendanceId = sequrityAttendance._id;

    try {
      await dispatch(sequrityCheckOut({ sequrityId, attendanceId, formData }));
      Toast.show({
        text1: 'Check-out Successful',
        text2: 'You have checked out successfully.',
        type: 'success',
      });
      dispatch(checkAttendanceStatus({ sequrityId, date: new Date(attendance.date).toISOString() }));
    } catch (error) {
      console.error('Error during check-out:', error);
      Toast.show({
        text1: 'Check-out Failed',
        text2: 'An error occurred during check-out.',
        type: 'error',
      });
    }
  };

  const handleSelectStatus = (status) => {
    handleAttendanceChange('status', status);
    setShowDropdown(false);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <View style={styles.container}>
      {sequrityAttendance && (
        <View style={styles.record}>
          <Text style={styles.recordTitle}>Last Attendance Record:</Text>
          <Text>Date: {new Date(sequrityAttendance.date).toLocaleDateString()}</Text>
          <Text>Status: {sequrityAttendance.status}</Text>
          <Text>Check-in Time: {sequrityAttendance.checkInDateTime ? new Date(sequrityAttendance.checkInDateTime).toLocaleString() : '-'}</Text>
          <Text>Check-out Time: {sequrityAttendance.checkOutDateTime ? new Date(sequrityAttendance.checkOutDateTime).toLocaleString() : '-'}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.datePickerButton}>
        <Text style={styles.datePickerText}>{attendance.date}</Text>
      </TouchableOpacity>

      {selectedDate === today && sequrity !== 'Already checkin But no checkOut' && (
        <View style={styles.dropdown}>
          <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
            <Text style={styles.dropdownText}>{capitalizeFirstLetter(attendance.status) || 'Select Status'}</Text>
          </TouchableOpacity>
          {showDropdown && (
            <View style={styles.dropdownOptions}>
              <TouchableOpacity onPress={() => handleSelectStatus('present')} style={styles.option}>
                <Text style={styles.optionText}>Present</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSelectStatus('leave')} style={styles.option}>
                <Text style={styles.optionText}>Leave</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {selectedDate === today && sequrity === 'No CheckIn' && (
        <View style={styles.buttonContainer}>

          <TouchableOpacity style={styles.buttonCheck} onPress={handleCheckin}>
            <Text style={styles.addButtonText}>Check-in</Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedDate === today && sequrity === 'Already checkin But no checkOut' && (
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Already Check-In</Text>
          <TouchableOpacity style={styles.buttonCheck} onPress={handleCheckout}>
            <Text style={styles.addButtonText}>Check Out</Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedDate === today && sequrity === 'In Leave' && (
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>You are on leave for this date.</Text>
          <TouchableOpacity style={styles.buttonCheck} onPress={handleCheckin}>
            <Text style={styles.addButtonText}>Check-in Anyway</Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedDate === today && sequrityAttendance.checkOutDateTime && (
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Re-Entry</Text>
          <TouchableOpacity style={styles.buttonCheck} onPress={handleCheckin}>
            <Text style={styles.addButtonText}>Check-in Again</Text>
          </TouchableOpacity>
        </View>
      )}

      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  record: {
    marginVertical: 20,
    padding: 10,
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 5,
  },
  recordTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#630000',
  },
  datePickerButton: {
    padding: 10,
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
  },
  datePickerText: {
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  dropdownText: {
    color: '#333',
    marginBottom: 5,

  },
  dropdownOptions: {
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  option: {
    padding: 10,
  },
  optionText: {
    color: '#333',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  buttonCheck: {
    backgroundColor: '#7D0431',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText: {
    fontSize: 16,
    marginBottom: 10,
  }
});

export default AttendanceForm;
