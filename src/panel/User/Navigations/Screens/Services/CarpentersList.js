import React, { useState,useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Modal,
  Linking,
  ActivityIndicator,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Zocial from "@expo/vector-icons/Zocial";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../../../Redux/Slice/ServiceSlice/ServiceSlice";

const CarpentersList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNumbers, setSelectedNumbers] = useState({});
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.services);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleCall = (phoneLeft, phoneRight) => {
    setSelectedNumbers({ phoneLeft, phoneRight });
    setModalVisible(true);
  };
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
     
      <View style={styles.rowContainer}>
        <View style={styles.column}>
          <View style={styles.iconAndText}>
            <FontAwesome5 name="user-alt" size={15} style={styles.icon} />
            <Text style={styles.name}>{item.name}</Text>
          </View>
          <View style={styles.iconAndText}>
            <Zocial name="call" size={19} style={styles.icon} />
            <Text style={styles.phone}>{item.phoneNumber}</Text>
          </View>
        </View>
       
      </View>
      <TouchableOpacity
        onPress={() => handleCall(item.phoneLeft, item.phoneRight)}
        style={styles.callButton}
      >
        <Text style={styles.callNowText}>Call Now</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (<View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#7d0431" />
    </View>)
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={data.carpenter}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Choose a number to call:</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                Linking.openURL(`tel:${selectedNumbers.phoneLeft}`);
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>
                {selectedNumbers.phoneLeft}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                Linking.openURL(`tel:${selectedNumbers.phoneRight}`);
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>
                {selectedNumbers.phoneRight}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingTop: 10
  },
  itemContainer: {
    backgroundColor: "#fcf6f0",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderColor: "#7d0431",
    marginBottom: 10,
    padding: 15,
  },
  itemHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
    color: "black",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftColumn: {
    flex: 1,
    marginRight: 10,
  },
  rightColumn: {
    flex: 1,
  },
  iconAndText: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  icon: {
    marginRight: 10,
    color: "#c87b6b",
  },
  name: {
    fontSize: 17,
    fontWeight: "500",
    marginLeft: 8,
  },
  phone: {
    fontSize: 14,
    color: "#666",
  },
  separator: {
    height: 5,
  },
  callButton: {
    backgroundColor: "#7d0431",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 100,
    width: 100,
  },
  callNowText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CarpentersList;
