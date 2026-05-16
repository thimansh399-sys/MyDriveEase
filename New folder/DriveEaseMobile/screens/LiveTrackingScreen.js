import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AppShell from '../components/AppShell';
import PremiumMap from '../components/PremiumMap';
import { colors, driver, routeStops } from '../data/rideData';

export default function LiveTrackingScreen({ navigation }) {
  return (
    <AppShell>
      <View style={styles.container}>
        <PremiumMap tracking />

        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.row}>
            <View>
              <Text style={styles.title}>Driver arriving in 4 min</Text>
              <Text style={styles.subtitle}>{routeStops.pickup} to {routeStops.drop}</Text>
            </View>
            <TouchableOpacity style={styles.sos}>
              <Text style={styles.sosText}>SOS</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.driverRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AV</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.driverName}>{driver.name}</Text>
              <Text style={styles.driverMeta}>{driver.car} | {driver.plate}</Text>
            </View>
            <Text style={styles.rating}>{driver.rating}</Text>
          </View>

          <View style={styles.progress}>
            <View style={styles.progressFill} />
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Payment')}>
            <Text style={styles.primaryButtonText}>Continue to Payment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
  },
  sheet: {
    marginTop: -30,
    padding: 18,
    borderRadius: 28,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
  },
  handle: {
    alignSelf: 'center',
    width: 46,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
  },
  title: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 21,
  },
  subtitle: {
    color: colors.muted,
    fontWeight: '700',
    marginTop: 5,
    maxWidth: 250,
  },
  sos: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#ff4d4f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sosText: {
    color: '#fff',
    fontWeight: '900',
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 18,
    padding: 14,
    borderRadius: 18,
    backgroundColor: colors.bg2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#041009',
    fontWeight: '900',
  },
  driverName: {
    color: colors.text,
    fontWeight: '900',
  },
  driverMeta: {
    color: colors.muted,
    marginTop: 3,
  },
  rating: {
    color: colors.green,
    fontWeight: '900',
  },
  progress: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.10)',
    marginTop: 18,
    overflow: 'hidden',
  },
  progressFill: {
    width: '64%',
    height: '100%',
    backgroundColor: colors.green,
  },
  primaryButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  primaryButtonText: {
    color: '#041009',
    fontWeight: '900',
  },
});
