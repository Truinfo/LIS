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
            <Text style={styles.text}>
                Your plan has expired. Please renew the plan by clicking on the button below.
            </Text>
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
        justifyContent: 'center',  // Center content vertically
        alignItems: 'center',      // Center content horizontally
        backgroundColor: '#f0f0f0',
        padding: 20,               // Add padding for better spacing
    },
    renewButton: {
        backgroundColor: '#7d0431', 
        paddingVertical: 15, 
        paddingHorizontal: 30,
        borderRadius: 8, 
        marginTop: 20,            // Add margin to separate from text
    },
    renewButtonText: {
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold', 
    },
    image: {
        width: 300,               // Adjust image width
        height: 300,              // Adjust image height
        marginBottom: 20,         // Add margin below the image
    },
    text: {
        fontSize: 16, 
        color: '#333',            // Set text color
        textAlign: 'center',      // Center the text
        marginBottom: 20,         // Add margin below the text
    },
});
