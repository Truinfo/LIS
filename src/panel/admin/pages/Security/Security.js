import React, { useEffect, useState } from 'react';
import { Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
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

const Security = () => {
    const [searchText, setSearchText] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionMenuVisible, setActionMenuVisible] = useState(null);

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
        Alert.alert(
            'Delete Confirmation',
            `Are you sure you want to delete ${user.name}?`,
            [
                {
                    text: 'Cancel',
                    onPress: () => setActionMenuVisible(null),
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        setSelectedUser(user);
                        dispatch(deleteGatekeepers({ id: user._id }))
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
                        setActionMenuVisible(null);
                    },
                },
            ],
            { cancelable: false }
        );
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
                <Text style={styles.modalText}>Manage Security Guards</Text>
                <Button
                    title="Add"
                    onPress={() => {
                        setActionMenuVisible(null);
                        navigation.navigate('Add Security');
                    }}
                />
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
        flexDirection: "row",
        justifyContent: 'space-between',
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
        color: '#333',
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
        color: '#000',
        fontSize: 14,
    },
});

export default Security;
