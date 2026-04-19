import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function GlassCard({ style, children }) {
  return (
    <View style={[styles.glass, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  glass: {
    backgroundColor: 'rgba(24,31,42,0.7)',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: 'rgba(76,222,128,0.15)',
    marginVertical: 8,
  },
});
