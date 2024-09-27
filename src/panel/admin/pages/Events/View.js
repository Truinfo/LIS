import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { ImagebaseURL } from '../../../Security/helpers/axios';

const ViewEvents = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { eventId } = route.params;

    // Access the events from the Redux store
    const events = useSelector(state => state.societyEvents.event); // Assuming you have an array of events
    const event = events.find((event) => event._id === eventId); // Match event by ID

    if (!event) {
        return <View style={styles.container}><Text>Event not found.</Text></View>; // Handle case when event is not found
    }

    return (
        <ScrollView>
            <View style={styles.card}>
                <Carousel
                    loop
                    width={300}
                    height={200}
                    autoPlay
                    data={event.pictures} 
                    renderItem={({ item }) => (
                        <Image
                            key={item._id}
                            source={{ uri: `${ImagebaseURL}${item.img}` }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    )}
                    style={styles.carousel}
                />
                <Text style={styles.sectionTitle}>Society Profile Details:</Text>
                <View style={styles.detailsContainer}>
                    <DetailItem style={styles.text} label="Name" value={event.name} />
                    <DetailItem label="Start Date" value={new Date(event.startDate).toLocaleString()} />
                    <DetailItem label="End Date" value={new Date(event.endDate).toLocaleString()} />
                </View>

                {/* Activities Section */}
                {event.activities && event.activities.length > 0 && (
    <>
        <Text style={styles.sectionTitle}>Activities:</Text>
        <View style={styles.detailsContainer}>
            {event.activities.map((activity) => (
                <DetailItem key={activity._id} label="Activity Type" value={activity.type} />
            ))}
        </View>
    </>
)}

                {/* Registrations Section */}
                {event.registrations && event.registrations.length > 0 && (
    <>
        <Text style={styles.sectionTitle}>Registrations:</Text>
        <View style={styles.detailsContainer}>
            <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Participant ID</Text>
                <Text style={styles.tableHeaderText}>Participant Name</Text>
                <Text style={styles.tableHeaderText}>Activities</Text>
            </View>
            {event.registrations.map((registration) => (
                <View key={registration._id} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{registration.participantId}</Text>
                    <Text style={styles.tableCell}>{registration.participantName}</Text>
                    <Text style={styles.tableCell}>
                        {registration.activity.join(", ")} {/* Join activities in a string */}
                    </Text>
                </View>
            ))}
        </View>
    </>
)}

            </View>
        </ScrollView>
    );
};

const DetailItem = ({ label, value }) => (
    <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    card: {
        borderColor: 'lightgrey',
        borderWidth: 1,
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
    },
    carousel: {
        marginBottom: 20,
        borderRadius: 10,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: "#630000",
        marginVertical: 10,
    },
    detailsContainer: {
        borderColor: 'lightgrey',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 1,
        paddingVertical: 10,
    },
    tableHeaderText: {
        fontWeight: '700',
        flex: 1,
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
    },
    detailItem: {
        marginBottom: 10,
    },
    detailLabel: {
        fontSize: 18,
        fontWeight: '600',
    },
    detailValue: {
        fontSize: 16,
    },
    text: {
        flexDirection: "row", 
    }
});

export default ViewEvents;
