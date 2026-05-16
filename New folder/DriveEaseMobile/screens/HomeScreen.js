import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AppShell from '../components/AppShell';
import PremiumMap from '../components/PremiumMap';
import { colors, savedPlaces } from '../data/rideData';

export default function HomeScreen({ navigation }) {
  return (
    <AppShell>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good evening</Text>
            <Text style={styles.title}>Where are you going?</Text>
          </View>
          <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.avatarText}>H</Text>
          </TouchableOpacity>
        </View>

        <PremiumMap />

        <View style={styles.bookingCard}>
          <TouchableOpacity style={styles.inputRow} onPress={() => navigation.navigate('Booking')}>
            <View style={styles.greenDot} />
            <View style={styles.inputTextWrap}>
              <Text style={styles.inputLabel}>Pickup</Text>
              <Text style={styles.inputText}>Current Location</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.inputRow} onPress={() => navigation.navigate('Booking')}>
            <View style={styles.blueDot} />
            <View style={styles.inputTextWrap}>
              <Text style={styles.inputLabel}>Drop location</Text>
              <Text style={styles.inputText}>Search destination</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('Booking')}>
            <Text style={styles.primaryButtonText}>Continue Booking</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Saved places</Text>
        <View style={styles.savedList}>
          {savedPlaces.map((place) => (
            <TouchableOpacity key={place.label} style={styles.savedCard} onPress={() => navigation.navigate('Booking')}>
              <Text style={styles.savedIcon}>{place.label.slice(0, 1)}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.savedLabel}>{place.label}</Text>
                <Text style={styles.savedAddress}>{place.address}</Text>
              </View>
              <Text style={styles.savedEta}>{place.eta}</Text>
            </TouchableOpacity>
          ))}
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
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  greeting: {
    color: colors.muted,
    fontWeight: '700',
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 4,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#041009',
    fontWeight: '900',
  },
  bookingCard: {
    marginTop: -40,
    marginHorizontal: 8,
    padding: 18,
    borderRadius: 24,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  greenDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.green,
  },
  blueDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.blue,
  },
  inputTextWrap: {
    flex: 1,
  },
  inputLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  inputText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 24,
  },
  primaryButton: {
    marginTop: 14,
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#041009',
    fontWeight: '900',
  },
  sectionTitle: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  savedList: {
    gap: 10,
  },
  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  savedIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(32,230,138,0.14)',
    color: colors.green,
    textAlign: 'center',
    lineHeight: 34,
    fontWeight: '900',
  },
  savedLabel: {
    color: colors.text,
    fontWeight: '900',
  },
  savedAddress: {
    color: colors.muted,
    marginTop: 2,
  },
  savedEta: {
    color: colors.green,
    fontWeight: '800',
    fontSize: 12,
  },
});
