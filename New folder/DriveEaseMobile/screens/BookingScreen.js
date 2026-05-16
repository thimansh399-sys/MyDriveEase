import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import AppShell from '../components/AppShell';
import PremiumMap from '../components/PremiumMap';
import { colors, routeStops } from '../data/rideData';

export default function BookingScreen({ navigation }) {
  const [pickup, setPickup] = useState(routeStops.pickup);
  const [drop, setDrop] = useState(routeStops.drop);

  return (
    <AppShell>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Plan your ride</Text>
        </View>

        <PremiumMap compact />

        <View style={styles.form}>
          <Text style={styles.label}>Pickup location</Text>
          <TextInput value={pickup} onChangeText={setPickup} style={styles.input} placeholderTextColor={colors.muted} />

          <Text style={styles.label}>Drop location</Text>
          <TextInput value={drop} onChangeText={setDrop} style={styles.input} placeholderTextColor={colors.muted} />

          <View style={styles.tripRow}>
            <View style={styles.tripStat}>
              <Text style={styles.tripValue}>{routeStops.distance}</Text>
              <Text style={styles.tripLabel}>Distance</Text>
            </View>
            <View style={styles.tripStat}>
              <Text style={styles.tripValue}>{routeStops.duration}</Text>
              <Text style={styles.tripLabel}>Estimated time</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('RideSelection')}>
            <Text style={styles.primaryButtonText}>See Driver Options</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 18,
    paddingBottom: 34,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
  },
  backText: {
    color: colors.text,
    fontWeight: '800',
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
  },
  form: {
    marginTop: 16,
    padding: 18,
    borderRadius: 24,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    color: colors.muted,
    fontWeight: '800',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    color: colors.text,
    fontWeight: '800',
  },
  tripRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  tripStat: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(32,230,138,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(32,230,138,0.22)',
  },
  tripValue: {
    color: colors.green,
    fontSize: 20,
    fontWeight: '900',
  },
  tripLabel: {
    color: colors.muted,
    marginTop: 4,
    fontWeight: '700',
  },
  primaryButton: {
    height: 56,
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
