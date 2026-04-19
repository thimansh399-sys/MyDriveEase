import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#10151c', alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#fff', fontSize: 24 }}>Test Home Screen</Text>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#10151c',
  },
  searchBarWrapper: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    borderRadius: 18,
    overflow: 'hidden',
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(24,31,42,0.7)',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  bottomSheetWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  bottomSheet: {
    width: '96%',
    borderRadius: 28,
    paddingVertical: 24,
    paddingHorizontal: 18,
    marginBottom: Platform.OS === 'ios' ? 32 : 18,
    alignSelf: 'center',
  },
  rideTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  rideOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  rideOption: {
    alignItems: 'center',
    padding: 8,
    flex: 1,
  },
  rideOptionText: {
    color: '#fff',
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
  },
  farePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 6,
  },
  fareLabel: {
    color: '#aaa',
    fontSize: 15,
    fontWeight: '500',
  },
  fareValue: {
    color: '#4cde80',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: '#4cde80',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: '#4cde80',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  bookButtonText: {
    color: '#10151c',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 120 : 100,
    right: 28,
    backgroundColor: '#fff',
    borderRadius: 30,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
    zIndex: 20,
  },
});
