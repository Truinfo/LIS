import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { deleteAmenityBooking, getAmenityOfCommunityHal } from './BookingSlice';
import { Icon } from 'react-native-elements'; // Ensure you have this library installed
import { ImagebaseURL } from '../../../Security/helpers/axios';
import { Modal } from 'react-native-paper';

const AmenityBookingsList = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const status = useSelector((state) => state.adminBooking.status);
  const error = useSelector((state) => state.adminBooking.error);
  const Allbooking = useSelector((state) => state.adminBooking.booking);
  const booking = Allbooking && Allbooking.list ? Allbooking.list : [];
  
  const [showDialog, setShowDialog] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  
  useEffect(() => {
    dispatch(getAmenityOfCommunityHal());
  }, [dispatch]);

  const confirmDelete = () => {
    dispatch(deleteAmenityBooking({ id: Allbooking._id, userId: selectedAmenity._id }))
      .then(() => {
        setSelectedAmenity(null);
        setDeleteDialogVisible(false);
        dispatch(getAmenityOfCommunityHal());
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const renderBookingCard = (item) => (
    <View style={styles.bookingCard}>
      <Text style={styles.bookingId}>{item._id}</Text>
      <Text>{new Date(item.dateOfBooking).toLocaleString()}</Text>
      <Text>{item.payed}</Text>
      <Text>{item.pending}</Text>
      <Text>{item.status}</Text>
      <TouchableOpacity style={styles.menuButton} onPress={() => {
        setSelectedAmenity(item);
        setShowMenu(!showMenu); // Toggle the menu visibility
      }}>
        <Icon name="menu" />
      </TouchableOpacity>
      {showMenu && selectedAmenity === item && ( // Render the menu if the item is selected
        <View style={styles.menu}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Edit Booking", { id: selectedAmenity._id });
              setShowMenu(false);
            }}
          >
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setDeleteDialogVisible(true); // Open the delete dialog
              setShowMenu(false); // Close the menu
            }}
          >
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (status === 'loading') {
    return <Text>Loading...</Text>;
  }

  if (status === 'failed') {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Add Button at Top Right Corner */}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddBookings', { id: Allbooking._id })}>
        <Icon name="add" size={30} />
      </TouchableOpacity>

      <View style={styles.amenityCard}>
        <Image
          source={{ uri: `${ImagebaseURL}${Allbooking.image}` }}
          style={styles.amenityImage}
        />
        <Text style={styles.amenityName}>{Allbooking.amenityName}</Text>
        <Text style={styles.capacityText}>
          <Text style={styles.boldText}>Capacity:</Text> {Allbooking.capacity}
        </Text>
        <Text style={styles.chargeText}>
          <Text style={styles.boldText}>Total Charge:</Text> {Allbooking.cost}
        </Text>
      </View>

      <FlatList
        data={booking}
        renderItem={({ item }) => renderBookingCard(item)}
        keyExtractor={item => item._id}
        ListEmptyComponent={<Text>No bookings found</Text>}
      />
      
      {/* Delete Confirmation Dialog */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={deleteDialogVisible}
        onRequestClose={() => setDeleteDialogVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to delete this booking?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setDeleteDialogVisible(false)} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmDelete} style={styles.confirmButton}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  addButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1, // Ensures it appears above other components
  },
  amenityCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  amenityImage: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    marginBottom: 10,
  },
  amenityName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bookingCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
    elevation: 1, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  bookingId: {
    fontWeight: 'bold',
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  menu: {
    position: 'absolute',
    top: 10,
    left: -120, // Adjust this value as needed to position the menu
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    zIndex: 1,
  },
  actionText: {
    fontSize: 18,
    marginVertical: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  capacityText: {
    marginTop: 5,
  },
  chargeText: {
    marginTop: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default AmenityBookingsList;
