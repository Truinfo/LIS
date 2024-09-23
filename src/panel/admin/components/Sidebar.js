import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import Dashboard from '../pages/Dashboard';
import Advertisements from '../pages/Advertisements';
import ResidentialUnit from '../pages/ResidentialUnit';
import UserManagement from '../pages/UserManagement';
import Events from '../pages/Events';
import Polls from '../pages/Polls';
import VisitorManagement from '../pages/VisistorManagement';
import Amenities from '../pages/Amenities';
import Inventory from '../pages/Inventory';
import Complaints from '../pages/Complaints';
import Documents from '../pages/Documents';
import SocietyBills from '../pages/SocietyBills';

const Drawer = createDrawerNavigator();

export default function Sidebar() {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: "center", gap: 15, marginRight: 10 }}>

            <View>
              <Icon name="bell-o" size={25} color="#000" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </View>
            <Icon name="user-circle-o" size={25} color="#000" />

          </View>
        ),
      }}
    >
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Advertisements" component={Advertisements} />
      <Drawer.Screen name="Residential Unit" component={ResidentialUnit} />
      <Drawer.Screen name="UserManagement" component={UserManagement} />
      <Drawer.Screen name="Complaints" component={Complaints} />
      <Drawer.Screen name="Documents" component={Documents} />
      <Drawer.Screen name="Events" component={Events} />
      <Drawer.Screen name="Polls" component={Polls} />
      <Drawer.Screen name="VisitorManagement" component={VisitorManagement} />
      <Drawer.Screen name="Amenities" component={Amenities} />
      <Drawer.Screen name="Inventory" component={Inventory} />
      <Drawer.Screen name="Society Bills" component={SocietyBills} />
    </Drawer.Navigator>
  );
}


const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});