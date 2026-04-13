import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MacroProgress({ label, consumed, target, color = '#4f46e5' }) {
  const progress = target > 0 ? Math.min(1, consumed / target) : 0;
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{consumed.toFixed(1)} / {target}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.bar, { width: `${progress * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label: { fontSize: 14, fontWeight: '600', color: '#111827' },
  value: { fontSize: 13, color: '#4b5563' },
  track: { height: 10, borderRadius: 8, backgroundColor: '#e5e7eb', overflow: 'hidden' },
  bar: { height: 10, borderRadius: 8 },
});
