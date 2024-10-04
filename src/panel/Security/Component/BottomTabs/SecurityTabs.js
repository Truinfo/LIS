import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Avatar } from 'react-native-paper';
import HomeScreen from '../../Navigations/HomeScreen';
import Settings from '../Header/Settings';
import InandOut1 from '../Header/InandOut1';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchGuard } from '../../../User/Redux/Slice/Security_Panel/SettingsSlice';
import { ImagebaseURL } from '../../helpers/axios';
import { fetchSocietyById } from '../../../User/Redux/Slice/Security_Panel/SocietyByIdSlice';
import { TouchableOpacity } from 'react-native';
import { logout } from '../../../User/Redux/Slice/AuthSlice/Login/LoginSlice';
import { CommonActions, useNavigation } from '@react-navigation/native';
import StaffVisitors from '../../Navigations/StaffVisitors';

const Tab = createBottomTabNavigator();

function SecurityTabs() {
  const dispatch = useDispatch();
  const [societyId, setSocietyId] = useState(null);
  const Guard = useSelector((state) => state.setting.settings);
  const { society } = useSelector((state) => state.societyById);
  const [sequrityId, setSequrityId] = useState(null);

  useEffect(() => {
    const getUserName = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString !== null) {
          const user = JSON.parse(userString);
          setSocietyId(user.societyId);
          setSequrityId(user.sequrityId);
        }
      } catch (error) {
        console.error("Failed to fetch the user from async storage", error);
      }
    };

    getUserName();
  }, []);

  const navigation = useNavigation();
  useEffect(() => {
    if (societyId) {
      dispatch(fetchSocietyById(societyId));
    }
  }, [societyId, dispatch]);

  useEffect(() => {
    if (societyId && sequrityId) {
      dispatch(fetchGuard({ societyId, sequrityId }));
    }
  }, [societyId, sequrityId, dispatch]);
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('userToken');
    } catch (e) {
      console.error('Error clearing user from AsyncStorage:', e);
    }
    dispatch(logout());
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }], // Adjust 'Login' to the correct name of your login screen
      })
    );
  };
  const handleNotifications = async () => {

  };
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home-outline'; // You can change to 'home' for filled icon
          } else if (route.name === 'Visitors Entries') {
            iconName = 'log-in-outline'; // Change to 'log-in' for filled icon
          } else if (route.name === 'Staff Entries') {
            iconName = 'people-outline'; // You can change this as per your requirement
          } else if (route.name === 'Settings') {
            iconName = 'settings-outline'; // Change to 'settings' for filled icon
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#7d0431',
        tabBarInactiveTintColor: 'gray',
        headerTitle: () => null,
        headerStyle: {
          backgroundColor: '#7d0431',
        },
        headerLeft: () => (
          <View style={styles.headerLeftContainer}>
            <Avatar.Image
              size={40}
              source={{ uri: `${ImagebaseURL}${Guard.pictures}` }}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>{Guard.name}</Text>
              <Text style={styles.societyText}>{society ? society.societyName : '...'}</Text>
            </View>
          </View>
        ),
        headerRight: () => (
          <View style={styles.headerRightContainer}>
            <TouchableOpacity onPress={handleNotifications} >
              <Ionicons name="notifications" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.notificationIcon}>
              <Ionicons name="log-out" size={24} color="white" />
            </TouchableOpacity>

          </View>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Visitors Entries" component={InandOut1} />
      <Tab.Screen name="Staff Entries" component={StaffVisitors} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  nameContainer: {
    marginLeft: 10,
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#FFFFFF', // Set text color to white for better visibility
  },
  societyText: {
    fontSize: 14,
    color: '#E0E0E0', // Light gray for society name
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  notificationIcon: {
    marginLeft: 15,
  },
});

export default SecurityTabs;
