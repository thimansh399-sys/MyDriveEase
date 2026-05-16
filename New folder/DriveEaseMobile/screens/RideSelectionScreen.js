import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AppShell from '../components/AppShell';
import { colors, rideOptions } from '../data/rideData';

export default function RideSelectionScreen({ navigation }) {
  const [selected, setSelected] = useState('quick');

  return (
    <AppShell>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Choose your DriveEase service</Text>
        <Text style={styles.subtitle}>All drivers are KYC verified and monitored by operations.</Text>

        <View style={styles.options}>
          {rideOptions.map((option) => {
            const active = selected === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.optionCard, active && styles.optionCardActive]}
                onPress={() => setSelected(option.id)}
              >
                <View style={styles.optionTop}>
                  <View>
                    <Text style={styles.optionName}>{option.name}</Text>
                    <Text style={styles.optionDesc}>{option.desc}</Text>
                  </View>
                  <Text style={styles.optionPrice}>Rs {option.price}</Text>
                </View>
                <View style={styles.optionMeta}>
                  <Text style={styles.optionMetaText}>{option.time} pickup</Text>
                  <Text style={styles.optionMetaText}>Insurance available</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.fareCard}>
          <Text style={styles.fareLabel}>Fare includes</Text>
          <Text style={styles.fareText}>Driver charge, platform safety fee, live tracking, and support.</Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('DriverMatching')}>
          <Text style={styles.primaryButtonText}>Confirm Driver</Text>
        </TouchableOpacity>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 18,
    paddingBottom: 34,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 8,
  },
  subtitle: {
    color: colors.muted,
    fontWeight: '700',
    marginTop: 8,
    lineHeight: 22,
  },
  options: {
    gap: 12,
    marginTop: 22,
  },
  optionCard: {
    padding: 18,
    borderRadius: 22,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionCardActive: {
    borderColor: colors.green,
    backgroundColor: '#112b25',
  },
  optionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  optionName: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 18,
  },
  optionDesc: {
    color: colors.muted,
    marginTop: 4,
    maxWidth: 210,
  },
  optionPrice: {
    color: colors.green,
    fontWeight: '900',
    fontSize: 18,
  },
  optionMeta: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  optionMetaText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  fareCard: {
    marginTop: 18,
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fareLabel: {
    color: colors.green,
    fontWeight: '900',
  },
  fareText: {
    color: colors.muted,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: 6,
  },
  primaryButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  primaryButtonText: {
    color: '#041009',
    fontWeight: '900',
    fontSize: 16,
  },
});
