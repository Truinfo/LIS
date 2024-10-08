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
  Avatar,
  IconButton,
  Chip,
  Divider,
} from 'react-native-paper';
import Modal from 'react-native-modal';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const AdminNotifications = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      name: 'Jhansi',
      message: 'Won the monthly bestseller gold badge',
      time: '1h ago',
      avatar: 'https://example.com/path/to/avatar1.jpg',
      isVisible: true,
      isRead: false,
    },
    {
      id: 2,
      name: 'Rahul',
      message: 'Completed the React Native course',
      time: '2h ago',
      avatar: 'https://example.com/path/to/avatar2.jpg',
      isVisible: true,
      isRead: false,
    },
    {
      id: 3,
      name: 'Anita',
      message: 'Started following you',
      time: '3h ago',
      avatar: 'https://example.com/path/to/avatar3.jpg',
      isVisible: true,
      isRead: false,
    },
  ]);

  const [isAllRead, setIsAllRead] = useState(false);

  // Toggle modal visibility
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    if (!isModalVisible) {
      // Mark all as read when opening the modal
      setIsAllRead(true);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) => ({ ...notif, isRead: true }))
      );
    }
  };

  // Handle individual notification dismissal
  const dismissNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === id ? { ...notif, isVisible: false } : notif
      )
    );
  };

  // Count of unread notifications
  const unreadCount = notifications.filter(
    (notif) => !notif.isRead && notif.isVisible
  ).length;

  return (
    <View style={styles.container}>
      {/* Notification Icon */}
      <TouchableOpacity onPress={toggleModal} style={styles.iconButton}>
        <Ionicons name="notifications" size={24} color="#000" />
        {unreadCount > 0 && <View style={styles.badge} />}
      </TouchableOpacity>

      {/* Notifications Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Notifications</Text>
            <View style={styles.headerActions}>
              {unreadCount > 0 && (
                <Chip
                  mode="outlined"
                  style={styles.chip}
                  textStyle={styles.chipText}
                >
                  {`${unreadCount} New`}
                </Chip>
              )}
              <IconButton
                icon={isAllRead ? 'email-open-outline' : 'email-outline'}
                size={24}
                onPress={() => {
                  setIsAllRead(!isAllRead);
                  setNotifications((prevNotifications) =>
                    prevNotifications.map((notif) => ({
                      ...notif,
                      isRead: !isAllRead,
                    }))
                  );
                }}
              />
            </View>
          </View>
          <Divider />

          {/* Notifications List */}
          <ScrollView style={styles.notificationsList}>
            {notifications.map(
              (notif) =>
                notif.isVisible && (
                  <View key={notif.id}>
                    <View style={styles.notificationItem}>
                      <Avatar.Image
                        source={{ uri: notif.avatar }}
                        size={50}
                      />
                      <View style={styles.notificationText}>
                        <Text style={styles.notificationName}>
                          {notif.name}
                        </Text>
                        <Text style={styles.notificationMessage}>
                          {notif.message}
                        </Text>
                        <Text style={styles.notificationTime}>
                          {notif.time}
                        </Text>
                      </View>
                      <IconButton
                        icon="close"
                        size={20}
                        onPress={() => dismissNotification(notif.id)}
                        style={styles.closeButton}
                      />
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

          {/* Footer */}
          <TouchableOpacity
            style={styles.viewMoreButton}
            onPress={() => {
              // Handle view more action
            }}
          >
            <Text style={styles.viewMoreText}>View More</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default AdminNotifications;

const styles = StyleSheet.create({
  container: {
    // Adjust as needed
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
  modal: {
    justifyContent: 'flex-start',
    margin: 0,
    marginTop: 50, // Adjust as needed
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    maxHeight: Dimensions.get('window').height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    backgroundColor: '#dbeafe',
    marginRight: 10,
  },
  chipText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  notificationsList: {
    marginTop: 10,
    maxHeight: Dimensions.get('window').height * 0.6,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
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
    position: 'absolute',
    top: 0,
    right: 0,
  },
  unreadDot: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  viewMoreButton: {
    padding: 10,
    alignItems: 'center',
  },
  viewMoreText: {
    fontSize: 16,
    color: '#007AFF',
  },
});
