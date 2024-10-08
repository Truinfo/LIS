import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import { ActivityIndicator, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { fetchNotifications, markAllAsRead } from './DashboardSlice'; // Import the markAllAsRead action
import { useDispatch, useSelector } from 'react-redux';

const AdminNotifications = () => {
    const dispatch = useDispatch();

    // Fetch notifications when component is focused
    useFocusEffect(
        React.useCallback(() => {
            dispatch(fetchNotifications());
        }, [dispatch])
    );

    const notifications = useSelector(state => state.DashBoard.Notification || []);
    const status = useSelector(state => state.DashBoard.status || "");

    // Keep track of all read state
    const [isAllRead, setIsAllRead] = useState(false);

    const unreadCount = notifications?.filter(
        (notif) => !notif.isRead && notif.isVisible
    ).length;

    // Handle individual notification dismissal (for future enhancement)
    const dismissNotification = (id) => {
        // Add logic to mark individual notification as read
    };

    // Handle mark all notifications as read
    const handleMarkAllAsRead = () => {
        setIsAllRead(true);
        dispatch(markAllAsRead()); // Dispatch mark all as read action
    };

    if (status === "loading") {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#7d0431" />
            </View>
        );
    }
    const data = [...notifications].reverse()
    return (
        <View style={styles.container}>
            {/* Notifications List */}
            <ScrollView style={styles.notificationsList}>
                {data.map((notif) => (
                    <View key={notif._id} style={styles.notificationCard}>
                        <View style={styles.notificationItem}>
                            <View style={styles.notificationText}>
                                <Text style={styles.notificationName}>
                                    {notif.title}
                                </Text>
                                <Text style={styles.notificationMessage}>
                                    {notif.message}
                                </Text>
                                <Text style={styles.notificationTime}>
                                    {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString()}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => dismissNotification(notif.id)}
                                style={styles.closeButton}
                            >
                                <MaterialCommunityIcons
                                    name="close"
                                    size={20}
                                    color="#000"
                                />
                            </TouchableOpacity>

                        </View>
                        <Divider />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default AdminNotifications;

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    notificationsList: {
        marginTop: 10,
        maxHeight: Dimensions.get('window').height * 0.6,
    },
    notificationCard: {
        borderRadius: 10,
        backgroundColor: 'white',
        padding: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    notificationText: {
        marginLeft: 10,
        flex: 1,
    },
    notificationName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    notificationMessage: {
        fontSize: 14,
        color: '#333',
    },
    notificationTime: {
        fontSize: 12,
        color: '#666',
    },
    closeButton: {
        padding: 5,
    },
    unreadDot: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    markAllButton: {
        padding: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    markAllText: {
        fontSize: 16,
        color: '#007AFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
