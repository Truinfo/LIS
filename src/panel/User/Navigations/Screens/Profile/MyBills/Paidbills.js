import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBills } from "../../../../Redux/Slice/ProfileSlice/myBillsSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, StyleSheet, FlatList } from "react-native";

const Paidbills = () => {
  const dispatch = useDispatch();
  const [societyId, setSocietyId] = useState("");
  const [flatno, setFlatno] = useState("");
  const [blockno, setBlockno] = useState("");
  const { payments } = useSelector((state) => state.mybills.bills);

  useEffect(() => {
    const getUserName = async () => {
      try {
        const userString = await AsyncStorage.getItem("user");
        if (userString !== null) {
          const user = JSON.parse(userString);
          setSocietyId(user.societyId);
          setBlockno(user.buildingName);
          setFlatno(user.flatNumber);
        }
      } catch (error) {
        console.error("Failed to fetch the user from async storage", error);
      }
    };

    getUserName();
  }, []);

  useEffect(() => {
    if (societyId) {
      dispatch(fetchBills({ societyId, flatno, blockno }));
    }
  }, [dispatch, societyId, blockno, flatno]);

  const paidBills = Array.isArray(payments)
    ? payments.filter((bill) => bill.status !== "UnPaid")
    : [];

  const renderItem = ({ item }) => (
    <View style={styles.billContainer}>
      <View style={styles.header}>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>
          {item.monthAndYear}
        </Text>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{item.status}</Text>
        </View>
      </View>
      <Text style={{ fontSize: 14, fontWeight: "400", color: "#777" }}>
        {item._id}
      </Text>
      <Text style={styles.billText}>TXN ID: {item.transactionId}</Text>
      <Text style={styles.billText}>TXN Type: {item.transactionType}</Text>
      <Text style={styles.billText}>Paid On: {item.payedOn}</Text>
      <View style={styles.amountContainer}>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>
          ₹{item.paidAmount}
        </Text>
      </View>
    </View>
  );
  console.log("payments",payments);
  return (
    <View style={styles.container}>
      <FlatList
        data={paidBills}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  billContainer: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  billText: {
    fontSize: 14,
  },
  chip: {
    backgroundColor: "#4caf50", // Green color for paid bills
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  chipText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "flex-end", 
    marginTop: 5, 
  },
});

export default Paidbills;
