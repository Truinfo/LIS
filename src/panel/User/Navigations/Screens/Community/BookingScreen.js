import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  ScrollView,
  Modal,
  Alert
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux"
import { bookAmenity } from "../../../Redux/Slice/CommunitySlice/Amenities";
export default function App() {
  const [date, setDate] = useState(new Date());
  const route = useRoute()
  const { navigateData } = route.params
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");
  const [arrivalTime, setArrivalTime] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [paymentMethod, setpaymentMethod] = useState("");
  const [numGuests, setNumGuests] = useState("");
  const [eventName, seteventName] = useState("");
  const [category, setCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const navigation = useNavigation();
  const [showPopup, setShowPopup] = useState(false);
  const [showOptions, setShowOptions] = useState({
    arrivalTime: false,
    departureTime: false,
    category: false,
    paymentMethod: false
  });
  const dispatch = useDispatch()
  useEffect(() => {
    const currentDate = new Date();
    setSelectedDate(currentDate.toLocaleDateString());
  }, []);
  const communityHall = navigateData.find(eachAme => eachAme.amenityName === "Community Hall");
  const onChange = ( selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    setSelectedDate(currentDate.toLocaleDateString());
  };

 
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };
  const handleConfirm = () => {
    const BookingData = {
      amenityId: communityHall._id,
      data: {
        userId: "3Z6S5JTx2",
        dateOfBooking: selectedDate,
        eventName,
        arrivalTime,
        departureTime,
        venue: communityHall.amenityName,
        numberOfGuests: numGuests,
        eventType: category,
        payed: "25000",
        pending: "0",
        paymentDetails: {
          paymentMethod: paymentMethod,
          // paymentStatus: paymentMethod === "ONLINE" ? "Completed" : "Pending",
          paymentStatus: "Pending",
          amount: "25000",
          paymentDate: paymentMethod === "ONLINE" ? selectedDate : "",
        },
      }
    }
    dispatch(bookAmenity(BookingData)).unwrap()
      .then((response) => {
        if (response.success === true) {
          Alert.alert(
            "Booking Placed",
            "Your booking has been confirmed within few minutes!",
            [
              {
                text: "OK",
                onPress: () => {
                  // Navigate back to the amenities page or other desired action
                  navigation.navigate("Amenities");
                },
              },
            ],
            { cancelable: false }
          );
        }
      })
      .catch((error) => {
        console.error('Error booking amenity:', error);
      });
  };

  const toggleDropdown = (field) => {
    setShowOptions((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSelect = (field, value) => {
    if (field === "arrivalTime") setArrivalTime(value);
    if (field === "departureTime") setDepartureTime(value);
    if (field === "category") setCategory(value);
    if (field === "paymentMethod") setpaymentMethod(value);
    toggleDropdown(field);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Event Name</Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.input}
                placeholder="Event Name"
                value={eventName}
                onChangeText={seteventName}
                keyboardType="text"
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.inputWithIcon}>
              <TouchableOpacity
                onPress={() => toggleDropdown("category")}
                style={{ flex: 1 }}
              >
                <Text style={styles.input}>{category || "Category"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => toggleDropdown("category")}
                style={styles.iconContainer}
              >
                <AntDesign
                  name="caretdown"
                  size={12}
                  color="#777"
                  style={styles.iconInside}
                />
              </TouchableOpacity>
            </View>
            {showOptions.category && (
              <View style={styles.dropdown}>
                {["Business", "Casual", "Formal"].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => handleSelect("category", cat)}
                    style={styles.dropdownItem}
                  >
                    <Text>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date</Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                style={[styles.input, styles.inputWithIconInput]}
                placeholder="Date"
                value={selectedDate}
                onFocus={() => setShow(true)}
                onChangeText={setSelectedDate}
              />
              <TouchableOpacity
                onPress={showDatepicker}
                style={styles.iconContainer}
              >
                <Icon
                  name="calendar"
                  size={20}
                  color={show ? "#0000FF" : "#c59358"}
                />
              </TouchableOpacity>
            </View>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Arrival time</Text>
              <View style={styles.inputWithIcon}>
                {/* <TextInput
                  style={styles.input}
                  placeholder="Arrival time"
                  value={arrivalTime}
                  onChangeText={setArrivalTime}
                /> */}
                <TouchableOpacity
                  onPress={() => toggleDropdown("arrivalTime")}
                  style={{ flex: 1 }}
                >
                  <Text style={styles.input}>{arrivalTime || "Arrival time"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => toggleDropdown("arrivalTime")}
                  style={styles.iconContainer}
                >
                  <AntDesign
                    name="caretdown"
                    size={12}
                    color="#777"
                    style={styles.iconInside}
                  />
                </TouchableOpacity>
              </View>
              {showOptions.arrivalTime && (
                <View style={styles.dropdown}>
                  {["1:00 AM", "3:00 AM", "5:00 AM", "7:00 AM", "9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM", "7:00 PM", "9:00 PM"].map((time) => (
                    <TouchableOpacity
                      key={time}
                      onPress={() => handleSelect("arrivalTime", time)}
                      style={styles.dropdownItem}
                    >
                      <Text>{time}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Departure time</Text>
              <View style={styles.inputWithIcon}>
                <TextInput
                  style={styles.input}
                  placeholder="Departure time"
                  value={departureTime}
                  onChangeText={setDepartureTime}
                />
                <TouchableOpacity
                  onPress={() => toggleDropdown("departureTime")}
                  style={styles.iconContainer}
                >
                  <AntDesign
                    name="caretdown"
                    size={12}
                    color="#777"
                    style={styles.iconInside}
                  />
                </TouchableOpacity>
              </View>
              {showOptions.departureTime && (
                <View style={styles.dropdown}>
                  {["1:00 AM", "3:00 AM", "5:00 AM", "7:00 AM", "9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM", "7:00 PM", "9:00 PM", "11:00 PM"].map((time) => (
                    <TouchableOpacity
                      key={time}
                      onPress={() => handleSelect("departureTime", time)}
                      style={styles.dropdownItem}
                    >
                      <Text>{time}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Number of guests</Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.input}
                placeholder="Number of guests"
                value={numGuests}
                onChangeText={setNumGuests}
                keyboardType="numeric"
              />
            </View>
          </View>


          <View style={styles.inputContainer}>
            <Text style={styles.label}>Payment Method</Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.input}
                placeholder="Select Method"
                value={paymentMethod}
                onChangeText={setpaymentMethod}
              />
              <TouchableOpacity
                onPress={() => toggleDropdown("paymentMethod")}
                style={styles.iconContainer}
              >
                <AntDesign
                  name="caretdown"
                  size={12}
                  color="#777"
                  style={styles.iconInside}
                />
              </TouchableOpacity>
            </View>
            {showOptions.paymentMethod && (
              <View style={styles.dropdown}>
                {["CASH", "ONLINE",].map(
                  (method) => (
                    <TouchableOpacity
                      key={method}
                      onPress={() => handleSelect("paymentMethod", method)}
                      style={styles.dropdownItem}
                    >
                      <Text>{method}</Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={handleConfirm}
            style={styles.confirmButton}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Modal
            visible={showPopup}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowPopup(false)}
          >
            <View style={styles.popupContainer}>
              <View style={styles.popup}>
                <Text>Booking Successful!</Text>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    paddingHorizontal: 10, marginTop: 10,
  },

  rowContainer: {
    flexDirection: 'row', // Align children in a row
    justifyContent: 'space-between', // Space between the two input containers
    alignItems: 'flex-start', // Align items at the start
  },
  inputContainer: {
    flex: 1, // Allow each input container to take equal width
    marginRight: 10, // Optional: Add margin between the two inputs
    marginBottom: 12,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    flex: 1,
  },
  inputWithIcon: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dropdown: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: "#fff",
    position: "absolute",
    top: 72,
    width: "100%",
    zIndex: 1,
  },
  dropdownItem: {
    padding: 10,
  },
  decorOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  decorButton: {
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    width: "40%",
    alignItems: "center",
  },
  selected: {
    backgroundColor: "#D3D3D3",
  },
  confirmButton: {
    backgroundColor: "#192c4c",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  iconContainer: {
    position: "absolute",
    right: 10,
  },
});