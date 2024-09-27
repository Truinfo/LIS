import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Modal, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvent, deleteEvent } from './EventSlice';
import { useNavigation } from '@react-navigation/native';
import { ImagebaseURL } from '../../../Security/helpers/axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Events = () => {
    const dispatch = useDispatch();
    const { status, error, event } = useSelector(state => state.societyEvents);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [actionMenuVisible, setActionMenuVisible] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        dispatch(fetchEvent());
    }, [dispatch]);

    const handleView = (event) => {
      console.log("clicked")
        navigation.navigate('View Events', { eventId: event._id });

        setActionMenuVisible(null);
    };

    const handleEdit = (event) => {
        navigation.navigate('Edit Event', { eventId: event._id });
        setActionMenuVisible(null);
    };

    const handleDelete = (event) => {
        setSelectedEvent(event);
        setDeleteDialogOpen(true);
        setActionMenuVisible(null);
    };

    const confirmDelete = () => {
        dispatch(deleteEvent(selectedEvent._id))
            .then(() => {
                Alert.alert('Deleted', 'Event deleted successfully!');
                dispatch(fetchEvent());
                setDeleteDialogOpen(false);
                setSelectedEvent(null);
            })
            .catch((error) => {
                console.error("Error:", error);
                setDeleteDialogOpen(false);
            });
    };

    const cancelDelete = () => {
        setDeleteDialogOpen(false);
    };

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <Image
              source={{ uri: `${ImagebaseURL}${item.pictures[0]?.img}` }}
              style={styles.image}
            />
            <View style={styles.details}>
                <Text style={styles.detailLabel}>Event Name:</Text>
                <Text style={styles.detailValue}>{item.name}</Text>
            </View>
            <View style={styles.details}>
                <Text style={styles.detailLabel}>Start Date:</Text>
                <Text style={styles.detailValue}>{item.startDate}</Text>
            </View>
            <View style={styles.details}>
                <Text style={styles.detailLabel}>End Date:</Text>
                <Text style={styles.detailValue}>{item.endDate}</Text>
            </View>
            <TouchableOpacity
                onPress={() => setActionMenuVisible(actionMenuVisible === item._id ? null : item._id)}
                style={styles.dotsButton}
            >
                <Icon name="more-vert" size={24} color="#7D0431" />
            </TouchableOpacity>

            {/* Action Menu */}
            {actionMenuVisible === item._id && (
                <View style={styles.actionMenu}>
                    <TouchableOpacity onPress={() => handleView(item)} style={styles.menuButton}>
                        <Text style={styles.buttonText}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleEdit(item)} style={styles.menuButton}>
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item)} style={styles.menuButton}>
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={event}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                keyboardShouldPersistTaps="handled"
            />

            {/* Floating Action Button */}
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => navigation.navigate('Add Event')}
            >
                <Icon name="add" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Delete Confirmation Modal */}
            <Modal visible={deleteDialogOpen} transparent={true}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalText}>Are you sure you want to delete this event?</Text>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity onPress={cancelDelete} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={confirmDelete} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Yes</Text>
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
        padding: 10,
    },
    row: {
        flexDirection: 'column',
        padding: 10,
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
        borderRadius: 8,
    },
    image: {
        width: '90%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
    },
    details: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    detailLabel: {
        fontWeight: 'bold',
        flex: 1,
        fontSize: 16,
    },
    detailValue: {
        flex: 2,
        fontSize: 16,
        color: '#333',
    },
    dotsButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    actionMenu: {
        position: 'absolute',
        top: 50,
        right: 10,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        elevation: 3,
    },
    menuButton: {
        paddingVertical: 5,
    },
    buttonText: {
        fontSize: 14,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#7D0431',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        backgroundColor: '#7D0431',
        padding: 10,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
    },
});

export default Events;
