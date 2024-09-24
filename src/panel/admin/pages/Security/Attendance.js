import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { checkAttendanceStatus, sequrityCheckIn, sequrityCheckOut } from './GateKeeperSlice';
import { Ionicons } from '@expo/vector-icons';
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
    setAttendance(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckin = async () => {
    if (selectedDate !== today) {
      Alert.alert("Error", "You can only check in today.");
      return;
    }

    let formData = {
      date: attendance.date,
      status: attendance.status,
    };
    if (attendance.status === 'present') {
      formData.checkInDateTime = new Date().toISOString();
    }

    try {
      await dispatch(sequrityCheckIn({ sequrityId, formData }));
      Toast.show({
        text1: 'Check-in Successful',
        text2: 'You have checked in successfully.',
        type: 'success',
      });
      dispatch(checkAttendanceStatus({ sequrityId, date: new Date(attendance.date).toISOString() }));
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

      <TextInput
        style={styles.dateInput}
        placeholder="Date"
        value={attendance.date}
        onChangeText={(value) => handleAttendanceChange('date', value)}

      />

      {selectedDate === today && sequrity !== 'Already checkin But no checkOut' && (
        <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)} style={styles.dropdown}>
          <Text style={styles.dropdownText}>{attendance.status || 'Select Status'}</Text>
        </TouchableOpacity>
      )}

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

      {selectedDate === today && sequrity === 'No CheckIn' && (
        <Button title="Check-in" onPress={handleCheckin} />
      )}

      {selectedDate === today && sequrity === 'Already checkin But no checkOut' && (
        <Button title="Check-out" onPress={handleCheckout} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#630000',
    padding: 10,
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: '700',
    color: '#fff',
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
  dateInput: {
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
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
  },
  dropdownOptions: {
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    maxHeight: 150,
    overflow: 'hidden',
  },
  option: {
    padding: 10,
  },
  optionText: {
    color: '#333',
  },
});

export default AttendanceForm;
