import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { colors } from '../data/rideData';

export default function AppShell({ children }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
