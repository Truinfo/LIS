// EmergencyContact.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmergencyContacts } from '../../../User/Redux/Slice/CommunitySlice/EmergencyContactSlice';
import {  fetchCommityMembers } from '../Profile/committeeSlice';

const Tab = createMaterialTopTabNavigator();

const ContactsTab = ({ fetchContacts, contacts, renderItem }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const societyId = "6683b57b073739a31e8350d0";
        if (societyId) {
            dispatch(fetchEmergencyContacts(societyId));
            dispatch(fetchCommityMembers(societyId));

        }
    }, [dispatch, fetchContacts]);

    return (
        <View style={styles.container}>
            <FlatList
                data={contacts}
                keyExtractor={item => item.id?.toString() || item._id?.toString()} // Fallback for keyExtractor
                renderItem={renderItem}
            />
        </View>
    );
};

const EmergencyContactsTab = () => {
    const contacts = useSelector((state) => state.emergencyContacts.contacts);

    const renderContactItem = ({ item }) => (

        <View style={styles.contactCard}>
            <Text style={styles.contactName}>{item.name}</Text>
            <Text style={styles.contactName}>{item.profession}</Text>
            <Text>{item.phoneNumber}</Text>
        </View>
    );

    return <ContactsTab fetchContacts={fetchEmergencyContacts} contacts={contacts} renderItem={renderContactItem} />;
};

const CommitteeMembersTab = () => {
    const commityMember = useSelector(state => state.commityMembers.commityMember || []);

    const renderContactItem = ({ item }) => (

        <View style={styles.contactCard}>
            <Text style={styles.contactName}>{item.name}</Text>
            <Text style={styles.contactName}>{item.designation}</Text>
            <Text>{item.phoneNumber}</Text>
        </View>
    );
    return <ContactsTab fetchContacts={fetchCommityMembers} contacts={commityMember} renderItem={renderContactItem} />;
};

const EmergencyContact = () => (
    <Tab.Navigator
        screenOptions={{
            tabBarActiveTintColor: '#7d0431',
            tabBarLabelStyle: { fontSize: 14 },
            tabBarStyle: { backgroundColor: '#ffffff' },
        }}
    >
        <Tab.Screen name="Emergency Contacts" component={EmergencyContactsTab} />
        <Tab.Screen name="Committee Members" component={CommitteeMembersTab} />
    </Tab.Navigator>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    contactCard: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    contactName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EmergencyContact;
