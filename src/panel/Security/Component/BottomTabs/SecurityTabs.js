import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Avatar } from 'react-native-paper';
import HomeScreen from '../../Navigations/HomeScreen';
import Settings from '../Header/Settings';
import InandOut1 from '../Header/InandOut1';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchGuard } from '../../../User/Redux/Slice/Security_Panel/SettingsSlice';
import { ImagebaseURL } from '../../helpers/axios';

const Tab = createBottomTabNavigator();

function SecurityTabs() {

  const dispatch = useDispatch();
  const [societyId, setSocietyId] = useState(null);
  const Guard = useSelector((state) => state.setting.settings);
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
  useEffect(() => {
    if (societyId && sequrityId) {
      dispatch(fetchGuard({ societyId, sequrityId }));
    }
  }, [societyId, sequrityId, dispatch]);
  console.log(Guard)
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home'; // Filled icon
          } else if (route.name === 'In and Out') {
            iconName = 'log-in'; // Filled icon
          } else if (route.name === 'Settings') {
            iconName = 'settings'; // Filled icon
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#7d0431',
        tabBarInactiveTintColor: 'gray',
        headerTitle: () => null, // Hide default title
        headerStyle: {
          backgroundColor: '#7d0431', // Set header background color
        },
        headerLeft: () => (
          <View style={styles.headerLeftContainer}>
            <Avatar.Image
              size={40}
              source={{ uri: `${ImagebaseURL}${Guard.pictures}` }}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>{Guard.name}</Text>
              <Text style={styles.societyText}>{Guard.societyId}</Text>
            </View>
          </View>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="In and Out" component={InandOut1} />
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
    fontSize: 16,
    color: '#FFFFFF', // Set text color to white for better visibility
  },
  societyText: {
    fontSize: 14,
    color: '#E0E0E0', // Light gray for society name
  },
});

export default SecurityTabs;
