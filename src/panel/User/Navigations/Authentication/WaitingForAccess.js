import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
// Waiting-pana.png
const WaitingForAccessScreen = () => {
  return (
    <View style={styles.container}>
      {/* Display the image */}
      <Image
          source={require("../../../../assets/User/images/Waiting-pana.png")}
          style={styles.image}
          resizeMode="cover"
        />

      {/* Display the message */}
      <Text style={styles.message}>Waiting For Admin Access</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7D0413',
  },
});

export default WaitingForAccessScreen;
