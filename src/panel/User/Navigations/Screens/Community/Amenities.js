import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { getAmenitiesBySocietyId } from "../../../Redux/Slice/CommunitySlice/Amenities";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DetailBox = ({ title, value, backgroundColor, width }) => (
  <View style={[styles.detailBox, { backgroundColor, width }]}>
    <Text style={styles.detailTitle}>{title}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const NoAmenityAvailable = ({ amenityName }) => (
  <View style={styles.scene}>
    <Text>No {amenityName} Available in Our Society</Text>
  </View>
);

const CommunityHall = ({ data }) => {
  const navigation = useNavigation();
  const communityHall = data.find((amenity) => amenity.amenityName === "Community Hall");

  if (!communityHall) return <NoAmenityAvailable amenityName="Community Hall" />;

  return (
    <View style={styles.scene}>
      <View key={communityHall._id}>
        <Image
          source={{ uri: `https://livinsync.onrender.com${communityHall?.image}` }}
          style={styles.image}
        />
        <Text style={styles.description}>
          Residents can book the hall for private events such as birthday parties,
          weddings, and anniversaries. A fully equipped kitchen is available for catering purposes.
        </Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <DetailBox title="Capacity" value={communityHall?.capacity} backgroundColor="#fff" width="48%" />
            <DetailBox title="Timings" value={communityHall?.timings} backgroundColor="#fff" width="48%" />
          </View>
          <DetailBox title="Location" value={communityHall?.location} backgroundColor="#fff" width="100%" />
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => navigation.navigate("Booking Screen", { navigateData: data })}
        >
          <Text style={styles.buttonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const PlayArea = ({ data }) => {
  const playArea = data.find((amenity) => amenity.amenityName === "Play Area");

  if (!playArea) return <NoAmenityAvailable amenityName="Play Area" />;

  return (
    <View style={styles.scene}>
      <Image
        source={{ uri: `https://livinsync.onrender.com${playArea?.image}` }}
        style={styles.image}
      />
      <ScrollView>
        <View>
          <View style={styles.header}>
            <Text style={{ color: "#7d0431", fontWeight: "700", fontSize: 15 }}>{playArea?.status}</Text>
            <Text style={styles.description}>
              The society's play area offers a safe and engaging environment for children and families to enjoy outdoor activities.
            </Text>
          </View>
          <View style={styles.content}>
            <View style={styles.row}>
              <Icon name="clock-o" size={20} color="#c59358" />
              <Text style={styles.text}>{playArea?.timings}</Text>
            </View>
            <View style={styles.row}>
              <Icon name="map-marker" size={20} color="#c59358" />
              <Text style={styles.text}>{playArea?.location}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const Gym = ({ data }) => {
  const gym = data.find((amenity) => amenity.amenityName === "Gym");

  if (!gym) return <NoAmenityAvailable amenityName="Gym" />;

  return (
    <View style={styles.scene}>
      <Image
        source={{ uri: `https://livinsync.onrender.com${gym?.image}` }}
        style={styles.image}
      />
      <ScrollView>
        <View>
          <View style={styles.header}>
            <Text style={styles.description}>
              Our state-of-the-art gym is equipped with the latest equipment and offers a variety of fitness classes.
            </Text>
          </View>
          <View style={styles.content}>
            <View style={styles.row}>
              <Icon name="clock-o" size={20} color="#c59358" />
              <Text style={styles.text}>{gym?.capacity}</Text>
            </View>
            <View style={styles.row}>
              <Icon name="clock-o" size={20} color="#c59358" />
              <Text style={styles.text}>{gym?.timings}</Text>
            </View>
            <View style={styles.row}>
              <Icon name="map-marker" size={20} color="#c59358" />
              <Text style={styles.text}>{gym?.location}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const Amenities = () => {
  const layout = useWindowDimensions();
  const [societyId, setSocietyId] = useState('');
  const dispatch = useDispatch();
  const { amenities } = useSelector((state) => state.amenities);

  useEffect(() => {
    const getUserName = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString) {
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
      dispatch(getAmenitiesBySocietyId(societyId));
    }
  }, [societyId, dispatch]);

  const [index, setIndex] = useState(0);
  const routes = [
    { key: "community", title: "Hall" },
    { key: "playArea", title: "Play Area" },
    { key: "gym", title: "Gym" },
  ];

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "community":
        return <CommunityHall data={amenities} />;
      case "playArea":
        return <PlayArea data={amenities} />;
      case "gym":
        return <Gym data={amenities} />;
      default:
        return null;
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator}
      style={styles.tabBar}
      labelStyle={styles.labelStyle}
      activeColor="#192c4c"
      inactiveColor="#777"
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={renderTabBar}
    />
  );
};


const styles = StyleSheet.create({
  scene: {
    flex: 1,
    paddingHorizontal: 15,
    marginTop: 10,
    alignItems: "center",
    backgroundColor: "#f6f6f6",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
    color: "#7a7873",
    paddingHorizontal: 5,
  },
  detailsContainer: {
    flex: 0.8,
    marginBottom: 10,
  },
  detailBox: {
    marginBottom: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#91A8BA"
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailRow1: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#192c4c",
  },
  detailValue: {
    fontSize: 16,
    marginTop: 5,
  },
  tabBar: {
    backgroundColor: "#fff",
  },
  indicator: {
    backgroundColor: "#192c4c",
  },
  labelStyle: {
    fontSize: 18,
    fontWeight: "600"
  },
  buttonContainer: {
    backgroundColor: "#192c4c",
    padding: 15,
    borderRadius: 10,
    position: 'absolute', bottom: 1, width: "100%",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    margin: "auto",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  header: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
  },
  headerText: {
    flexDirection: "row",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  subtitle: {
    color: "#666",
  },
  content: {
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  text: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
  },
  bookButton: {
    backgroundColor: "#192c4c",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },

  bookButtonText: {
    color: "#fff",
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: "gray",
    marginVertical: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  timeSlotTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  timeSlotContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 16,
  },
  timeSlotButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5,
    borderRadius: 8,
    backgroundColor: "#DDDEE0",
  },
  selectedTimeSlotButton: {
    backgroundColor: "#c59358",
  },
  timeSlotButtonText: {
    fontSize: 16,
    color: "#000",
  },
  iconContainer: {
    position: "absolute",
    right: 10,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputWithIconInput: {
    flex: 1,
    marginBottom: 1,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  modalCancelButton: {
    backgroundColor: "#192c4c",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",

    marginTop: 20,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});

export default Amenities;