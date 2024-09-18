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
import { useDispatch, useSelector } from "react-redux"
import AsyncStorage from "@react-native-async-storage/async-storage";
const DetailBox = ({ title, value, backgroundColor, width }) => (
  <View style={[styles.detailBox, { backgroundColor, width }]}>
    <Text style={styles.detailTitle}>{title}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const CommunityHall = (data) => {
  const navigation = useNavigation();
  if (!data.data || data.data.length === 0) {
    return (
      <View style={styles.scene}>
        <Text>No Community Hall Available in Our Society</Text>
      </View>
    );
  }
  const communityHall = data.data.find(eachAme => eachAme.amenityName === "Community Hall");

  if (!communityHall) {
    return (
      <View style={styles.scene}>
        <Text>No Community Hall Available in Our Society</Text>
      </View>
    );
  }
  const navigateData = data.data
  return (
    <View style={styles.scene}>
      <View key={communityHall._id}>
        <Image
          source={{
            uri: `https://livinsync.onrender.com${communityHall.image}`,
          }}
          style={styles.image}
        />
        <Text style={styles.description}>
          Residents can book the hall for private events such as birthday parties,
          weddings, and anniversaries, providing a convenient and affordable venue
          option. A fully equipped kitchen is available for catering purposes,
          making it convenient for hosting events that involve food and beverages.
        </Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <DetailBox
              title="Capacity"
              value={communityHall.capacity}
              backgroundColor="#fff"
              width="48%"
            />
            <DetailBox
              title="Timings"
              value={communityHall.timings}
              backgroundColor="#fff"
              width="48%"
            />
          </View>
          <DetailBox
            title="Location"
            value={communityHall.location}
            backgroundColor="#fff"
            width="100%"
          />
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => navigation.navigate("Booking Screen", { navigateData })}
        >
          <Text style={styles.buttonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const PlayArea = (data) => {
  if (!data.data || data.data.length === 0) {
    return (
      <View style={styles.scene}>
        <Text>No Play Area Available in Our Society</Text>
      </View>
    );
  }
  const PlayArea = data.data.find(eachAme => eachAme.amenityName === "Play Area");

  if (!PlayArea) {
    return (
      <View style={styles.scene}>
        <Text>No Play Area Available in Our Society</Text>
      </View>
    );
  }
  return (
    <View style={styles.scene}>
      <Image
        source={{
          uri: `https://livinsync.onrender.com${PlayArea.image}`,
        }}
        style={styles.image}
      />
      <ScrollView>
        <View >
          <View style={styles.header}>
            <Text>{Gym.status} </Text>
            <Text style={styles.description}>
              The society's play area offers a safe and engaging environment for children and families to enjoy outdoor
              activities. Equipped with modern play structures, including swings, slides, and climbing frames, the play
              area is designed to provide hours of fun and physical activity. The space also features ample seating and
              shaded areas for parents to relax while supervising their children. Additionally, the play area is surrounded
              by lush greenery, creating a refreshing and natural ambiance. The play area is an ideal spot for kids to
              interact, explore, and burn off energy, fostering a sense of community among residents.
            </Text>
          </View>
          <View style={styles.content}>
            <View style={styles.row}>
              <Icon name="clock-o" size={20} color="#c59358" />
              <Text style={styles.text}>
                {PlayArea.timings}
              </Text>
            </View>
            <View style={styles.row}>
              <Icon name="map-marker" size={20} color="#c59358" />
              <Text style={styles.text}>
                {PlayArea.location}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView >
    </View >
  )
}

const Gym = (data) => {
  const [modalVisible, setModalVisible] = useState(false);
  if (!data.data || data.data.length === 0) {
    return (
      <View style={styles.scene}>
        <Text>No Play Area Available in Our Society</Text>
      </View>
    );
  }
  const Gym = data.data.find(eachAme => eachAme.amenityName === "Gym");
  if (!PlayArea) {
    return (
      <View style={styles.scene}>
        <Text>No Play Area Available in Our Society</Text>
      </View>
    );
  }


  return (
    <View style={styles.scene}>
      <Image
        source={{
          uri: `https://livinsync.onrender.com${Gym.image}`,
        }}
        style={styles.image}
      />
     
      <ScrollView>
        <View >
          <View style={styles.header}>
            <Text style={styles.description}>
              Our state-of-the-art gym is equipped with the latest equipment and
              offers a variety of fitness classes to help you stay in shape. Whether
              you're looking to lift weights, do cardio, or take a yoga class, we have
              something for everyone.
            </Text>
          </View>
          <View style={styles.content}>
            <View style={styles.row}>
              <Icon name="clock-o" size={20} color="#c59358" />
              <Text style={styles.text}>
                {Gym.capacity}
              </Text>
            </View>
            <View style={styles.row}>
              <Icon name="clock-o" size={20} color="#c59358" />
              <Text style={styles.text}>
                {Gym.timings}
              </Text>
            </View>
            <View style={styles.row}>
              <Icon name="map-marker" size={20} color="#c59358" />
              <Text style={styles.text}>
                {Gym.location}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView >
    </View>
  );
};

const Amenities = () => {
  const layout = useWindowDimensions();
  const [societyId, setSocietyId] = useState('')
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const dispatch = useDispatch()
  const { amenities, status } = useSelector((state) => state.amenities)
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
      dispatch(getAmenitiesBySocietyId(societyId))
    }
  }, [societyId])
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "community", title: "Hall" },
    { key: "playArea", title: "Play area" },
    { key: "gym", title: "Gym" },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "community":
        return <CommunityHall data={amenities} />;
      case "playArea":
        return (
          <PlayArea
            date={date}
            show={show}
            showDatePicker={showDatePicker}
            onChange={onChange}
            data={amenities}
          />
        );
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
    textAlign: "justify",
    paddingHorizontal: 5,
  },
  detailsContainer: {
    marginBottom: 16,
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
    textAlign: "center", margin: "auto"
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%"
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