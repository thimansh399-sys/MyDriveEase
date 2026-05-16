import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AppShell from '../components/AppShell';
import { colors } from '../data/rideData';

export default function ProfileScreen({ navigation }) {
  const items = ['My rides', 'Saved places', 'Payment methods', 'Insurance', 'Help & support', 'Legal'];

  return (
    <AppShell>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.profileTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>H</Text>
          </View>
          <Text style={styles.name}>Himanshu Singh</Text>
          <Text style={styles.phone}>+91 70075 15654</Text>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>Verified customer</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>18</Text>
            <Text style={styles.statLabel}>Rides</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>4.9</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Plans</Text>
          </View>
        </View>

        <View style={styles.menu}>
          {items.map((item) => (
            <TouchableOpacity key={item} style={styles.menuItem}>
              <Text style={styles.menuText}>{item}</Text>
              <Text style={styles.menuArrow}>Next</Text>
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
  backButton: {
    alignSelf: 'flex-start',
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
  profileTop: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 28,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 18,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#041009',
    fontWeight: '900',
    fontSize: 30,
  },
  name: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 24,
    marginTop: 16,
  },
  phone: {
    color: colors.muted,
    fontWeight: '700',
    marginTop: 5,
  },
  verifiedBadge: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(32,230,138,0.14)',
  },
  verifiedText: {
    color: colors.green,
    fontWeight: '900',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  stat: {
    flex: 1,
    padding: 16,
    borderRadius: 18,
    backgroundColor: colors.bg2,
    alignItems: 'center',
  },
  statValue: {
    color: colors.green,
    fontWeight: '900',
    fontSize: 22,
  },
  statLabel: {
    color: colors.muted,
    fontWeight: '700',
    marginTop: 4,
  },
  menu: {
    marginTop: 18,
    gap: 10,
  },
  menuItem: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuText: {
    color: colors.text,
    fontWeight: '900',
  },
  menuArrow: {
    color: colors.green,
    fontWeight: '800',
  },
});
