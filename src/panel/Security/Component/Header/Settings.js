import React, { useEffect, useState } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet, Linking, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../User/Redux/Slice/AuthSlice/Login/LoginSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchGuard } from "../../../User/Redux/Slice/Security_Panel/SettingsSlice";
import { ImagebaseURL } from "../../helpers/axios";
import { fetchCommityMembers } from "../../../User/Redux/Slice/Security_Panel/QuickContactsSlice";
import { Avatar } from "react-native-paper";
const Settings = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [societyId, setSocietyId] = useState(null);
    
    const [sequrityId, setSequrityId] = useState(null);
    const Guard = useSelector((state) => state.setting.settings);
    const QuickContacts = useSelector((state) => state.quickContact.quickContacts);
    useEffect(() => {
        const getUserName = async () => {
          try {
            const userString = await AsyncStorage.getItem("user");
            if (userString !== null) {
              const user = JSON.parse(userString);
              setSocietyId(user.societyId); 
              setSequrityId(user.sequrityId); 
            }
          } catch (error) {
            console.error("Failed to fetch the user from async storage", error);
          }
        };
    
        getUserName();
      }, []);


    useEffect(() => {
        if (societyId && sequrityId) {
            dispatch(fetchGuard({ societyId, sequrityId }));
            dispatch(fetchCommityMembers({ societyId }));
        }
    }, [societyId, sequrityId, dispatch]);

    
    const handleGuard = () => {
        navigation.navigate("Security");
    };
    const handleNoticePress = () => {
        navigation.navigate("Notice");
    };
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('userToken');
        } catch (e) {
            console.log('Error clearing user from AsyncStorage:', e);
        }
        dispatch(logout());
        navigation.navigate('Login');
    };
    const handlePhonePress = (phoneNumber) => {
        const dialNumber = `tel:${phoneNumber}`;
        Linking.openURL(dialNumber);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity style={styles.content} onPress={handleGuard}>
                    <Avatar.Image
                        source={{ uri: `${ImagebaseURL}${Guard.pictures}` } || require("../../../../assets/Security/images/policeman.png")}
                        style={styles.image}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.heading}>{Guard.name}</Text>
                        <View style={styles.subheadingContainer}>
                            <Icon name="lens" size={20} color="green" />
                            <Text style={styles.subheading}>On Duty</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rowContent} onPress={handleNoticePress}>
                    <Image
                        source={require("../../../../assets/Security/images/notice.png")}
                        style={styles.Image2}
                    />
                    <View style={styles.imagecontent}>
                        <Text style={styles.rowText}>Notice</Text>
                    </View>
                    <Icon name="navigate-next" size={25} color="lightgrey" />
                </TouchableOpacity>

                <Text style={{ marginTop: 10, marginRight: "56%", fontSize: 18, fontWeight: "bold" }}>
                    Quick Contacts
                </Text>

                {QuickContacts.map((contact) => (
                    <TouchableOpacity key={contact._id} onPress={() => handlePhonePress(contact.phoneNumber)}>
                        <View style={styles.rowContent}>
                            <Image
                               source={require("../../../../assets/Security/images/telephone.png")}
                               style={styles.Image2}
                            />
                            <View style={styles.imagecontent}>
                                <Text style={styles.rowText}>{contact.name}</Text>
                                <Text style={styles.rowSubText}>{contact.designation}</Text>
                            </View>
                            <Icon name="navigate-next" size={25} color="lightgrey" />
                        </View>
                    </TouchableOpacity>
                ))}

                <Text style={{ marginTop: 10, marginRight: "78%", fontSize: 18, fontWeight: "bold" }}>
                    More
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Terms and Conditions")}>
                    <View style={styles.rowContent}>
                        <Image
                            source={require("../../../../assets/Security/images/terms-and-conditions.png")}
                            style={styles.Image2}
                        />
                        <View style={styles.imagecontent}>
                            <Text style={styles.rowText}>Terms and Conditions</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout}>
                    <View style={styles.rowContent}>
                        <Image
                            source={require("../../../../assets/Security/images/log-out.png")}
                            style={styles.Image2}
                        />
                        <View style={styles.imagecontent}>
                            <Text style={styles.rowText}>Logout</Text>
                        </View>
                    </View>
                </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
       alignItems: "center",
        backgroundColor: "white",
        width:"100%",
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        width: "90%",
        borderRadius: 10,
        backgroundColor: "#F3E1D5",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginTop: 10,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 50,
        marginRight: 10,
        backgroundColor:"#ccc"
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    heading: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    subheadingContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    subheading: {
        fontSize: 16,
        color: "grey",
        marginLeft: 5,
    },
    editIconContainer: {
        padding: 10,
        borderRadius: 20,
    },
    rowContent: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderWidth: 1,
        width: "90%",
        borderColor: "lightgrey",
        borderRadius: 10,
        marginTop:5,
        marginBottom:10,
    },
    Image2: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    rowText: {
        fontSize: 16,
        marginRight: 10,
    },
    imagecontent: {
        flex: 1,
        marginRight: 10,
        
    },
});

export default Settings;