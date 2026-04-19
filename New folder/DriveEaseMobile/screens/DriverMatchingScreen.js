import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DriverMatchingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finding your perfect driver…</Text>
      {/* Add animated loader here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101924', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, color: '#4ade80', fontWeight: 'bold' },
});
