import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; // Import useFocusEffect
import { deleteAmenity, getAllAmenityBySocietyId } from "./AmenitiesSlice"; // Keep this as it is for your API actions
import { ImagebaseURL } from "../../../Security/helpers/axios";
import { Ionicons } from "@expo/vector-icons"; // Add icons from Expo
import { Dialog, Portal, Paragraph, Button, FAB } from "react-native-paper"; // Import from react-native-paper
import { Provider as PaperProvider } from "react-native-paper";
const Amenities = () => {
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false); // State for Dialog visibility
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState(null); // Track which menu is open

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const amenities = useSelector(
    (state) => state.adminAmenities.amenities || []
  );
  const successMessage = useSelector(
    (state) => state.adminAmenities.successMessage
  );

  // Use useFocusEffect to fetch amenities whenever the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      dispatch(getAllAmenityBySocietyId());
    }, [dispatch])
  );

  const handleDeleteConfirm = () => {
    console.log(selectedAmenity)
    dispatch(deleteAmenity({ id: selectedAmenity._id }))
      .then(() => {
        setDeleteDialogVisible(false);
        setShowSuccessDialog(true); // Show success message after deletion
        setTimeout(() => {
          setShowSuccessDialog(false);
        }, 2000); // Automatically close success message after 2 seconds
        dispatch(getAllAmenityBySocietyId());
      })
      .catch((error) => {
        setDeleteDialogVisible(false);
        console.error("Error:", error);
      });
  };

  const hideDeleteDialog = () => setDeleteDialogVisible(false); // Function to close the dialog

  const renderItem = ({ item }) => {
    const isMenuOpen = selectedMenuId === item._id; // Check if this menu is open

    return (
      <TouchableOpacity
      // onPress={() => navigation.navigate("Bookings")}
      >
        <View style={styles.itemContainer}>
          {/* Image Section: 40% of card height */}
          <Image
            source={{ uri: `${ImagebaseURL}${item.image}` }}
            style={styles.image}
          />
          {/* Details Section: 60% of card height */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailsColumn}>
              <Text style={styles.text}>Name: {item.amenityName}</Text>
              <Text style={styles.text}>Capacity: {item.capacity || "0"}</Text>
              <Text style={styles.text}>Timings: {item.timings}</Text>
              <Text style={styles.text}>Location: {item.location}</Text>
              <Text style={styles.text}>Cost: {item.cost || "0"}</Text>
            </View>
          </View>

          {/* Menu Icon in Bottom Right */}
          <TouchableOpacity
            style={styles.menuIcon}
            onPress={() => setSelectedMenuId(isMenuOpen ? null : item._id)} // Toggle the menu
          >
            <Ionicons name="ellipsis-vertical" size={24} color="#666562" />
          </TouchableOpacity>

          {/* Menu Actions */}
          {isMenuOpen && (
            <View style={styles.menu}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Edit Amenity", { id: item._id })
                }
              >
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Add Booking", { id: item._id })
                }
              >
                <Text style={styles.actionText}>Booking</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSelectedAmenity(item);
                  setDeleteDialogVisible(true); // Open the delete dialog
                  setSelectedMenuId(null); // Close the menu when the delete dialog opens
                }}
              >
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
          <Text style={styles.title}>Amenities</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("Bookings")}
          >
            <Ionicons name="calendar" size={30} color="#7d0431" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={amenities} // Now displaying all amenities without pagination
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />

        {/* Portal is required for Dialog */}
        <Portal>
          {/* Dialog for Delete Confirmation */}
          <Dialog visible={deleteDialogVisible} onDismiss={hideDeleteDialog}>
            <Dialog.Title>Confirm Delete</Dialog.Title>
            <Dialog.Content>
              <Paragraph>
                Are you sure you want to delete this amenity?
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDeleteDialog}>Cancel</Button>
              <Button onPress={handleDeleteConfirm}>Delete</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* Modal for Success Message */}
        <Modal
          visible={showSuccessDialog}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                {successMessage || "Deleted Successfully!"}
              </Text>
            </View>
          </View>
        </Modal>
        <FAB
          style={styles.fab}
          icon="plus"
          color='#fff'
          onPress={() => navigation.navigate('Add Amenity')}
        />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 23,
    fontWeight: "700",
    color: "#630000",
    marginBottom: 16,
  },
  addButton: {
    width: 100,
    height: 40,
    borderWidth: 2,
    borderColor: "#7d0431",
    alignItems: "center",
    marginBottom: 16,
    borderRadius: 8,
    paddingVertical: 2
  },
  itemContainer: {
    padding: 0,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 16,
    height: 250,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "40%",
  },
  detailsContainer: {
    height: "60%",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 10,
  },
  detailsColumn: {
    flex: 1,
    justifyContent: "flex-start",
  },
  text: {
    fontSize: 15,
    marginBottom: 8,
  },
  menuIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    paddingTop: 20,
    borderRadius: 50,
  },
  menu: {
    position: "absolute",
    bottom: 5,
    right: 40,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  actionText: {
    color: "#7d0431",
    fontWeight: "600",
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
  },
  modalText: {
    marginBottom: 16,
    fontSize: 16,
    textAlign: "center",
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#630000',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default Amenities;
