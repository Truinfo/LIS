import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ImagebaseURL } from '../../helpers/axios';
import { useDispatch, useSelector } from 'react-redux';
import MyDialog from '../../DialogBox/DialogBox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchVisitorVerify } from '../../../User/Redux/Slice/Security_Panel/HomeScreenSlice';
import { fetchVisitors } from '../../../User/Redux/Slice/Security_Panel/InandOutSlice';
import { denyEntry } from '../../../User/Redux/Slice/Security_Panel/DenySlice';
import { Avatar } from 'react-native-paper'

const Waiting = ({ data, setActiveTab }) => {
  const [societyId, setSocietyId] = useState(null);
  const dispatch = useDispatch();
  const [showDialog, setShowDialog] = useState(false);

  const AllowMessage = useSelector(state => state.homeScreen.successMessage);
  const DenyMessage = useSelector(state => state.dening.successMessage);
  const successMessage = AllowMessage || DenyMessage;
  const AllowError = useSelector(state => state.homeScreen.error);
  const DenyError = useSelector(state => state.dening.error);
  const error = AllowError || DenyError;

  useEffect(() => {
    const getSocietyId = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        const id = JSON.parse(user).societyId;
        if (id) {
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

  const handleAllow = (id) => {
    const payload = {
      societyId,
      id,
      visitorType: "Guest"
    };
    dispatch(fetchVisitorVerify(payload)).then((response) => {
      setShowDialog(true);
      setTimeout(() => {
        dispatch(fetchVisitors(societyId));
        setShowDialog(false);
        if (response.meta.requestStatus === 'fulfilled') {
          setActiveTab('Check In');
        }
      }, 2000);
    }).catch((error) => {
      console.error('Error:', error);
      setShowDialog(true);
      setTimeout(() => setShowDialog(false), 2000);
    });
  };

  const handleDeny = (itemId) => {
    const payload = {
      societyId,
      visitorId: itemId,
    };
    dispatch(denyEntry(payload)).then(() => {
      setShowDialog(true);
      setTimeout(() => {
        dispatch(fetchVisitors(societyId));
        setShowDialog(false);
      }, 2000);
    }).catch((error) => {
      console.error('Error:', error);
      setShowDialog(true);
      setTimeout(() => setShowDialog(false), 2000);
    });
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.imageContainer}>
          <Text style={styles.imageText}>{item.visitorId}</Text>
          {item.pictures ? (
            <Avatar.Image
              source={{ uri: `${ImagebaseURL}${item.pictures}` }}
              style={styles.avatar}
            />
          ) : (
            <Text style={styles.noImageText}>No Image</Text>
          )}
        </View>

        <View style={styles.itemTextContainer}>
          <Text style={styles.itemText}>{item.name}</Text>
          <Text style={styles.itemSubText}>{item.role}</Text>
          <Text style={styles.itemSubText}>{item.block}</Text>
          <Text style={styles.itemSubText}>{item.flatNo}</Text>
          <Text style={styles.itemSubText}>{item.phoneNumber}</Text>
        </View>

        <View style={styles.itemDetailsContainer}>
          <Text style={styles.itemSubText}>
            <Text style={styles.boldText}>Date: </Text>
            {new Date(item.date).toLocaleDateString()}{'\n'}{new Date(item.date).toLocaleTimeString()}
          </Text>
          <Text style={styles.itemTime}>
            <Text style={styles.boldText}>Access: </Text>
            {item.userAccess}
          </Text>

          <View style={styles.buttonContainer}>
            {item.userAccess === 'Wait' && (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.redButton]}
                  onPress={() => handleDeny(item.visitorId)}
                >
                  <Icon name="cancel" size={11} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.greenButton]}
                  onPress={() => handleAllow(item.visitorId)}
                >
                  <Icon name="check" size={11} color="#fff" />
                </TouchableOpacity>
              </>
            )}
            {item.userAccess === 'Deny' && (
              <TouchableOpacity
                style={[styles.button, styles.redButton]}
                onPress={() => handleDeny(item.visitorId)}
              >
                <Icon name="cancel" size={11} color="#fff" />
              </TouchableOpacity>
            )}
            {item.userAccess === 'Allow' && (
              <TouchableOpacity
                style={[styles.button, styles.greenButton]}
                onPress={() => handleAllow(item.visitorId)}
              >
                <Icon name="check" size={11} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));

return (
  <>
    <FlatList
      data={sortedData}
      renderItem={renderItem}
      keyExtractor={item => item._id}
      style={styles.list}
    />
    <MyDialog
      message={successMessage || error}
      showDialog={showDialog}
      onClose={() => setShowDialog(false)}
    />
  </>
);
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor:"#ccc"

  },
  noImageText: {
    width: 80,
    height: 80,
    borderRadius: 50,
    textAlign: 'center',
  },
  imageContainer: {
    marginRight: 15,
    alignItems: 'center',
  },
  itemDetailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTextContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 15,
    fontWeight: '600',
  },
  itemSubText: {
    fontSize: 13,
    color: '#888',
  },
  imageText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#800336',
    textAlign: 'center',
    marginTop: 10,
  },
  itemTime: {
    color: 'orange',
    marginLeft: 10,
    marginTop: 5,
    fontSize: 13,
  },
  list: {
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5', // Added background color to the list
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redButton: {
    backgroundColor: 'red',
    width: 30,
    height: 30,
  },
  greenButton: {
    backgroundColor: 'green',
    width: 30,
    height: 30,
  },
  boldText: {
    fontWeight: 'bold',
    color: 'black',
  },
});

export default Waiting;