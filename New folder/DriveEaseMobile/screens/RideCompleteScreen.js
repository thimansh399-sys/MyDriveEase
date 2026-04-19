import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RideCompleteScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ride Complete</Text>
      {/* Add success animation, fare summary, rating, tip option here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101924', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4ade80' },
});
