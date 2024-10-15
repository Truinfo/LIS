import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Alert, Image, Text, View } from "react-native";
import HomeScreen from "../../Navigations/Screens/HomeScreen";
import QuickActions from "../../Navigations/Screens/QuickActions";
import Services from "../../Navigations/Screens/Services";
import Community from "../../Navigations/Screens/Community";
import RentalProperties from "../../Navigations/Screens/Community/RentalProperties";
import socketServices from "../../Socket/SocketServices";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
const Tab = createBottomTabNavigator();

function Tabs() {
  const [societyId, setSocietyId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  useFocusEffect(
    React.useCallback(() => {

      const getUserName = async () => {
        try {
          const userString = await AsyncStorage.getItem("user");
          if (userString) {
            const user = JSON.parse(userString);
            setSocietyId(user.societyId);
            setUserName(user.name);
            setUserId(user._id);

          }
        } catch (error) {
          console.error("Failed to fetch the user from async storage", error);
        }
      };
      getUserName();
    }, [])
  );

  useEffect(() => {
    if (userId) {
      console.log("Joining user room:", userId);
      socketServices.emit("joinUser", userId);
    }

    if (societyId) {
      socketServices.emit("joinSecurityPanel", societyId);
    }
  }, [])
  useFocusEffect(
    React.useCallback(() => {
      socketServices.initializeSocket();
      socketServices.on("Visitor_Notification", (data) => {
        console.log("recieving data")
        if (data) {
          const visitorName = data.visitorName || "Unknown Visitor";
          const flatNumber = data.flatNumber || "Unknown Flat";
          const buildingName = data.buildingName || "Unknown Building";

          Alert.alert(
            `Visitor Request`,
            `Visitor ${visitorName} is requesting access to your flat ${flatNumber} in ${buildingName}. Do you want to approve?`,
            [
              {
                text: "Decline",
                onPress: () => {
                  socketServices.emit("Visitor_Response", {
                    visitorName,
                    response: "declined",
                    flatNumber,
                    buildingName,
                    residentName: userName,
                    societyId,
                    userId,
                  });
                },
              },
              {
                text: "Approve",
                onPress: () => {
                  socketServices.emit("Visitor_Response", {
                    visitorName,
                    response: "approved",
                    flatNumber,
                    buildingName,
                    residentName: userName,
                    societyId,
                    userId,
                  });
                },
              },
            ],
            { cancelable: false }
          );
        } else {
          console.error("Received data is undefined or null");
        }
      });

      return () => {
        socketServices.removeListener("Visitor_Notification");
      };
    }, [userId, societyId])
  );

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused
              ? require("../../../../assets/User/gif/bottom-tabv/home2.gif")
              : require("../../../../assets/User/gif/bottom-tabv/home.png");
          } else if (route.name === "Social") {
            iconName = focused
              ? require("../../../../assets/User/gif/bottom-tabv/social.gif")
              : require("../../../../assets/User/gif/bottom-tabv/social1.png");
          } else if (route.name === "QuickActions") {
            iconName = focused
              ? require("../../../../assets/User/gif/bottom-tabv/quick1.gif")
              : require("../../../../assets/User/gif/bottom-tabv/quick2.png");
          } else if (route.name === "Services") {
            iconName = focused
              ? require("../../../../assets/User/gif/bottom-tabv/service2.gif")
              : require("../../../../assets/User/gif/bottom-tabv/service1.png");
          } else if (route.name === "Community") {
            iconName = focused
              ? require("../../../../assets/User/gif/bottom-tabv/community22.gif")
              : require("../../../../assets/User/gif/bottom-tabv/community123.png");
          }

          return (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              {focused && (
                <View
                  style={{
                    position: "absolute",
                    top: -15,
                    width: "100%",
                    height: 4,
                    backgroundColor: "#7D0413",
                    borderRadius: 2,
                  }}
                />
              )}
              <Image
                source={iconName}
                style={{ width: size, height: size, tintColor: color }}
              />
            </View>
          );
        },
        tabBarLabel: ({ focused }) =>
          focused ? (
            <Text style={{ color: "#7D0413", fontSize: 12, paddingBottom: 10 }}>
              {route.name}
            </Text>
          ) : null,
        tabBarActiveTintColor: "#7D0413",
        tabBarInactiveTintColor: "grey",
        tabBarLabelStyle: { paddingBottom: 10, fontSize: 12 },
        tabBarStyle: { padding: 15, height: 60 },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Community"
        component={Community}
        options={{
          headerStyle: { backgroundColor: "#7D0431" },
          headerTintColor: "#fff",
        }}
      />
      <Tab.Screen
        name="QuickActions"
        component={QuickActions}
        options={{
          headerStyle: { backgroundColor: "#7D0431" },
          headerTintColor: "#fff",
        }}
      />
      <Tab.Screen
        name="Services"
        component={Services}
        options={{
          headerStyle: { backgroundColor: "#7D0431" },
          headerTintColor: "#fff",
        }}
      />

      <Tab.Screen
        name="Social"
        component={RentalProperties}
        options={{
          headerStyle: { backgroundColor: "#7D0431" },
          headerTintColor: "#fff",
          headerRight: () => (

            <Ionicons name="storefront-sharp"
              size={24}
              color="#fff"
              style={{ marginRight: 15 }} 
              onPress={() => navigation.navigate("Property List")} 
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default Tabs;
