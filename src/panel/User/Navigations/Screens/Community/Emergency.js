import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmergencyContacts } from '../../../Redux/Slice/CommunitySlice/EmergencyContactSlice';
import Icon from 'react-native-vector-icons/Ionicons';

import AsyncStorage from '@react-native-async-storage/async-storage';
const EmergencyContacts = () => {
  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.emergencyContacts.contacts);
  const status = useSelector((state) => state.emergencyContacts.status);
  const error = useSelector((state) => state.emergencyContacts.error);
  const [societyId, setSocietyId] = useState(null);

  useEffect(() => {
    const getSocietyId = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        const id = JSON.parse(user).societyId;
        if (id !== null) {
          setSocietyId(id);
        } else {
          console.error('No societyId found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching societyId from AsyncStorage:', error);
      }
    };
    getSocietyId();
  }, []);
  useEffect(() => {
    if (societyId) {
      dispatch(fetchEmergencyContacts(societyId))
    }
  }, [dispatch, societyId]);
  const handleCall = (phone) => {
    const url = `tel:${phone}`;
    Linking.openURL(url).catch((err) => Alert.alert('Error', 'Failed to open dialer'));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.contactItem}>
        <View style={styles.contactInfo}>
          <Text style={styles.name}>{item.profession}</Text>
          <Text style={styles.phone}>{item.name}</Text>
          <Text style={styles.phone}>{item.phoneNumber}</Text>
        </View>
        <TouchableOpacity style={styles.callButton} onPress={() => handleCall(item.phoneNumber)}>
          <Icon name="call-outline" size={24} color="#7d0431" />
        </TouchableOpacity>
      </View>
    </View>
  );
  const spinner = () => {
    return (
      <View style={[styles.containerSpin, styles.horizontalSpin]}>
        <ActivityIndicator size="large" color="#7d0431" />
      </View>
    );
  };

  if (status === 'loading') {
    return spinner();
  }

  if (status === 'failed') {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({

  containerSpin: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontalSpin: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },


  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    backgroundColor: '#fff',
    elevation: 2,
    borderColor: '#ccc',
    borderRadius: 12,
    marginBottom: 10,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center',
  },
  iconContainer: {
    padding: 8,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#C59358',
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#484848"
  },
  phone: {
    fontSize: 16,
    color: '#777',
  },
  callButton: {
    padding: 10,
  },
});

export default EmergencyContacts;
