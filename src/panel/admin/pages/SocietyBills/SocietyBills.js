import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Linking,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import {
    Button,
    Card,
    Dialog,
    Portal,
    Menu,
    Paragraph,
    Provider as PaperProvider,
    Text,
    Searchbar,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { deleteBill, fetchBillsBySocietyId } from './SocietyBillsSlice';
import { ImagebaseURL } from '../../../Security/helpers/axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SocietyBills = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { status, error, successMessage } = useSelector((state) => state.adminSocietyBills);
    const bills = useSelector((state) => Array.isArray(state.adminSocietyBills.bills) ? state.adminSocietyBills.bills : []);

    const [searchQuery, setSearchQuery] = useState('');
    const [visibleMenu, setVisibleMenu] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    // Debugging: Log selectedBill whenever it changes
    useEffect(() => {
        console.log("selectedBill", selectedBill);
    }, [selectedBill]);

    useEffect(() => {
        dispatch(fetchBillsBySocietyId());
    }, [dispatch]);

    useEffect(() => {
        if (successMessage) {
            setShowSuccessDialog(true);
            setTimeout(() => {
                setShowSuccessDialog(false);
            }, 2000);
        }
    }, [successMessage]);

    const openMenu = (bill) => {
        setSelectedBill(bill);
        setVisibleMenu(true);
    };

    const closeMenu = () => {
        setVisibleMenu(false);
        // Do not clear selectedBill here to avoid losing the selection when viewing
    };

    // Updated handleView to accept the bill as a parameter
    const handleView = (bill) => {
        setSelectedBill(bill);
        setDialogVisible(true);
        closeMenu();
    };

    const handleEdit = () => {
        if (selectedBill) {
            closeMenu();
            navigation.navigate('EditSocietyBill', { id: selectedBill._id });
        }
    };

    const handleDelete = () => {
        setDeleteDialogVisible(true);
        closeMenu();
    };

    const confirmDelete = () => {
        if (selectedBill) {
            dispatch(deleteBill({ id: selectedBill._id }))
                .then(() => {
                    setDeleteDialogVisible(false);
                    setSelectedBill(null);
                })
                .catch((err) => {
                    setDeleteDialogVisible(false);
                    Alert.alert('Error', 'Failed to delete the bill.');
                });
        }
    };

    const cancelDelete = () => {
        setDeleteDialogVisible(false);
        // Optionally, you can clear selectedBill here if needed
        // setSelectedBill(null);
    };

    const onChangeSearch = (query) => setSearchQuery(query.toLowerCase());

    const filteredBills = bills.filter((bill) => {
        const { sender = '', Subject = '', Description = '', Date = '', Status = '' } = bill;
        return (
            sender.toLowerCase().includes(searchQuery) ||
            Subject.toString().toLowerCase().includes(searchQuery) ||
            Description.toString().toLowerCase().includes(searchQuery) ||
            Date.toLowerCase().includes(searchQuery) ||
            (Status && Status.toLowerCase().includes(searchQuery))
        );
    });
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }).replace(',', '');
    };

    const colors = {
        iconButtonColor: '#7D0431',
    };
    if (status === "loading") {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#7D0431" />
            </View>
        );
    }

    if (!bills || !bills.length === 0) { // Show spinner while loading
        return (
            <View style={styles.noDataContainer}>
                <Image
                    source={require('../../../../assets/Admin/Imgaes/nodatadound.png')}
                    style={styles.noDataImage}
                    resizeMode="contain"
                />
                <Text style={styles.noDataText}>No Amenities Found</Text>
            </View>
        );
    }
    const renderItem = ({ item }) => (
        <Card style={styles.card} onPress={() => handleView(item)}>
            <View style={styles.titleContainer}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Menu

                    visible={visibleMenu && selectedBill?._id === item._id}
                    onDismiss={closeMenu}
                    anchor={
                        <Icon
                            name="more-vert"
                            size={24}
                            color="#7D0431"
                            onPress={() => openMenu(item)}
                        />
                    }
                >
                    <Menu.Item onPress={handleEdit} title="Edit" />
                    <Menu.Item onPress={handleDelete} title="Delete" style={{ color: 'red' }} />
                </Menu>

            </View>

            <Card.Content>
                <View style={styles.details}>
                    <Text style={styles.detailLabel}>Month & Year:</Text>
                    <Text style={styles.detailValue}>{item.monthAndYear}</Text>
                </View>
                <View style={styles.details}>
                    <Text style={styles.detailLabel}>Amount:</Text>
                    <Text style={styles.detailValue}>{item.amount}</Text>
                </View>
                <View style={styles.details}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <Text style={styles.detailValue}>{item.status}</Text>
                </View>
                <View style={styles.details}>
                    <Text style={styles.detailLabel}>Date:</Text>
                    <Text style={styles.detailValue}>{formatDate(item.date)}</Text>
                </View>
                {item.pictures ? (
                    <TouchableOpacity
                        style={styles.downloadButton}
                        onPress={() => Linking.openURL(`${ImagebaseURL}${item.pictures}`)}
                    >
                        <Icon name="file-download" size={20} color="#7D0431" />
                        <Text style={styles.downloadText}>Download Document</Text>
                    </TouchableOpacity>
                ) : (
                    <Text>No Document</Text>
                )}
            </Card.Content>
        </Card>
    );

    if (status === 'loading') {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#630000" />
            </View>
        );
    }

    if (status === 'failed') {
        return (
            <View style={styles.center}>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    return (
        <PaperProvider>

            <FlatList
                data={filteredBills}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text>No Data Found</Text>
                    </View>
                }
            />

            {/* View Details Dialog */}
            <Portal>
                <Dialog
                    visible={dialogVisible}
                    onDismiss={() => setDialogVisible(false)}
                >
                    <Dialog.Title style={styles.dialogTitle}>Details</Dialog.Title>
                    <Dialog.Content>
                        {selectedBill ? (
                            <>
                                <View style={styles.selectDetails}>
                                    <Text style={styles.selectDetailLabel}>ID</Text>
                                    <Text style={styles.selectDetailValue}>{selectedBill._id}</Text>
                                </View>
                                <View style={styles.selectDetails}>
                                    <Text style={styles.selectDetailLabel}>Bill</Text>
                                    <Text style={styles.selectDetailValue}>{selectedBill.name}</Text>
                                </View>
                                <View style={styles.selectDetails}>
                                    <Text style={styles.selectDetailLabel}>Amount</Text>
                                    <Text style={styles.selectDetailValue}>{selectedBill.amount}</Text>
                                </View>
                                <View style={styles.selectDetails}>
                                    <Text style={styles.selectDetailLabel}>Date</Text>
                                    <Text style={styles.selectDetailValue}>{formatDate(selectedBill.date)}</Text>
                                </View>
                            </>
                        ) : (
                            <Paragraph>No details available.</Paragraph>
                        )}
                    </Dialog.Content>
                    <Dialog.Actions>
                        <TouchableOpacity
                            style={styles.dialogButton}
                            onPress={() => setDialogVisible(false)}
                        >
                            <Text style={styles.dialogButtonText}>Close</Text>
                        </TouchableOpacity>
                    </Dialog.Actions>

                </Dialog>
            </Portal>

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => {
                    navigation.navigate('Add Security');
                }}
            >
                <Icon name="add" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Delete Confirmation Dialog */}
            <Portal>
                <Dialog
                    visible={deleteDialogVisible}
                    onDismiss={cancelDelete}
                >
                    <Dialog.Title>Confirm Delete</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Are you sure you want to delete this bill?</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={cancelDelete}>Cancel</Button>
                        <Button onPress={confirmDelete}>Confirm</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            {/* Success Message Dialog */}
            <Portal>
                <Dialog
                    visible={showSuccessDialog}
                    onDismiss={() => setShowSuccessDialog(false)}
                >
                    <Dialog.Content>
                        <Paragraph>{successMessage}</Paragraph>
                    </Dialog.Content>
                </Dialog>
            </Portal>
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    appbarTitle: {
        alignItems: 'center',
    },
    searchbar: {
        margin: 10,
    },
    list: {
        paddingHorizontal: 10,
    },
    card: {
        marginVertical: 10,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 15,
    },
    cardTitle: {
        fontWeight: '700',
        fontSize: 18,
        color: '#7D0431',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
    },
    center: {
        alignItems: 'center',
        marginTop: 20,
    },
    dialogTitle: {
        fontSize: 21,
        fontWeight: '700',
        color: '#630000',
        alignSelf: 'center'
    },
    dialogButton: {
        padding: 10,
        backgroundColor: '#7D0431',
        borderRadius: 5,
        alignItems: 'center',
    },
    dialogButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 12,
    },
    downloadButton: {
        flex: 1.5,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        alignSelf: 'flex-end',
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
    },
    downloadText: {
        color: '#7D0431',
        marginLeft: 5,
        fontSize: 16,
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
        elevation: 6, // Add shadow on Android
        shadowColor: '#000', // Add shadow on iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    details: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    detailLabel: {
        fontWeight: "700",
        flex: 1.5,
        fontSize: 16,
        color: 'gray'
    },
    detailValue: {
        flex: 2,
        fontSize: 16,
        color: '#555',
    },
    selectDetails: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 5,
    },
    selectDetailLabel: {
        fontWeight: "700",
        flex: 1,
        fontSize: 15,

    },
    selectDetailValue: {
        flex: 3,
        fontSize: 15,
        color: '#555',
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
});


export default SocietyBills;
