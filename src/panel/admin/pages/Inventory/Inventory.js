import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, ScrollView, Modal, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchInventory, deleteInventoryAsync, fetchaddInventory, fetchEditInventoryAsync } from './InventorySlice';
import { FAB } from 'react-native-paper';
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

    useEffect(() => {
        dispatch(fetchInventory());
    }, [dispatch]);

    const handleMenuPress = (item) => {
        setAnchor(anchor === item._id ? null : item._id);
    };

    const handleDeleteSelected = (id) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this Inventory?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: () => confirmDelete(id),
                    style: 'destructive',
                },
            ]
        );
    };

    const confirmDelete = (id) => {
        dispatch(deleteInventoryAsync({ id }))
            .then(() => {
                Alert.alert('Success', 'Inventory deleted successfully');
                dispatch(fetchInventory());
            })
            .catch((error) => {
                Alert.alert('Error', 'There was an error deleting the inventory');
                console.error("Error:", error);
            });
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
            if (response.meta.requestStatus === 'fulfilled') {
                Alert.alert("Success", successMessage, [{ text: "OK", onPress: () => setModalVisible1(false) }]);
                dispatch(fetchInventory()); // Refresh inventory list after editing
            }
        } catch (error) {
            console.error("Error:", error);
            Alert.alert("Error", "Failed to edit inventory");
        }
    };

    const handleChange = (name, value) => {
        setInventoryData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await dispatch(fetchaddInventory(inventoryData));
            if (response.meta.requestStatus === 'fulfilled') {
                Alert.alert("Success", successMessage, [{ text: "OK", onPress: () => setModalVisible(false) }]);
                dispatch(fetchInventory()); 
            }
        } catch (error) {
            console.error("Error:", error);
            Alert.alert("Error", "Failed to add inventory");
        }
    };

    if (status === 'loading') {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#630000" />
            </View>
        );
    }

    if (status === 'failed') {
        return <Text style={styles.errorText}>Error: {error}</Text>;
    }

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
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
                                <TouchableOpacity onPress={() => handleDeleteSelected(item._id)} style={styles.menuItem}>
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
                            value={editInventoryData.name}
                            onChangeText={(value) => handleChange("name", value)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Quantity"
                            value={editInventoryData.quantity}
                            keyboardType="numeric"
                            onChangeText={(value) => handleChange("quantity", value)}
                        />
                        <TouchableOpacity style={styles.submitButton} onPress={handleEditSubmit}>
                            <Text style={styles.submitButtonText}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    emptyMessage: {
        textAlign: 'center',
        padding: 20,
        color: '#666',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    submitButton: {
        backgroundColor: '#630000',
        borderRadius: 4,
        paddingVertical: 10,
    },
    submitButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '600',
    },
    menuList: {
        position: 'absolute',
        right: 30,
        backgroundColor: '#fff',
        borderRadius: 5,
        elevation: 3,
        padding: 5,
        zIndex: 10,
        overflow:"visible"
    },
    menuItem: {
        padding: 10,
    },
    
    errorText: {
        color: 'red',
        textAlign: 'center',
        padding: 20,
    },
});

export default Inventory;
