import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet,ActivityIndicator, TouchableOpacity, SafeAreaView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import CheckIn from './Check-In';
import CheckOut from './Check-Out';
import Waiting from './Waiting';
import { fetchVisitors } from '../../../User/Redux/Slice/Security_Panel/InandOutSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InandOut1 = () => {
    const [activeTab, setActiveTab] = useState('Waiting');
    const dispatch = useDispatch();
    const [societyId, setSocietyId] = useState(null);
    const { visitors = [], status, error } = useSelector((state) => state.visitors);

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
            dispatch(fetchVisitors(societyId));
        }
    }, [dispatch, societyId]);

    const checkInData = visitors.filter((visitor) => visitor.status === 'Check In' && (visitor));
    const checkOutData = visitors.filter((visitor) => visitor.status === 'Check Out' && (visitor));
    const waitingData = visitors.filter((visitor) => visitor.status === 'Waiting' && (visitor));

    if (status === 'loading') {
        return(
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#7d0431" />
            </View>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'Check In':
                return <CheckIn data={checkInData} setActiveTab={setActiveTab} />;
            case 'Check Out':
                return <CheckOut data={checkOutData} setActiveTab={setActiveTab} />;
            case 'Waiting':
                return <Waiting data={waitingData} setActiveTab={setActiveTab} />;
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topHalf}>
                <View style={styles.topNav}>
                    <TouchableOpacity style={styles.tabView} onPress={() => setActiveTab('Check In')}>
                        <Text style={{ color: activeTab === 'Check In' ? '#800336' : 'black',fontWeight:"bold" }}>Check In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tabView} onPress={() => setActiveTab('Waiting')}>
                        <Text style={{ color: activeTab === 'Waiting' ? '#800336' : 'black',fontWeight:"bold" }}>Waiting</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tabView} onPress={() => setActiveTab('Check Out')}>
                        <Text style={{ color: activeTab === 'Check Out' ? '#800336' : 'black',fontWeight:"bold" }}>Check Out</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.bottomHalf}>
                {renderContent()}
            </View>
        </SafeAreaView>
    );
};

export default InandOut1;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topHalf: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F8E9DC',
    },
    bottomHalf: {
        flex: 8,
        backgroundColor: '#ffffff',
    },
    topNav: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 50,
        paddingVertical: 20,
    },
    tabView: {
        alignItems: "center"
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
