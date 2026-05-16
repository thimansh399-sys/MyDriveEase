import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AppShell from '../components/AppShell';
import { colors, driver } from '../data/rideData';

export default function DriverDetailsScreen({ navigation }) {
  return (
    <AppShell>
      <View style={styles.container}>
        <Text style={styles.title}>Driver assigned</Text>
        <Text style={styles.subtitle}>Your verified DriveEase driver is ready.</Text>

        <View style={styles.card}>
          <View style={styles.driverTop}>
            <View style={styles.photo}>
              <Text style={styles.photoText}>AV</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{driver.name}</Text>
              <Text style={styles.meta}>{driver.rating} rating | {driver.rides} rides</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>KYC</Text>
            </View>
          </View>

          <View style={styles.vehicleCard}>
            <Text style={styles.vehicleTitle}>{driver.car}</Text>
            <Text style={styles.vehiclePlate}>{driver.plate}</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('LiveTracking')}>
          <Text style={styles.primaryButtonText}>Start Live Tracking</Text>
        </TouchableOpacity>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    justifyContent: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.muted,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 20,
  },
  card: {
    padding: 20,
    borderRadius: 28,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
  },
  driverTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  photo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoText: {
    color: '#041009',
    fontWeight: '900',
    fontSize: 20,
  },
  name: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 21,
  },
  meta: {
    color: colors.muted,
    marginTop: 4,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(32,230,138,0.14)',
  },
  badgeText: {
    color: colors.green,
    fontWeight: '900',
  },
  vehicleCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  vehicleTitle: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 18,
  },
  vehiclePlate: {
    color: colors.green,
    fontWeight: '900',
    marginTop: 6,
    letterSpacing: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: colors.text,
    fontWeight: '900',
  },
  primaryButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  primaryButtonText: {
    color: '#041009',
    fontWeight: '900',
    fontSize: 16,
  },
});
