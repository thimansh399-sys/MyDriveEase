import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AppShell from '../components/AppShell';
import { colors } from '../data/rideData';

export default function DriverMatchingScreen({ navigation }) {
  useEffect(() => {
    const timeout = setTimeout(() => navigation.replace('DriverDetails'), 1400);
    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <AppShell>
      <View style={styles.container}>
        <View style={styles.radar}>
          <View style={styles.radarRing} />
          <View style={styles.radarRing2} />
          <View style={styles.centerDot}>
            <Text style={styles.centerText}>DE</Text>
          </View>
        </View>

        <Text style={styles.title}>Finding a verified driver</Text>
        <Text style={styles.subtitle}>Checking ratings, distance, documents, and availability near you.</Text>

        <View style={styles.steps}>
          <Text style={styles.step}>Verified profile matched</Text>
          <Text style={styles.step}>Nearest driver selected</Text>
          <Text style={styles.step}>Ride safety checks ready</Text>
        </View>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.replace('DriverDetails')}>
          <Text style={styles.secondaryText}>Skip preview</Text>
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
  radar: {
    width: 230,
    height: 230,
    borderRadius: 115,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(32,230,138,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(32,230,138,0.16)',
  },
  radarRing: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1,
    borderColor: 'rgba(32,230,138,0.35)',
  },
  radarRing2: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: 'rgba(36,137,255,0.35)',
  },
  centerDot: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.green,
  },
  centerText: {
    color: '#041009',
    fontWeight: '900',
    fontSize: 20,
  },
  title: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 26,
    marginTop: 28,
  },
  subtitle: {
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 23,
    marginTop: 10,
    maxWidth: 310,
    fontWeight: '700',
  },
  steps: {
    width: '100%',
    gap: 10,
    marginTop: 28,
  },
  step: {
    color: colors.text,
    fontWeight: '800',
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButton: {
    marginTop: 20,
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryText: {
    color: colors.text,
    fontWeight: '800',
  },
});
