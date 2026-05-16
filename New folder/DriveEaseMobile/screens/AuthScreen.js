import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import AppShell from '../components/AppShell';
import { colors } from '../data/rideData';

export default function AuthScreen({ navigation }) {
  const [phone, setPhone] = useState('');

  return (
    <AppShell>
      <View style={styles.container}>
        <Text style={styles.title}>Login to DriveEase</Text>
        <Text style={styles.subtitle}>Enter your mobile number to continue with OTP.</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Mobile number</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+91 70075 15654"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.replace('Home')}>
            <Text style={styles.primaryButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.replace('Home')}>
          <Text style={styles.guest}>Continue as guest</Text>
        </TouchableOpacity>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 22,
  },
  title: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 30,
  },
  subtitle: {
    color: colors.muted,
    fontWeight: '700',
    marginTop: 8,
    lineHeight: 23,
  },
  card: {
    marginTop: 24,
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
  },
  input: {
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.bg2,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    color: colors.text,
    fontWeight: '900',
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
  guest: {
    color: colors.green,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 20,
  },
});
