import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import Dashboard from '../pages/Dashboard/Dashboard';
import Advertisements from '../pages/Advertisements/Advertisements';
import ResidentialUnit from '../pages/ResidentialUnit/ResidentialUnit';
import Events from '../pages/Events/Events';
import Polls from '../pages/Polls/Polls';
import VisitorManagement from '../pages/VisistorManagement/VisistorManagement';
import Amenities from '../pages/Amenities/Amenities';
import Inventory from '../pages/Inventory/Inventory';
import Complaints from '../pages/Complaints/Complaints';
import Documents from '../pages/Documents/Documents';
import SocietyBills from '../pages/SocietyBills/SocietyBills';
import Security from '../pages/Security/Security';
import Services from '../pages/Services/Services';
import Maintenance from '../pages/Maintenance/Maintenance';

const Drawer = createDrawerNavigator();

export default function Sidebar() {
  return (
    <Drawer.Navigator
      initialRouteName="Residential Management"
      screenOptions={{
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: "center", gap: 15, marginRight: 10 }}>

            <View>
              <Icon name="bell-o" size={25} color="#202020" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </View>
            <Icon name="user-circle-o" size={25} color="#202020" />
          </View>
        ),
      }}
    >
      <Drawer.Screen name="Dashboard" component={Dashboard} />
      <Drawer.Screen name="Advertisements" component={Advertisements} />
      <Drawer.Screen name="Residential Management" component={ResidentialUnit} />
      <Drawer.Screen name="Security" component={Security} />
      <Drawer.Screen name="Services" component={Services} />
      <Drawer.Screen name="Complaints" component={Complaints} />
      <Drawer.Screen name="Documents" component={Documents} />
      <Drawer.Screen name="Events" component={Events} />
      <Drawer.Screen name="Polls" component={Polls} />
      <Drawer.Screen name="Visitor Management" component={VisitorManagement} />
      <Drawer.Screen name="Amenities" component={Amenities} />
      <Drawer.Screen name="Inventory" component={Inventory} />
      <Drawer.Screen name="Society Bills" component={SocietyBills} />
      <Drawer.Screen name="Maintenance Bills" component={Maintenance} />
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