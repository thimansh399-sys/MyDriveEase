import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RideSelectionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Ride</Text>
      {/* Add ride option cards here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101924', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4ade80' },
});
