import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AppShell from '../components/AppShell';
import { colors } from '../data/rideData';

export default function SplashScreen({ navigation }) {
  return (
    <AppShell>
      <View style={styles.container}>
        <View style={styles.logoMark}>
          <Text style={styles.logoMarkText}>DE</Text>
        </View>
        <Text style={styles.logo}>DriveEase</Text>
        <Text style={styles.tagline}>Verified drivers. Live tracking. Transparent fares.</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>4.9</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>24/7</Text>
            <Text style={styles.statLabel}>Support</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>50k+</Text>
            <Text style={styles.statLabel}>Users</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.replace('Home')}>
          <Text style={styles.primaryButtonText}>Book a Driver</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Auth')}>
          <Text style={styles.secondaryButtonText}>Login or create account</Text>
        </TouchableOpacity>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.bg,
  },
  logoMark: {
    width: 82,
    height: 82,
    borderRadius: 24,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  logoMarkText: {
    color: '#041009',
    fontWeight: '900',
    fontSize: 26,
  },
  logo: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 44,
  },
  tagline: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 26,
    marginTop: 10,
    maxWidth: 320,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 34,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    color: colors.green,
    fontSize: 22,
    fontWeight: '900',
  },
  statLabel: {
    color: colors.muted,
    marginTop: 4,
    fontWeight: '700',
  },
  primaryButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 34,
  },
  primaryButtonText: {
    color: '#041009',
    fontWeight: '900',
    fontSize: 16,
  },
  secondaryButton: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.text,
    fontWeight: '800',
  },
});
