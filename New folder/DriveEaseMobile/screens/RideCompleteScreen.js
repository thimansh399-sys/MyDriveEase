import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AppShell from '../components/AppShell';
import { colors } from '../data/rideData';

export default function RideCompleteScreen({ navigation }) {
  return (
    <AppShell>
      <View style={styles.container}>
        <View style={styles.success}>
          <Text style={styles.successText}>OK</Text>
        </View>
        <Text style={styles.title}>Ride completed</Text>
        <Text style={styles.subtitle}>Thanks for choosing DriveEase. Your invoice is ready.</Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Trip fare</Text>
          <Text style={styles.cardValue}>Rs 269</Text>
          <Text style={styles.cardMeta}>Lucknow | 8.4 km | 24 min</Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.primaryButtonText}>Book Another Ride</Text>
        </TouchableOpacity>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  success: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successText: {
    color: '#041009',
    fontWeight: '900',
    fontSize: 28,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
    marginTop: 24,
  },
  subtitle: {
    color: colors.muted,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 23,
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 22,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 28,
    alignItems: 'center',
  },
  cardLabel: {
    color: colors.muted,
    fontWeight: '800',
  },
  cardValue: {
    color: colors.green,
    fontWeight: '900',
    fontSize: 34,
    marginTop: 8,
  },
  cardMeta: {
    color: colors.text,
    fontWeight: '700',
    marginTop: 8,
  },
  primaryButton: {
    width: '100%',
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  primaryButtonText: {
    color: '#041009',
    fontWeight: '900',
  },
});
