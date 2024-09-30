import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchInventory, deleteInventoryAsync, fetchaddInventory, fetchEditInventoryAsync } from './InventorySlice';
import { ActivityIndicator, FAB, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Inventory = () => {
    const dispatch = useDispatch();
    const inventoryItems = useSelector(state => state.inventory.inventoryItems) || [];
    const status = useSelector(state => state.inventory.status);
    const error = useSelector(state => state.inventory.error);
    const successMessage = useSelector(state => state.inventory.successMessage);
    const [anchor, setAnchor] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const [inventoryData, setInventoryData] = useState({
        name: "",
        quantity: "",
        societyId: "6683b57b073739a31e8350d0"
    });
    const [editInventoryData, setEditInventoryData] = useState({
        id: "",
        name: "",
        quantity: "",
    });
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    useEffect(() => {
        dispatch(fetchInventory());
    }, [dispatch]);

    const handleMenuPress = (item) => {
        setAnchor(anchor === item._id ? null : item._id);
    };

    

    const confirmDelete = (id) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this inventory?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Yes, Delete',
                    onPress: () => {
                        dispatch(deleteInventoryAsync({ id }))
                            .then(() => {
                                setSnackbarMessage("Inventory deleted successfully");
                                setSnackbarVisible(true);
                                dispatch(fetchInventory()); // Refresh the inventory list
                            })
                            .catch((error) => {
                                setSnackbarMessage("There was an error deleting the inventory");
                                setSnackbarVisible(true);
                                console.error("Error:", error);
                            });
                    },
                    style: 'destructive', // Optional: Makes the delete option visually distinct
                },
            ],
            { cancelable: true }
        );
    };
    
    const handleEditClick = (item) => {
        setEditInventoryData({
            id: item._id,
            name: item.name,
            quantity: item.quantity,
        });
        setModalVisible1(true);
    };
    const handleEditSubmit = async () => {
        try {
            const response = await dispatch(fetchEditInventoryAsync(editInventoryData));
            if (response.type === 'inventory/EditInventoryData/fulfilled') {
                setModalVisible1(false); 
                setSnackbarMessage(successMessage);
                setSnackbarVisible(true);
                dispatch(fetchInventory()); 
            }
        } catch (error) {
            setSnackbarMessage("Failed to edit inventory");
            setSnackbarVisible(true);
            console.error("Error:", error);
        }
    };

    const handleChange = (name, value) => {
        setInventoryData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        // Check if all required fields are filled
        if (!inventoryData.name || !inventoryData.quantity || !inventoryData.societyId) {
            setSnackbarMessage("Please fill out all fields");
            setSnackbarVisible(true);
            return;
        }
    
        try {
            // Dispatch the action to add inventory
            const response = await dispatch(fetchaddInventory(inventoryData));
            
            // Handle successful response
            if (response.meta.requestStatus === 'fulfilled') {
                console.log(response);
                setSnackbarMessage("Inventory added successfully");
                setSnackbarVisible(true);
                dispatch(fetchInventory()); // Refresh the inventory list
                setModalVisible(false); // Close modal after success
            } else if (response.error) {
                // Handle server errors more gracefully
                setSnackbarMessage(`Failed to add inventory: ${response.error.message}`);
                setSnackbarVisible(true);
            }
        } catch (error) {
            // Handle any unexpected errors
            console.error("Error:", error);
            setSnackbarMessage(`Error: ${error.message || 'Something went wrong'}`);
            setSnackbarVisible(true);
        }
    };
    
    

    if (status === 'loading') {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator size={30} color="#630000" />
            </View>
        );
    }

    if (status === 'failed') {
        return <Text style={styles.errorText}>Error: {error}</Text>;
    }

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };
    const handleEditChange = (name, value) => {
        setEditInventoryData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    return (
        <View style={styles.container}>
            <FlatList
                data={inventoryItems}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemText}>{capitalizeFirstLetter(item.name)}</Text>
                            <Text style={styles.itemSubText}>Count: {item.quantity}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleMenuPress(item)}>
                            <MaterialCommunityIcons name="dots-vertical" size={24} color="#424242" />
                        </TouchableOpacity>
                        {anchor === item._id && (
                            <ScrollView style={styles.menuList}>
                                <TouchableOpacity onPress={() => handleEditClick(item)} style={styles.menuItem}>
                                    <Text>Edit</Text>
                                </TouchableOpacity>
                                <View style={styles.divider} />
                                <TouchableOpacity onPress={() => confirmDelete(item._id)} style={styles.menuItem}>
                                    <Text>Delete</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        )}
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyMessage}>No inventory items found</Text>}
            />

            <FAB
                style={styles.fab}
                icon={() => <MaterialCommunityIcons name="plus" size={24} color="white" />}
                onPress={() => setModalVisible(true)}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add Inventory</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="#630000" />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={inventoryData.name}
                            onChangeText={(value) => handleChange("name", value)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Quantity"
                            value={inventoryData.quantity}
                            keyboardType="numeric"
                            onChangeText={(value) => handleChange("quantity", value)}
                        />
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* Edit Inventory Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible1}
                onRequestClose={() => setModalVisible1(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Edit Inventory</Text>
                            <TouchableOpacity onPress={() => setModalVisible1(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="#630000" />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={editInventoryData.name} // Bind to editInventoryData
                            onChangeText={(value) => handleEditChange("name", value)} // Use handleEditChange
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Quantity"
                            value={editInventoryData.quantity} // Bind to editInventoryData
                            keyboardType="numeric"
                            onChangeText={(value) => handleEditChange("quantity", value)} // Use handleEditChange
                        />
                        <TouchableOpacity style={styles.submitButton} onPress={handleEditSubmit}>
                            <Text style={styles.submitButtonText}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
                action={{
                    label: 'Close',
                    onPress: () => {
                        setSnackbarVisible(false);
                    },
                }}
            >
                {snackbarMessage}
            </Snackbar>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingTop: 10,
        backgroundColor: '#fff',
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    itemDetails: {
        flex: 1,
    },
    itemText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    itemSubText: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        borderRadius: 50,
        backgroundColor: '#630000',
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
    },
    errorText: {
        fontSize: 18,
        textAlign: 'center',
        color: 'red',
        marginTop: 50,
    },
    emptyMessage: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginTop: 20,
    },
    menuList: {
        position: 'absolute',
        right: 30,
        backgroundColor: '#FFF',
        borderRadius: 5,
        elevation: 3,
        padding: 5,
        zIndex: 10,
        overflow: "visible",
    },
    menuItem: {
        padding: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#630000',
    },
    modalContent: {
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    input: {
        height: 50,
        borderColor: '#630000',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
        width: '100%',
    },
    submitButton: {
        backgroundColor: '#630000',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },


});

export default Inventory;
