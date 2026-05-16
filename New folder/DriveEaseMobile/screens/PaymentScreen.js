import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AppShell from '../components/AppShell';
import { colors } from '../data/rideData';

export default function PaymentScreen({ navigation }) {
  return (
    <AppShell>
      <View style={styles.container}>
        <Text style={styles.title}>Payment</Text>
        <Text style={styles.subtitle}>Choose a secure payment method.</Text>

        {['UPI', 'Cash', 'Wallet'].map((method, index) => (
          <TouchableOpacity key={method} style={[styles.method, index === 0 && styles.methodActive]}>
            <Text style={styles.methodText}>{method}</Text>
            <Text style={styles.methodMeta}>{index === 0 ? 'Recommended' : 'Available'}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.bill}>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Driver fare</Text>
            <Text style={styles.billValue}>Rs 249</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Safety fee</Text>
            <Text style={styles.billValue}>Rs 20</Text>
          </View>
          <View style={styles.billTotal}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>Rs 269</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate('RideComplete')}>
          <Text style={styles.primaryButtonText}>Pay and Finish</Text>
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
  method: {
    padding: 18,
    borderRadius: 20,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  methodActive: {
    borderColor: colors.green,
    backgroundColor: '#112b25',
  },
  methodText: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 18,
  },
  methodMeta: {
    color: colors.green,
    fontWeight: '800',
  },
  bill: {
    marginTop: 12,
    padding: 18,
    borderRadius: 20,
    backgroundColor: colors.bg2,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  billLabel: {
    color: colors.muted,
    fontWeight: '700',
  },
  billValue: {
    color: colors.text,
    fontWeight: '900',
  },
  billTotal: {
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: 14,
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 18,
  },
  totalValue: {
    color: colors.green,
    fontWeight: '900',
    fontSize: 18,
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
  },
});
