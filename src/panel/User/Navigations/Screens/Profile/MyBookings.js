import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchAmenityBookings } from "../../../Redux/Slice/ProfileSlice/MyBookingSlice";

const MyBookings = () => {
    const dispatch = useDispatch();
    const [userId, setUserId] = useState("");
    const [societyId, setSocietyId] = useState("");
    const { bookings } = useSelector((state) => state.myBookings.bookings);

    useEffect(() => {
        const getUserName = async () => {
            try {
                const userString = await AsyncStorage.getItem("user");
                if (userString !== null) {
                    const user = JSON.parse(userString);
                    setUserId(user.userId);
                    setSocietyId(user.societyId);
                }
            } catch (error) {
                console.error("Failed to fetch the user from async storage", error);
            }
        };

        getUserName();
    }, []);

    useEffect(() => {
        if (societyId && userId) {
            dispatch(fetchAmenityBookings({ id: societyId, userId }));
        }
    }, [dispatch, societyId, userId]);
    return (
        <View style={styles.container}>
            {bookings && bookings.length > 0 ? (
                bookings.map((booking) => (
                    <View key={booking._id} style={styles.card}>
                        {/* Status Chip */}
                        <View style={styles.statusChip}>
                            <Text style={styles.statusText}>{booking.status}</Text>
                        </View>

                        <Text style={styles.title}>{booking.eventName}</Text>
                        <Text>bookedDate: {booking.bookedDate}</Text>
                        <Text>dateOfBooking: {booking.dateOfBooking}</Text>
                        <Text>payed: {booking.payed}</Text>
                        {booking.pending === 0 && (
                            <>
                                <Text>pending: {booking.pending}</Text>
                                {booking.paymentDetails && (
                                    <Text>Total amount: {booking.paymentDetails.amount}</Text>
                                )}
                            </>
                        )}
                    </View>
                ))
            ) : (
                <Text>No bookings found</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f0f0f0",
    },
    card: {
        padding: 16,
        marginBottom: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        position: "relative", // To enable absolute positioning inside
    },
    statusChip: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "#4caf50", // Green color for approved, change as needed
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
    },
    statusText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
});

export default MyBookings;
