import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Modal,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    Image
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getByMonthAndYear } from './SocietyMaintainanceSlice';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ImagebaseURL } from '../../../Security/helpers/axios';

const Maintenance = ({ navigation }) => {
    const dispatch = useDispatch();
    const { status, error } = useSelector((state) => state.adminMaintainance);
    const maintainances = useSelector((state) => state.adminMaintainance.maintainances) || [];
    const [date, setDate] = useState(new Date());
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [selectedMenuId, setSelectedMenuId] = useState(null);
    const DateAndMonth = (dateStr) => {
        const date = new Date(dateStr);
        // Extract the year and month
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1

        // Format the output as "YYYY-MM"
        const formattedDate = `${year} - ${month}`;
        return formattedDate
    }
    useFocusEffect(
        React.useCallback(() => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            dispatch(getByMonthAndYear(`2024-07`));
        }, [dispatch, date])
    );

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedUser(null); // Reset selected user when closing modal
    };

    const handleMenuClick = (userId) => {
        setSelectedMenuId(userId === selectedMenuId ? null : userId);
    };

    const filteredMaintainances = maintainances?.paymentDetails?.filter((item) => {
        const name = item.name?.toLowerCase() || '';
        return name.includes(searchText.toLowerCase());
    });

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowPicker(false);
        setDate(currentDate);
    };

    const renderMenu = (item) => {
        if (selectedMenuId !== item._id) return null;

        return (
            <View style={styles.menu}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Edit Amenity", { id: item._id })}
                >
                    <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setSelectedUser(item);
                        setModalVisible(true);
                        setSelectedMenuId(null);
                    }}
                >
                    <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Search"
                value={searchText}
                onChangeText={setSearchText}
            />
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker(true)}>
                <Text style={styles.dateButtonText}>Select Month and Year</Text>
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}

            <FlatList
                data={filteredMaintainances}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleViewDetails(item)}>
                        <View style={styles.itemContainer}>
                            <View style={styles.infoContainer}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Month</Text>
                                    <Text style={styles.value}>: {DateAndMonth(item.payedOn)}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Name</Text>
                                    <Text style={styles.value}>: {item.name}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Details</Text>
                                    <Text style={styles.value}>: {item.blockno}/ {item.flatno}</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.menuIcon}
                                onPress={() => handleMenuClick(item._id)}
                            >
                                <Icon name="ellipsis-vertical" size={24} color="#630000" />
                            </TouchableOpacity>
                            {renderMenu(item)}
                        </View>
                    </TouchableOpacity>
                )
                }
            />
            < TouchableOpacity
                style={styles.addButton}
                onPress={() => Alert.alert('Add Monthly Maintenance clicked')}
            >
                <Text style={styles.addButtonText}>Add Month</Text>
            </TouchableOpacity >

            {/* Modal for displaying selected user details */}
            {
                selectedUser && (
                    <Modal
                        visible={modalVisible}
                        animationType="slide"
                        transparent={true}
                    >
                        {console.log(selectedUser)}
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Image
                                    source={{ uri: `${ImagebaseURL}${selectedUser.pictures}` }} // Use the image URL
                                    style={styles.modalImage}
                                    resizeMode="cover"
                                />
                                {/* Align names and values */}
                                <View style={styles.infoContainer}>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.label}>Name</Text>
                                        <Text style={styles.value}>: {selectedUser.name}</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.label}>Block</Text>
                                        <Text style={styles.value}>: {selectedUser.blockno}</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.label}>Flat No</Text>
                                        <Text style={styles.value}>: {selectedUser.flatno}</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.label}>TX Mode</Text>
                                        <Text style={styles.value}>: {selectedUser.transactionType}</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.label}>Amount</Text>
                                        <Text style={styles.value}>: {selectedUser.paidAmount}</Text>
                                    </View>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.label}>Paid Date</Text>
                                        <Text style={styles.value}>: {new Date(selectedUser.payedOn).toLocaleDateString()}</Text>

                                    </View>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.label}>Time</Text>
                                        <Text style={styles.value}>: {new Date(selectedUser.payedOn).toLocaleTimeString()}</Text>

                                    </View>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.label}>Status</Text>
                                        <Text style={styles.value}>: {selectedUser.status}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                )
            }

        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    itemContainer: {
        padding: 15,
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
        borderRadius: 5,
        position: 'relative',
    },

    menu: {
        position: "absolute",
        top: 0,
        right: 40,
        backgroundColor: "#fff",
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
        padding: 2,
    },
    actionText: {
        paddingVertical: 7,
        paddingHorizontal: 10,
        fontSize: 16,
        color: "#222"
    },
    addButton: {
        backgroundColor: '#630000',
        padding: 15,
        borderRadius: 5,
        marginTop: 20,
    },
    addButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    dateButton: {
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 20,
    },
    dateButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    menuIcon: {
        position: 'absolute',
        top: 15,
        right: 15,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 15,
    },
    modalText: {
        fontSize: 16,
        marginVertical: 5,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#630000',
        padding: 10,
        borderRadius: 5,
        width: 80,
        height: 40
    },
    closeButtonText: {
        color: '#fff',
        textAlign: 'center',
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    infoContainer: {
        width: '100%',
        marginTop: 15,
        alignItems: "center"
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // This will ensure name and value are spaced out
        marginVertical: 2,
    },
    label: {
        fontWeight: '500',
        width: '30%', // Adjust this width as needed
        color: "#222"
    },
    value: {
        width: '70%', // Adjust this width as needed
    },
});

export default Maintenance;
