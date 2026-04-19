import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DriverDetailsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Details</Text>
      {/* Add driver photo, name, rating, car details, call/chat buttons here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101924', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4ade80' },
});
