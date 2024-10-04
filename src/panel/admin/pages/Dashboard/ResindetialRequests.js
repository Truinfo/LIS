import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { fetchUsers } from '../ResidentialUnit/ResidentsSlice';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from "react-redux";
import React from "react";
const ResindetialRequests = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { users } = useSelector(state => state.AdminResidents || []);
    useFocusEffect(
        React.useCallback(() => {
            if (users.length === 0) {  // Avoid fetching if already done
                dispatch(fetchUsers());
            }
        }, [dispatch, users,]) // Dependencies make sure this runs only when needed
    );
    const unverifiedResidents = users.filter((eachRes) => eachRes.isVerified === false);

    return (
        <View style={styles.container}>
            {unverifiedResidents.length > 0 ? (
                <ScrollView showsVerticalScrollIndicator={false}>
                    {unverifiedResidents.map((eachRes) => (
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
                                    onPress={() => handleApprove(eachRes._id)}
                                    style={styles.approveButton}
                                >
                                    Approve
                                </Button>
                                <Button
                                    mode="outlined"
                                    onPress={() => handleDecline(eachRes._id)}
                                    style={styles.declineButton}
                                >
                                    Decline
                                </Button>
                            </Card.Actions>
                        </Card>
                    ))}
                </ScrollView>
            ) : (
                <Text style={styles.noRequests}>No pending approval requests.</Text>
            )}
        </View>
    )
}
export default ResindetialRequests;
const styles = StyleSheet.create({
    container: {
        padding: 16,
        margin: 10
    },
    Approvalcard: {
        marginVertical: 10,
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        marginLeft: 10,
        fontWeight: 'bold',
    },
    message: {
        fontSize: 16,
        marginBottom: 5,
    },
    date: {
        fontSize: 14,
        color: 'gray',
    },
    actions: {
        justifyContent: 'flex-end',
    },
    approveButton: {
        backgroundColor: '#4CAF50',
        marginRight: 10,
    },
    declineButton: {
        borderColor: '#FF5722',
    },
    noRequests: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        color: 'gray',
    },
});