// EmergencyContact.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, Button } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmergencyContacts } from '../../../User/Redux/Slice/CommunitySlice/EmergencyContactSlice';
import { fetchCommityMembers } from '../Profile/committeeSlice';
import { FAB, IconButton } from 'react-native-paper';

const Tab = createMaterialTopTabNavigator();

const ContactsTab = ({ fetchContacts, contacts, renderItem }) => {
    const dispatch = useDispatch();
    const societyId = "6683b57b073739a31e8350d0";

    useEffect(() => {
        if (societyId) {
            dispatch(fetchContacts(societyId));
        }
    }, [dispatch, fetchContacts, societyId]);

    return (
        <View style={styles.container}>
            <FlatList
                data={contacts}
                keyExtractor={item => item.id?.toString() || item._id?.toString()}
                renderItem={renderItem}
            />
        </View>
    );
};

const EmergencyContactsTab = () => {
    const contacts = useSelector(state => state.emergencyContacts.contacts);
    const renderContactItem = ({ item }) => (
        <View style={styles.contactCard}>
            <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text>{item.profession}</Text>
                <Text>{item.phoneNumber}</Text>
            </View>
            <IconButton
                icon="dots-vertical"
                onPress={() => console.log('More options')}
                size={20}
                style={styles.iconButton}
            />
        </View>
    );

    return <ContactsTab fetchContacts={fetchEmergencyContacts} contacts={contacts} renderItem={renderContactItem} />;
};

const CommitteeMembersTab = () => {
    const members = useSelector(state => state.commityMembers.commityMember || []);
    const renderContactItem = ({ item }) => (
        <View style={styles.contactCard}>
            <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text>{item.designation}</Text>
                <Text>{item.phoneNumber}</Text>
            </View>
            <IconButton
                icon="dots-vertical"
                onPress={() => console.log('More options')}
                size={20}
                style={styles.iconButton}
            />
        </View>
    );

    return <ContactsTab fetchContacts={fetchCommityMembers} contacts={members} renderItem={renderContactItem} />;
};

const EmergencyContact = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('Emergency Contacts');

    const handleFABPress = () => setModalVisible(true);

    const modalContent = activeTab === 'Emergency Contacts'
        ? 'Add Emergency Contact'
        : 'Add Committee Member';

    return (
        <>
            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: '#7d0431',
                    tabBarLabelStyle: { fontSize: 14 },
                    tabBarStyle: { backgroundColor: '#ffffff' },
                }}
            >
                {['Emergency Contacts', 'Committee Members'].map(tab => (
                    <Tab.Screen
                        key={tab}
                        name={tab}
                        component={tab === 'Emergency Contacts' ? EmergencyContactsTab : CommitteeMembersTab}
                        listeners={{
                            tabPress: () => setActiveTab(tab),
                        }}
                    />
                ))}
            </Tab.Navigator>

            <FAB
                style={styles.fab}
                icon="plus"
                onPress={handleFABPress}
                color='white'
            />

            <Modal
                animationType="slide"
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{modalContent}</Text>
                        {/* Your form or additional content goes here */}
                        <Button title="Close" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    contactCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', // Center align the items
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    contactInfo: {
        flex: 1, 
    },
    iconButton: {
        marginLeft: 10, 
    },



    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: "#7d0431",
        borderRadius: 50,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default EmergencyContact;
