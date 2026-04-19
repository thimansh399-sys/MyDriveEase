// Fresh SplashScreen will be added after new structure is created.
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SplashScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>DriveEase</Text>
      <Text style={styles.tagline}>Your Personal Driver, Anytime</Text>
      <View style={{marginTop: 32}}>
        <Text style={{color: '#4ade80', fontWeight: 'bold', fontSize: 16, marginBottom: 8}}>Navigate to Screens (Dev/Test)</Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('Auth')}><Text style={styles.navBtnText}>Auth</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('Home')}><Text style={styles.navBtnText}>Home</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('RideSelection')}><Text style={styles.navBtnText}>Ride Selection</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('DriverMatching')}><Text style={styles.navBtnText}>Matching</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('DriverDetails')}><Text style={styles.navBtnText}>Driver Details</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('LiveTracking')}><Text style={styles.navBtnText}>Live Tracking</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('Payment')}><Text style={styles.navBtnText}>Payment</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('RideComplete')}><Text style={styles.navBtnText}>Ride Complete</Text></TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('Profile')}><Text style={styles.navBtnText}>Profile</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101924', alignItems: 'center', justifyContent: 'center' },
  logo: { fontSize: 40, fontWeight: 'bold', color: '#4ade80', marginBottom: 16 },
  tagline: { color: '#fff', fontSize: 18, opacity: 0.7 },
  navBtn: {
    backgroundColor: '#222e3a',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    margin: 4,
    borderWidth: 1,
    borderColor: '#4ade80',
  },
  navBtnText: {
    color: '#4ade80',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
