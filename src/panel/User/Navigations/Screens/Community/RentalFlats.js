import React from "react";
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const properties = [
  {
    id: '1',
    name: 'Vasantha Vihar',
    houses: '15 Houses',
    image: require("../../../../../assets/User/images/vasanthvihar.jpg"),
  },
  {
    id: '2',
    name: 'Vaisakhi Skyline',
    houses: '18 Houses',
    image: require("../../../../../assets/User/images/panorama.jpg"),
  },
  {
    id: '3',
    name: 'MVV City',
    houses: '10 Houses',
    image: require("../../../../../assets/User/images/mvv.jpg"),
  },
];
const RentalFlats = () => {
  const navigation = useNavigation();
  return (
    <ScrollView style={styles.container}>
      <View style={styles.detailsContainer}>


        <View style={styles.headerContainer}>
          <Text style={styles.availablePropertiesText}>
            Properties available for Rent
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('RentalProperties')}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {properties.map((property) => (
            <TouchableOpacity
              key={property.id}
              style={styles.itemContainer}
              onPress={() => navigation.navigate('RentalPropertyType', { propertyId: property.id })}
            >
              <ImageBackground source={property.image} style={styles.image}>
                <View style={styles.overlay}>
                  <Text style={styles.propertyName}>{property.name}</Text>
                  <Text style={styles.propertyHouses}>{property.houses}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  detailsContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: 20,
    borderRadius: 8,
    elevation: 4,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  availablePropertiesText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#800336',
  },
  itemContainer: {
    marginRight: 16,
    marginTop: 20,
  },
  image: {
    width: Dimensions.get('window').width * 0.6,
    height: Dimensions.get('window').width * 0.4,
    justifyContent: 'flex-end',
    borderRadius: 10,
    overflow: 'hidden',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: 10,
  },
  propertyName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  propertyHouses: {
    color: '#fff',
    fontSize: 14,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  instructionText: {
    fontSize: 14,
    color: '#333',

  },
  leaseButton: {
    backgroundColor: "#800336",
    borderRadius: 5,
  },
  leaseButtonText: {
    color: '#fff',
    fontSize: 14,

  },
  avatarIcon: {
    backgroundColor: "#800336",
  },
});

export default RentalFlats;
