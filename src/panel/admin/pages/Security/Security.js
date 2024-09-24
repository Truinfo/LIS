import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { TouchableWithoutFeedback, Keyboard } from 'react-native'; // Import TouchableWithoutFeedback
=======
import { Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
>>>>>>> 9c8e5e1284aa668c790d0569eeef899252b23e91
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    Button,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGatekeepers, deleteGatekeepers } from './GateKeeperSlice';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ImagebaseURL } from '../../../Security/helpers/axios';
import { useCallback } from 'react';
import Toast from 'react-native-toast-message';
import Modal from 'react-native-modal'; // Import Modal

const Security = () => {
    const [searchText, setSearchText] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionMenuVisible, setActionMenuVisible] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false); // State for modal visibility

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const sequrity = useSelector(state => state.gateKeepers.sequrity || []);

    useFocusEffect(
        useCallback(() => {
            dispatch(fetchGatekeepers());
        }, [dispatch])
    );

    const handleView = (user) => {
        navigation.navigate('View Security', { sequrityId: user.sequrityId });
        setActionMenuVisible(null);
    };

    const handleEdit = (user) => {
        navigation.navigate('Edit Security', { sequrityId: user.sequrityId });
        setActionMenuVisible(null);
    };

    const handleAttendance = (user) => {
        navigation.navigate('Attendance', { sequrityId: user.sequrityId });
        setActionMenuVisible(null);
    };

    const handleDelete = (user) => {
        setSelectedUser(user);
        setModalVisible(true); // Show the modal
        setActionMenuVisible(null);
    };

    const confirmDelete = () => {
        dispatch(deleteGatekeepers({ id: selectedUser._id }))
            .then(() => {
                Toast.show({
                    text1: 'Deleted',
                    text2: 'Security guard deleted successfully!',
                    type: 'success',
                });
                dispatch(fetchGatekeepers());
            })
            .catch((error) => {
                console.error('Error:', error);
                Toast.show({
                    text1: 'Error',
                    text2: 'Failed to delete security guard.',
                    type: 'error',
                });
            });
        setModalVisible(false); // Hide the modal
    };

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.text}>
                <Text style={{ fontWeight: 'bold' }}>Security ID: </Text>
                {item.sequrityId}
            </Text>
            <Image
                source={{ uri: `${ImagebaseURL}${item.pictures}` }}
                style={styles.image}
            />
            <Text style={styles.text}>
                <Text style={{ fontWeight: 'bold' }}>Name: </Text>
                {item.name}
            </Text>
            <Text style={styles.text}>
                <Text style={{ fontWeight: 'bold' }}>Email: </Text>
                {item.email}
            </Text>
            <Text style={styles.text}>
                <Text style={{ fontWeight: 'bold' }}>Mobile: </Text>
                {item.phoneNumber}
            </Text>
            <Text style={styles.text}>
                <Text style={{ fontWeight: 'bold' }}>Aadhar: </Text>
                {item.aadharNumber}
            </Text>

            {/* Three dots button */}
            <TouchableOpacity
                onPress={() => setActionMenuVisible(actionMenuVisible === item._id ? null : item._id)}
                style={styles.dotsButton}
            >
                <Text style={styles.dotsText}>•••</Text>
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
                    <TouchableOpacity onPress={() => handleAttendance(item)} style={styles.menuButton}>
                        <Text style={styles.buttonText}>Attendance</Text>
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
            <View style={styles.mainrow}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        setActionMenuVisible(null);
                        navigation.navigate('Add Security');
                    }}
                >
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={Array.isArray(sequrity) ? sequrity.filter(user =>
                    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchText.toLowerCase())
                ) : []}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                keyboardShouldPersistTaps="handled"
            />

<<<<<<< HEAD
            {/* Modal for delete confirmation */}
            <Modal isVisible={isModalVisible}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalMainText}>Delete Confirmation</Text>
                    <Text style={styles.modalText}>Are you sure you want to delete {selectedUser?.name}?</Text>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={confirmDelete} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>Yes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

=======
>>>>>>> 9c8e5e1284aa668c790d0569eeef899252b23e91
            {/* Toast Message */}
            <Toast />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    mainrow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    row: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    text: {
        fontSize: 16,
        marginBottom: 5,
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginBottom: 10,
    },
    dotsButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
    },
    dotsText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#7D0431',
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
        paddingHorizontal: 10,
    },
    buttonText: {
        fontSize: 14,
    },
    addButton: {
        width: 50,
        backgroundColor: '#7D0431',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center', 
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalMainText: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight:'bold',
        color: '#7D0431',
    },
    modalButtonText: {
        fontSize: 15,
        textAlign: 'center',
        fontWeight:'bold',
        color: 'white',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
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
});

export default Security;
