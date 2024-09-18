import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, RadioButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfiles } from "../../Redux/Slice/ProfileSlice/ProfileSlice";
import { ImagebaseURL } from "../../../Security/helpers/axios";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [societyId, setSocietyId] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [checked, setChecked] = useState('option1');
  const [flatNumber, setFlatNumber] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const { profiles } = useSelector((state) => state.profiles);

  useEffect(() => {
    const getUserName = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString !== null) {
          const user = JSON.parse(userString);
          setUserName(user.name);
          setSocietyId(user.societyId);
          setUserId(user.userId);
        }
      } catch (error) {
        console.error("Failed to fetch the user from async storage", error);
      }
    };
    getUserName();
  }, []);
  useEffect(() => {
    if (userId && societyId) {
      dispatch(fetchUserProfiles({ userId, societyId }));
    }
  }, [dispatch, userId, societyId]);
  useEffect(() => {
    if (profiles.length > 0) {
      const profile = profiles[0];
      setBuildingName(profile.buildingName);
      setFlatNumber(profile.flatNumber);
      setProfileImage(profile.profilePicture)
    }
  }, [profiles]);
  const navigation = useNavigation();
  const images = [
    require("../../../../assets/User/images/image1.jpg"),
    require("../../../../assets/User/images/image1.jpg"),
    require("../../../../assets/User/images/image1.jpg"),
  ];
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.heading2}>{userName}</Text>
          <Text style={styles.subtitle}> {buildingName}-{flatNumber}</Text>
        </View>
        <View style={styles.iconAvatar}>
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <Ionicons name="notifications" size={30} color="#DDDEE0" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Avatar.Image
              style={styles.avatar}
              resizeMode="cover"
              size={52}
              source={profileImage ? { uri: `${ImagebaseURL}${profileImage}` } : require("../../../../assets/User/images/man.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView vertical={true} style={styles.mainContainer}>
        <View style={styles.postContainer}>
          <View style={[styles.row, { justifyContent: "space-between" }]}>
            <View style={styles.row}>
              <Image source={require("../../../../assets/User/images/billdue.png")} style={styles.logo} />
              <Text style={styles.logoTitle}>Payment Due</Text></View>
            <Text style={[styles.description, { color: "#777" }]}>Just Now</Text>
          </View>
          <Text style={styles.description}>
            Your maintenance bill of <Text style={styles.logoTitle}>Rs. 700</Text> for <Text style={styles.logoTitle}>August</Text> is due. Please make the payment.
          </Text>
          <TouchableOpacity style={styles.payButton} >
            <Text style={styles.payButtonText}>Make Payment</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.postContainer}>
          <View style={[styles.row, { justifyContent: "space-between" }]}>
            <View style={styles.row}>
              <Image source={require("../../../../assets/User/images/hashtag.png")} style={styles.logo} />
              <Text style={styles.logoTitle}>Events</Text></View>
            <Text style={[styles.description, { color: "#777" }]}>Just Now</Text>
          </View>
          <View style={styles.divider} />
          <View>
            <Text style={styles.logoTitle}>Celebrating the Ganesh Chaturti in Comminuty</Text>
            {/* <Text style={[styles.description]}>We are iniviting all the residents to participate cherish the moment.</Text> */}
            <Text >start Date - End Date</Text>
            <Text>Activities:Dancinmg, Singing</Text>
            <Text style={[styles.description, { fontSize: 12, color: "#7d0431" }]}>See More...</Text>
            <View style={{ width: "auto", height: "auto", marginTop: 10 }}>
              <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
                {images.map((image, index) => (
                  <Image
                    key={index}
                    source={image}
                    style={{
                      width:
                        images.length === 1 || (images.length % 2 !== 0 && index === images.length - 1)
                          ? "100%"
                          : "49%",
                      height: 100,
                      borderRadius: 4,
                      marginBottom: 10,
                    }}
                    resizeMode="cover"
                  />
                ))}
              </View>
            </View>
          </View>
        </View>
        <View style={styles.postContainer}>
          <View style={[styles.row, { justifyContent: "space-between" }]}>
            <View style={styles.row}>
              <Image source={require("../../../../assets/User/images/megaphone (1).png")} style={styles.logo} />
              <Text style={styles.logoTitle}>Notice</Text></View>
            <Text style={[styles.description, { color: "#777" }]}>Just Now</Text>
          </View>
          <View style={styles.divider} />

          <Text style={styles.logoTitle}>
            Meeting
          </Text>
          <Text style={styles.description}>
            we are conducting the meeting to discuss about issues in our community .I hope everyone will involve in the discussions.
            -with regards,president.
          </Text>
        </View>
        <View style={styles.postContainer}>
          <View style={[styles.row, { justifyContent: "space-between" }]}>
            <View style={styles.row}>
              <Image source={require("../../../../assets/User/images/poll (1).png")} style={styles.logo} />
              <Text style={styles.logoTitle}>Polls</Text></View>
            <Text style={[styles.description, { color: "#777" }]}>Just Now</Text>
          </View>
          <View style={styles.divider} />
          <Text style={styles.logoTitle}>
            Meeting
          </Text>
          <Text style={styles.description}>
            we are conducting the meeting to discuss about issues in our community .I hope everyone will involve in the discussions.
            -with regards,president.
          </Text>
          <View>
            <RadioButton.Group onValueChange={value => setChecked(value)} value={checked}>
              <View style={styles.radioOption}>
                <RadioButton value="option1" theme={{ colors: { primary: "#7D0431" } }} />
                <Text style={styles.radioLabel}>I will attend</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="option2" theme={{ colors: { primary: "#7D0431" } }} />
                <Text style={styles.radioLabel}>I will not attend</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="option3" theme={{ colors: { primary: "#7D0431" } }} />
                <Text style={styles.radioLabel}>Maybe</Text>
              </View>
            </RadioButton.Group>
          </View>
          <View style={styles.divider} />
          <View style={[styles.row,{justifyContent:"space-between"}]}>
            <Text style={styles.description}>Polls</Text>
            <Text style={styles.description}>Polls</Text>
            </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor: "#7D0431",
    backgroundColor: "#7D0431",
    paddingVertical: height * 0.02,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: width * 0.05,
  },
  heading: {
    fontSize: width * 0.04,
    fontWeight: "400",
  },
  heading2: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    color: "#C59358",
  },
  subtitle: {
    color: "#FFFFFF",
    fontWeight: "300",
    fontSize: width * 0.036,
  },
  iconAvatar: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    marginLeft: width * 0.05,
  },
  mainContainer: {
    paddingHorizontal: 10,
    paddingTop: 5
  },
  postContainer: {
    borderWidth: 1,
    borderColor: "#f6f6f6",
    backgroundColor: "#f6f6f6",
    padding: 8,
    borderRadius: 5, marginVertical: 5
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  logo: {
    width: 20, height: 20
  },
  logoTitle: {
    fontSize: 14, fontWeight: "600"
  },
  description: {
    fontSize: 12, fontWeight: "400", marginTop: 5, letterSpacing: 0.2
  },
  payButton: {
    alignItems: "flex-end", marginTop: 5,


  }, payButtonText: {
    color: "#7d0431", paddingHorizontal: 8, fontWeight: "500", paddingVertical: 5, borderRadius: 3, fontSize: 12,
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginVertical: 5
  }, radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    fontSize: 14,
    color: '#333',
    marginLeft: 5,
  },
});

export default HomeScreen;
