

import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "react-native-paper";
import { fetchEvents } from "../../../Redux/Slice/CommunitySlice/EventSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
const Events = ({ navigation }) => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events.events);
  const { status, error } = useSelector((state) => state.events);
  const [societyId, setSocietyId] = useState(null);

  useEffect(() => {
    const getSocietyId = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        const id = JSON.parse(user).societyId;
        if (id !== null) {
          setSocietyId(id);
        } else {
          console.error('No societyId found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching societyId from AsyncStorage:', error);
      }
    };
    getSocietyId();
  }, []);

  useEffect(() => {
    if (societyId) {
      dispatch(fetchEvents(societyId));
    }
  }, [dispatch, societyId]);

  let content;

  if (status === "loading") {
    content = <Text>Loading...</Text>;
  } else if (status === "succeeded") {
    content = (<>
      {
        events.events.map((event) => (
          <TouchableOpacity key={event._id}
            onPress={() => navigation.navigate('EventDetails', { event })}
          >
            <Card style={styles.card}>
              <Card.Content>
                {event.pictures[0] ? (
                  <Image
                    source={{ uri: `https://livinsync.onrender.com${event.pictures[0].img}` }}
                    style={styles.pictures}
                  />
                ) : (
                  <Text style={styles.errorText}>Image not available</Text>
                )}

                <View style={[styles.infoContainer, { marginTop: 10 }]}>
                  <Text style={styles.label}>Name </Text>
                  <Text style={styles.value}>: {event.name}</Text>
                </View>

                <View style={styles.infoContainer}>
                  <Text style={styles.label}>Start Date</Text>
                  <Text style={styles.value}>: {event.startDate.slice(0, 10)}</Text>
                </View>

                <View style={styles.infoContainer}>
                  <Text style={styles.label}>End Date</Text>
                  <Text style={styles.value}>: {event.endDate.slice(0, 10)}</Text>
                </View>
              </Card.Content>

            </Card>
          </TouchableOpacity>

        ))
      }
    </>
    )
  } else if (status === "failed") {
    content = <Text>{error}</Text>;
  }

  return (
    <View style={{
      flex: 1, backgroundColor: "#FFF",
      paddingVertical: 10,
    }}>
      <ScrollView contentContainerStyle={styles.scrollView}>{content}</ScrollView></View>
  );
};

const styles = StyleSheet.create({

  card: {
    width: "100%",
    borderRadius: 10,
    marginTop: 20,
  },
  pictures: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
  },
  infoContainer: {
    flexDirection: 'row',  // Align items in a row (horizontally)
    marginBottom: 5,
  },
  label: {
    flex: 1,  // This will align the label to the left
    fontSize: 16,
  },
  value: {
    flex: 2.5,  // This will ensure that the value aligns to the right side
    fontSize: 16,
  },
});

export default Events;