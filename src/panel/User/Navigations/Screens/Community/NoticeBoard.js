

import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotices, selectError, selectLoading, selectNotices } from '../../../Redux/Slice/CommunitySlice/NoticeSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Notice = () => {
  const dispatch = useDispatch();
  const [societyId, setSocietyId] = useState("");

  const notices = useSelector(selectNotices);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  useEffect(() => {
    const getUserName = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString !== null) {
          const user = JSON.parse(userString);
          setSocietyId(user.societyId);
        }
      } catch (error) {
        console.error("Failed to fetch the user from async storage", error);
      }
    };

    getUserName();
  }, []);
  useEffect(() => {
    if (societyId) {
      dispatch(fetchNotices(societyId));
    }
  }, [dispatch, societyId]);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#7do431" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={notices.notices}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.MainContainer}>
            <View style={styles.header}>
              <Image
                source={require("../../../../../assets/Security/images/message-board.png")}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.headerText}>{item.subject}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            <Text style={styles.mainText}>{item.subject}</Text>
            <Text style={styles.paragraph}>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  MainContainer: {
    backgroundColor: "#F3E1D5",
    borderWidth: 1,
    borderColor: "#27272a",
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
    color: "#800336",
  },
  time: {
    fontSize: 14,
    color: "grey",
  },
  mainText: {
    fontSize: 16,
    fontWeight: "500",
  },
  paragraph: {
    fontSize: 14,
    letterSpacing: 0.5,
    color: "grey",
  },
});

export default Notice;