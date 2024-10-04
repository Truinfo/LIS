
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { fetchComplaints } from '../Complaints/ComplaintSlice';
import { getAllServicePersons } from '../Services/ServicesSlice';
import { fetchGatekeepers } from '../Security/GateKeeperSlice';
import { fetchAdvertisements } from '../Advertisements/AdvertisementSlice';
import { fetchnoticeById } from '../NoticeBoard/NoticeSlice';
import { fetchEvent } from '../Events/EventSlice';
import { getByMonthAndYear } from '../Maintenance/SocietyMaintainanceSlice';
import { fetchResidentProfile } from '../Advertisements/profileSlice';
import { Card, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { fetchUsers } from '../ResidentialUnit/ResidentsSlice';
const Dashboard = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    // Complaints
    const fetchedComplaints = useSelector(state => state.adminComplaints.complaints || []);
    const complaintsCount = fetchedComplaints.length;
    // Approval request 
    const { users } = useSelector(state => state.AdminResidents || []);
    // Users
    const fetchedProfile = useSelector(state => state.profile.profile);
    const blocksCount = fetchedProfile.blocks ? fetchedProfile.blocks.length : 0;
    const flatsCount = fetchedProfile?.blocks?.reduce((total, block) => total + block.flats.length, 0);
    // Get current month and year for maintenance fetch
    const getCurrentMonthAndYear = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        return `${year}-${month}`;
    };
    const monthAndYear = getCurrentMonthAndYear();
    useEffect(() => {
        dispatch(fetchComplaints());
        dispatch(getAllServicePersons());
        dispatch(fetchResidentProfile());
        dispatch(fetchGatekeepers());
        dispatch(fetchAdvertisements());
        dispatch(fetchnoticeById());
        dispatch(fetchEvent());
        dispatch(getByMonthAndYear(monthAndYear));
        dispatch(fetchUsers());
    }, [dispatch]);
    const handleNavigation = (route) => {
        navigation.navigate(route);
    };
    const handleApprove = () => {
        Alert.alert('Request Approved!');
    };
    const handleDecline = () => {
        Alert.alert('Request Declined!');
    };
    const unverifiedResidents = users.filter((eachRes) => eachRes.isVerified === false);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.row}>
                <DashboardCard title="Blocks" count={blocksCount} onPress={() => handleNavigation('UserManagement')} />
                <DashboardCard title="Flats" count={flatsCount ? flatsCount : 0} onPress={() => handleNavigation('UserManagement')} />
                <DashboardCard title="Complaints" count={complaintsCount} onPress={() => handleNavigation('Complaints')} />
            </View>
            <View>
                {unverifiedResidents.length > 0 && (
                    <Text style={styles.ApprovalHeader}>Residential Approval Request</Text>
                )}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                >
                    {unverifiedResidents.slice(0, 3).map((eachRes) => (  // Only display first 3 cards
                        <Card style={styles.Approvalcard} key={eachRes._id}>
                            <Card.Content>
                                <View style={styles.header}>
                                    <Ionicons name="person-circle" size={24} color="#7d0431" />
                                    <Text style={styles.title}>{eachRes.name}</Text>
                                </View>
                                <Text style={styles.message}>
                                    {`Approval Request from ${eachRes.buildingName} / ${eachRes.flatNumber}`}
                                </Text>
                                <Text style={styles.date}>
                                    {new Date(eachRes.updatedAt).toLocaleDateString()}
                                </Text>
                            </Card.Content>
                            <Card.Actions style={styles.actions}>
                                <Button
                                    mode="contained"
                                    onPress={() => handleApprove(eachRes._id)}  // Assuming you handle approvals by ID
                                    style={styles.approveButton}
                                >
                                    Approve
                                </Button>
                                <Button
                                    mode="outlined"
                                    onPress={() => handleDecline(eachRes._id)}  // Assuming you handle declines by ID
                                    style={styles.declineButton}
                                >
                                    Decline
                                </Button>
                            </Card.Actions>
                        </Card>
                    ))}

                    {unverifiedResidents.length > 3 && (
                        <Card style={styles.Viewcard} key="view-more" onPress={() => navigation.navigate('Residential Approvals')}>
                            <Card.Content>
                                <View style={styles.header}>
                                    <Ionicons name="chevron-forward-circle-outline" size={24} color="#7d0431" />
                                    <Text style={styles.ViewMoretitle}>View More</Text>
                                </View>
                            </Card.Content>
                        </Card>
                    )}
                </ScrollView>
            </View>

        </ScrollView >
    );
};

const DashboardCard = ({ title, count, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardCount}>{count}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '30%',
        marginVertical: 5,
        borderWidth: 2,
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: "#d2d4d2",
    },
    cardTitle: {
        fontSize: 15,
        color: '#7d0431',
        fontWeight: '600',
    },
    ApprovalHeader: {
        fontSize: 18,
        color: '#7d0431',
        fontWeight: '700',
        paddingTop: 10
    },
    cardCount: {
        fontSize: 24,
        color: '#7d0431',
        fontWeight: '700',
        marginTop: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    ViewMoretitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
        color: "#7d0431"
    },
    message: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    date: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    actions: {
        justifyContent: 'space-between',
    },
    approveButton: {
        backgroundColor: '#7d0431',
        flex: 1,
        marginRight: 8,
    },
    declineButton: {
        flex: 1,
    },
    Approvalcard: {
        marginTop: 10,
        marginBottom: 10,
        marginRight: 15,
        elevation: 4,
        padding: 5
    },
    Viewcard: {
        marginTop: 10,
        marginBottom: 10,
        marginRight: 15,
        elevation: 4,
        padding: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    cardView: {
        flex: 1,
        justifyContent: "flex-start",
        flexDirection: "row",
        alignItems: "center",
    },
    viewMoreButton: {
        backgroundColor: "transparent",
        color: "#7d0431"
    }
});

export default Dashboard;
