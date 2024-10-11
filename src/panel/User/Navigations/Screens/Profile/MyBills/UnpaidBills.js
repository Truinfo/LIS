import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBills } from '../../../../Redux/Slice/ProfileSlice/myBillsSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Linking from 'expo-linking';
const UnpaidBills = () => {
    const dispatch = useDispatch();
    const [societyId, setSocietyId] = useState('');
    const [flatno, setFlatno] = useState('');
    const [blockno, setBlockno] = useState('');
    const [upiId, setUpiId] = useState('7997148737@ibl');
    const [transactionNote, setTransactionNote] = useState('Maintenance');
    const [payeeName, setPayeeName] = useState('');
    const [SelectedMonthPayment, setSelectedMonthPayment] = useState(null);
    const { payments } = useSelector((state) => state.mybills.bills)
    const generateUpiUrl = (upiId, payeeName, amount, transactionNote) => {
        const currency = 'INR';
        const encodedPayeeName = encodeURIComponent(payeeName);
        const encodedTransactionNote = encodeURIComponent(transactionNote);

        return `upi://pay?pa=${upiId}&pn=${encodedPayeeName}&am=${amount}&cu=${currency}&tn=${encodedTransactionNote}`;
    };
    useEffect(() => {
        const getUserName = async () => {
            try {
                const userString = await AsyncStorage.getItem("user");
                if (userString !== null) {
                    const user = JSON.parse(userString);
                    setSocietyId(user.societyId);
                    setBlockno(user.buildingName);
                    setFlatno(user.flatNumber)
                    setPayeeName(user.name)
                }
            } catch (error) {
                console.error("Failed to fetch the user from async storage", error);
            }
        };

        getUserName();
    }, []);
    useEffect(() => {
        if (societyId) {
            dispatch(fetchBills({ societyId, flatno, blockno }))
        }
    }, [dispatch, societyId, blockno, flatno]);
    const unpaidBills = Array.isArray(payments) ? payments.filter(bill => bill.status !== 'Paid') : [];

    const initiateUpiPayment = async (data) => {
        const upiUrl = generateUpiUrl(upiId, payeeName, data.amount, transactionNote);
        setSelectedMonthPayment(data.monthAndYear)

        try {
            const supported = await Linking.canOpenURL(upiUrl);

            if (supported) {
                await Linking.openURL(upiUrl);
            } else {
                Alert.alert('Error', 'No UPI apps installed to handle the payment.');
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to initiate UPI payment.');
            console.error(err);
        }
    };



    const renderItem = ({ item }) => (
        <View style={styles.billContainer}>
            <View style={styles.header}>
                <Text style={{ fontSize: 20, fontWeight: '600' }}>{item.monthAndYear}</Text>
                <TouchableOpacity onPress={() => initiateUpiPayment(item)}>
                    <View style={styles.chip}>
                        <Text style={styles.chipText}>{item.status === "UnPaid" ? "Pay Now" : ""}</Text>
                    </View>
                </TouchableOpacity>

            </View>
            <Text style={{ fontSize: 20, fontWeight: '600' }}>₹{item.amount}</Text>
        </View>
    );
    return (
        <View style={styles.container}>
            <FlatList
                data={unpaidBills}
                renderItem={renderItem}
                keyExtractor={item => item._id}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 16,
    },
    billContainer: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    billText: {
        fontSize: 14,
    },
    chip: {
        backgroundColor: '#dc2626', // Red color for Unpaid bills
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    chipText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    }, amountContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end', // Aligns content to the right end
        marginTop: 5, // Optional, for spacing
    },
});


export default UnpaidBills;