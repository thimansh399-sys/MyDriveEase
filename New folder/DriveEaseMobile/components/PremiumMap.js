import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../data/rideData';

const roads = [
  { top: '14%', left: '-8%', width: '72%', rotate: '-24deg' },
  { top: '26%', right: '-12%', width: '82%', rotate: '18deg' },
  { top: '44%', left: '-10%', width: '120%', rotate: '-6deg' },
  { top: '64%', right: '-10%', width: '92%', rotate: '22deg' },
  { top: '78%', left: '-14%', width: '78%', rotate: '-18deg' },
];

export default function PremiumMap({ compact = false, tracking = false }) {
  return (
    <View style={[styles.map, compact && styles.compact]}>
      <View style={styles.grid} />
      {roads.map((road, index) => (
        <View
          key={`${road.top}-${index}`}
          style={[
            styles.road,
            {
              top: road.top,
              left: road.left,
              right: road.right,
              width: road.width,
              transform: [{ rotate: road.rotate }],
            },
          ]}
        />
      ))}

      <View style={styles.route}>
        <View style={styles.routeDot} />
        <View style={styles.routeLine} />
        <View style={[styles.routeDot, styles.routeDotEnd]} />
      </View>

      <View style={[styles.pin, styles.pickup]}>
        <Text style={styles.pinText}>P</Text>
      </View>
      <View style={[styles.pin, styles.drop]}>
        <Text style={styles.pinText}>D</Text>
      </View>

      {tracking && (
        <View style={styles.car}>
          <Text style={styles.carText}>CAR</Text>
        </View>
      )}

      <View style={styles.mapBadge}>
        <Text style={styles.mapBadgeTitle}>{tracking ? 'Driver arriving' : 'Live route preview'}</Text>
        <Text style={styles.mapBadgeText}>{tracking ? '4 min away' : '8.4 km | 24 min'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 360,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#0b1b2b',
    borderWidth: 1,
    borderColor: colors.border,
  },
  compact: {
    height: 250,
  },
  grid: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0c2235',
    opacity: 0.92,
  },
  road: {
    position: 'absolute',
    height: 22,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  route: {
    position: 'absolute',
    left: '26%',
    top: '22%',
    height: '56%',
    alignItems: 'center',
  },
  routeDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.green,
    borderWidth: 4,
    borderColor: '#dfffee',
  },
  routeDotEnd: {
    backgroundColor: colors.blue,
    marginTop: 'auto',
  },
  routeLine: {
    width: 5,
    flex: 1,
    borderRadius: 4,
    backgroundColor: colors.green,
    marginVertical: 4,
  },
  pin: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.green,
    borderWidth: 4,
    borderColor: '#e8fff3',
  },
  pickup: {
    left: '19%',
    top: '17%',
  },
  drop: {
    left: '19%',
    bottom: '16%',
    backgroundColor: colors.blue,
  },
  pinText: {
    color: '#041009',
    fontWeight: '900',
    fontSize: 13,
  },
  car: {
    position: 'absolute',
    left: '44%',
    top: '46%',
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  carText: {
    color: '#07111f',
    fontWeight: '900',
    fontSize: 10,
  },
  mapBadge: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(5,12,22,0.82)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapBadgeTitle: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 15,
  },
  mapBadgeText: {
    color: colors.muted,
    fontWeight: '700',
    marginTop: 3,
  },
});
