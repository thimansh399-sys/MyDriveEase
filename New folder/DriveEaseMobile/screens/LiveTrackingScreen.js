import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LiveTrackingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Tracking</Text>
      {/* Add map, route, driver info, SOS button here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101924', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4ade80' },
});
