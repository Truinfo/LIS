import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import {
    ActivityIndicator,
    Avatar,
    Chip,
    Divider,
} from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { fetchNotifications } from './DashboardSlice';
import { useDispatch, useSelector } from 'react-redux';

const NotificationComponent = () => {
    const dispatch = useDispatch();
    useFocusEffect(
        React.useCallback(() => {
            dispatch(fetchNotifications())
        }, [])
    );

    const notifications = useSelector(state => state.DashBoard.Notification || []);
    const status = useSelector(state => state.DashBoard.status || "");

    const [isAllRead, setIsAllRead] = useState(false);

    // Count of unread notifications
    const unreadCount = notifications?.filter(
        (notif) => !notif.isRead && notif.isVisible
    ).length;

    // Handle individual notification dismissal
    const dismissNotification = (id) => {
        // Add logic to mark notification as dismissed if needed
    };
    if (status === "loading") {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#7d0431" />
            </View>
        );
    }
    return (
        <View style={styles.container}>
            {/* Notifications List */}
            <ScrollView style={styles.notificationsList}>
                {notifications.map(
                    (notif) => (
                        <View key={notif.id} style={styles.notificationCard}>
                            <View style={styles.notificationItem}>
                                <View style={styles.notificationText}>
                                    <Text style={styles.notificationName}>
                                        {notif.Category}
                                    </Text>
                                    <Text style={styles.notificationMessage}>
                                        {notif.message}
                                    </Text>
                                    <Text style={styles.notificationTime}>
                                        {new Date(notif.createdAt).toLocaleDateString()}
                                        {new Date(notif.createdAt).toLocaleTimeString()}
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
                                {!notif.isRead && (
                                    <MaterialCommunityIcons
                                        name="circle"
                                        size={10}
                                        color="#16a34a"
                                        style={styles.unreadDot}
                                    />
                                )}
                            </View>
                            <Divider />
                        </View>
                    )
                )}
            </ScrollView>

            {/* Mark All as Read */}
            <TouchableOpacity
                style={styles.markAllButton}
                onPress={() => {
                    setIsAllRead(!isAllRead);
                    // Mark all notifications as read logic
                }}
            >
                <Text style={styles.markAllText}>
                    {isAllRead ? 'Mark All as Unread' : 'Mark All as Read'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default NotificationComponent;

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    iconButton: {
        padding: 10,
        position: 'relative',
    },
    badge: {
        backgroundColor: '#16a34a',
        width: 10,
        height: 10,
        borderRadius: 5,
        position: 'absolute',
        top: 5,
        right: 5,
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
