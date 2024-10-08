import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import renewal from "../../../../assets/Admin/Imgaes/renewal2.png"; 
const PlanRenewalScreen = () => {
    return (
        <View style={styles.container}>
            <Image
                source={renewal} 
                style={styles.image}
                resizeMode="contain"
            />
            <TouchableOpacity style={styles.renewButton}>
                <Text style={styles.renewButtonText}>Renew Expired Plan</Text>
            </TouchableOpacity>
        </View>
    );
};

export default PlanRenewalScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start', 
        alignItems: 'center',
        paddingTop: 50, 
        backgroundColor: '#f0f0f0', 
    },
    renewButton: {
        backgroundColor: '#007AFF', 
        paddingVertical: 15, 
        paddingHorizontal: 30,
        borderRadius: 8, 
        marginBottom: 20,
    },
    renewButtonText: {
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold', // Bold text
    },
    image: {
        width: 400, // Image width
        height:400, // Image height
    },
});
