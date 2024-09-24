import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSequrityPerson } from './GateKeeperSlice';
import { View, Text, Image, ActivityIndicator, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ImagebaseURL } from '../../../Security/helpers/axios';

const ViewSequrity = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { sequrityId } = route.params;
  const profile = useSelector((state) => state.gateKeepers.sequrity);
  const status = useSelector((state) => state.gateKeepers.status);
  const error = useSelector((state) => state.gateKeepers.error);

  useEffect(() => {
    dispatch(getSequrityPerson(sequrityId));
  }, [dispatch, sequrityId]);

  if (status === 'loading') {
    return <ActivityIndicator size="large" color="#630000" style={styles.loader} />;
  }
  
  if (status === 'failed') {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>View Sequrity</Text>
      </View>
      {profile ? (
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: `${ImagebaseURL}${profile.pictures}` }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileDetail}><Text style={styles.bold}>Email:</Text> {profile.email}</Text>
          <Text style={styles.profileDetail}><Text style={styles.bold}>Mobile Number:</Text> {profile.phoneNumber}</Text>
          <Text style={styles.profileDetail}><Text style={styles.bold}>Role:</Text> {profile.role}</Text>
          <Text style={styles.profileDetail}><Text style={styles.bold}>Aadhar Number:</Text> {profile.aadharNumber}</Text>
          {profile.address && (
            <Text style={styles.profileDetail}>
              <Text style={styles.bold}>Address:</Text> {`${profile.address.addressLine1 || ''}, ${profile.address.addressLine2 || ''}, ${profile.address.state || ''}, ${profile.address.postalCode || ''}`}
            </Text>
          )}
          {profile.attendance && profile.attendance.length > 0 && (
            <View style={styles.attendanceContainer}>
              <Text style={styles.attendanceTitle}>Attendance:</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={styles.tableHeaderText}>Date</Text>
                  <Text style={styles.tableHeaderText}>Status</Text>
                  <Text style={styles.tableHeaderText}>Check-In</Text>
                  <Text style={styles.tableHeaderText}>Check-Out</Text>
                </View>
                {profile.attendance.map((attendanceRecord) => (
                  <View key={attendanceRecord._id} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{new Date(attendanceRecord.date).toLocaleDateString()}</Text>
                    <Text style={styles.tableCell}>{attendanceRecord.status}</Text>
                    <Text style={styles.tableCell}>{attendanceRecord.checkInDateTime ? new Date(attendanceRecord.checkInDateTime).toLocaleTimeString() : '-'}</Text>
                    <Text style={styles.tableCell}>{attendanceRecord.checkOutDateTime ? new Date(attendanceRecord.checkOutDateTime).toLocaleTimeString() : '-'}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      ) : (
        <Text>No profile found.</Text>
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 23,
    fontWeight: '700',
    color: '#630000',
  },
  profileContainer: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  profileImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    alignSelf: 'center',
  },
  profileName: {
    fontSize: 23,
    fontWeight: '700',
    marginTop: 10,
    textAlign: 'center',
  },
  profileDetail: {
    fontSize: 17,
    marginVertical: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  attendanceContainer: {
    marginTop: 20,
  },
  attendanceTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#630000',
  },
  table: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#630000',
  },
  tableHeaderText: {
    flex: 1,
    color: '#fff',
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tableCell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
  },
});

export default ViewSequrity;
