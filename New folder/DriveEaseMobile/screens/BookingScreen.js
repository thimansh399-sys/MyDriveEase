import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BookingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Booking Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#101924',
  },
  text: {
    color: '#4ade80',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
