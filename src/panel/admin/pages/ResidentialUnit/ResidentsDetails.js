import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ImagebaseURL } from '../../../Security/helpers/axios';
import Collapsible from 'react-native-collapsible';
import { fetchServicePerson } from '../../../User/Redux/Slice/ProfileSlice/manageServiceSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFrequentVisitors } from '../../../User/Redux/Slice/ProfileSlice/Household/frequentVisitorsSlice';

const ResidentDetails = ({ route }) => {
    const { resident } = route.params;
    const { societyId, buildingName, flatNumber } = resident;
    const dispatch = useDispatch();
    const { servicePerson, error, loading } = useSelector((state) => state.manageServices);
    const { services } = servicePerson || {};
    const { visitors, fetchStatus } = useSelector(state => state.frequentVisitor);
    const serviceType = [
        { id: 'maid', type: 'Maid' },
        { id: 'milkMan', type: 'Milkman' },
        { id: 'cook', type: 'Cook' },
        { id: 'paperBoy', type: 'Paperboy' },
        { id: 'driver', type: 'Driver' },
        { id: 'water', type: 'Water' },
        { id: 'plumber', type: 'Plumber' },
        { id: 'carpenter', type: 'Carpenter' },
        { id: 'electrician', type: 'Electrician' },
        { id: 'painter', type: 'Painter' },
        { id: 'moving', type: 'Moving' },
        { id: 'mechanic', type: 'Mechanic' },
        { id: 'appliance', type: 'Appliance' },
        { id: 'pestClean', type: 'Pest Clean' }
    ];

    // State to control the accordion
    const [collapsedFamily, setCollapsedFamily] = useState(true);
    const [collapsedPets, setCollapsedPets] = useState(true);
    const [collapsedVehicles, setCollapsedVehicles] = useState(true);
    const [collapsedDailyHelp, setCollapsedDailyHelp] = useState(true);
    const [collapsedVisitors, setCollapsedVisitors] = useState(true);

    // Toggle functions
    const toggleFamily = () => setCollapsedFamily(!collapsedFamily);
    const togglePets = () => setCollapsedPets(!collapsedPets);
    const toggleVehicles = () => setCollapsedVehicles(!collapsedVehicles);
    const toggleDailyHelp = () => setCollapsedDailyHelp(!collapsedDailyHelp);
    const toggleVisitors = () => setCollapsedVisitors(!collapsedVisitors);

    useEffect(() => {
        if (societyId && buildingName && flatNumber) {
            dispatch(fetchServicePerson({ societyId, block: buildingName, flatNumber }));
            dispatch(fetchFrequentVisitors({ societyId, block: buildingName, flatNo: flatNumber }));
        }
    }, [dispatch, societyId, buildingName, flatNumber]);

    const renderServiceList = (serviceCategory, serviceName) => {
        if (!services || !services[serviceCategory] || services[serviceCategory].length === 0) {
            return null;
        }
        return (
            <View key={serviceCategory}>
                {services[serviceCategory].map((item) => (
                    <View key={item._id} style={styles.listItem}>
                        <Text style={styles.listTitle}>{item.name} ({serviceName})</Text>
                        <Text style={styles.subText}>Phone: {item.phoneNumber}</Text>
                        <Text style={styles.subText}>Address: {item.address}</Text>
                        <Text style={styles.subText}>Timings: {item.timings}</Text>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
                <Avatar.Image
                    source={{ uri: `${ImagebaseURL}${resident.profilePicture}` }}
                    size={110}
                    style={{ backgroundColor: "#ccc" }}
                />
                <View style={styles.profileDetails}>
                    <Text style={styles.name}>{resident.name}</Text>
                    <View style={styles.infoRow}>
                        <Icon name="email" size={18} color="#777" />
                        <Text style={styles.details}>{resident.email}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon name="phone" size={18} color="#777" />
                        <Text style={styles.details}>{resident.mobileNumber}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon name="location-city" size={18} color="#777" />
                        <Text style={styles.details}>{resident.buildingName}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon name="home" size={18} color="#777" />
                        <Text style={styles.details}>Flat: {resident.flatNumber}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon name="person" size={18} color="#777" />
                        <Text style={styles.details}>{resident.userType}</Text>
                    </View>
                </View>
            </View>

            {/* Family Members Section */}
            <TouchableOpacity onPress={toggleFamily} style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Family Members</Text>
                <Icon name={collapsedFamily ? "keyboard-arrow-down" : "keyboard-arrow-up"} size={24} color="#424242" />
            </TouchableOpacity>
            <Collapsible collapsed={collapsedFamily}>
                {resident.familyMembers.length > 0 ? (
                    resident.familyMembers.map((item) => (
                        <View key={item._id} style={styles.listItem}>
                            <Text style={styles.listTitle}>{item.name} ({item.Relation})</Text>
                            <Text style={styles.subText}>Age: {item.age}</Text>
                            <Text style={styles.subText}>Gender: {item.gender}</Text>
                            <Text style={styles.subText}>Mobile: {item.mobileNumber}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noData}>No family members found.</Text>
                )}
            </Collapsible>

            {/* Pets Section */}
            <TouchableOpacity onPress={togglePets} style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Pets</Text>
                <Icon name={collapsedPets ? "keyboard-arrow-down" : "keyboard-arrow-up"} size={24} color="#424242" />
            </TouchableOpacity>
            <Collapsible collapsed={collapsedPets}>
                {resident.pets.length > 0 ? (
                    resident.pets.map((item) => (
                        <View key={item._id} style={styles.listItem}>
                            <Text style={styles.listTitle}>{item.petName} ({item.petType})</Text>
                            <Text style={styles.subText}>Breed: {item.breed}</Text>
                            <Text style={styles.subText}>Age: {item.age}</Text>
                            <Text style={styles.subText}>Gender: {item.gender}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noData}>No pets found.</Text>
                )}
            </Collapsible>

            {/* Vehicles Section */}
            <TouchableOpacity onPress={toggleVehicles} style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Vehicles</Text>
                <Icon name={collapsedVehicles ? "keyboard-arrow-down" : "keyboard-arrow-up"} size={24} color="#424242" />
            </TouchableOpacity>
            <Collapsible collapsed={collapsedVehicles}>
                {resident.Vehicle.length > 0 ? (
                    resident.Vehicle.map((item) => (
                        <View key={item._id} style={styles.listItem}>
                            <Text style={styles.listTitle}>{item.brand} ({item.type})</Text>
                            <Text style={styles.subText}>Model: {item.modelName}</Text>
                            <Text style={styles.subText}>Vehicle Number: {item.vehicleNumber}</Text>
                            <Text style={styles.subText}>Driver: {item.driverName}</Text>
                            <Text style={styles.subText}>Driver's Mobile: {item.mobileNumber}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noData}>No vehicles found.</Text>
                )}
            </Collapsible>

            {/* Daily Help Section */}
            <TouchableOpacity onPress={toggleDailyHelp} style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Daily Help</Text>
                <Icon name={collapsedDailyHelp ? "keyboard-arrow-down" : "keyboard-arrow-up"} size={24} color="#424242" />
            </TouchableOpacity>
            <Collapsible collapsed={collapsedDailyHelp}>
                {serviceType.map((service) => renderServiceList(service.id, service.type))}
            </Collapsible>

            {/* Frequent Visitors Section */}
            <TouchableOpacity onPress={toggleVisitors} style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Frequent Visitors</Text>
                <Icon name={collapsedVisitors ? "keyboard-arrow-down" : "keyboard-arrow-up"} size={24} color="#424242" />
            </TouchableOpacity>
            <Collapsible collapsed={collapsedVisitors}>
                {visitors.length > 0 ? (
                    visitors.map((visitor) => (
                        <View key={visitor._id} style={styles.listItem}>
                            <Text style={styles.listTitle}>{visitor.name}</Text>
                            <Text style={styles.subText}>Phone: {visitor.mobileNumber}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noData}>No frequent visitors found.</Text>
                )}
            </Collapsible>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 20,
        backgroundColor: '#f0f0f0',
    },
    profileSection: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center',
        gap: 15, paddingHorizontal: 10
    },
    profileDetails: {
        marginLeft: 10,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    details: {
        marginLeft: 5,
        color: '#777',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 5,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    listItem: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 5,
    },
    listTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    subText: {
        fontSize: 14,
        color: '#555',
    },
    noData: {
        padding: 10,
        color: '#888',
        fontStyle: 'italic',
    },
});

export default ResidentDetails;
