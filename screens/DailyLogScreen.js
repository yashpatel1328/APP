import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../storage/AppContext';

export default function DailyLogScreen() {
  const { today, consumed, removeEntry } = useApp();
  const entries = today?.entries || [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Daily Log</Text>
      <View style={styles.totalCard}>
        <Text style={styles.totalTxt}>Calories: {consumed.calories.toFixed(0)}</Text>
        <Text style={styles.totalTxt}>Protein: {consumed.protein.toFixed(1)}g</Text>
        <Text style={styles.totalTxt}>Carbs: {consumed.carbs.toFixed(1)}g</Text>
        <Text style={styles.totalTxt}>Fat: {consumed.fat.toFixed(1)}g</Text>
        <Text style={styles.totalTxt}>Fiber: {consumed.fiber.toFixed(1)}g</Text>
      </View>

      {entries.map((entry) => (
        <View key={entry.id} style={styles.card}>
          <View style={styles.rowTop}>
            <Text style={styles.meal}>{entry.mealName}</Text>
            <TouchableOpacity onPress={() => removeEntry(entry.id)}>
              <Text style={styles.remove}>Remove</Text>
            </TouchableOpacity>
          </View>
          {entry.items.map((item, idx) => (
            <Text key={`${idx}`} style={styles.item}>• {item.name} x {item.quantity}</Text>
          ))}
          <Text style={styles.meta}>Cals {entry.totals.calories.toFixed(0)} | P {entry.totals.protein.toFixed(1)} | C {entry.totals.carbs.toFixed(1)} | F {entry.totals.fat.toFixed(1)} | Fi {entry.totals.fiber.toFixed(1)}</Text>
        </View>
      ))}
      {!entries.length && <Text style={styles.empty}>No meals logged today.</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 16, paddingBottom: 30 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 12, color: '#111827' },
  totalCard: { backgroundColor: '#111827', borderRadius: 12, padding: 12, marginBottom: 12 },
  totalTxt: { color: '#fff', fontWeight: '600', marginBottom: 2 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  meal: { fontWeight: '800', fontSize: 16, color: '#111827' },
  remove: { color: '#dc2626', fontWeight: '700' },
  item: { color: '#374151', marginTop: 4 },
  meta: { marginTop: 6, color: '#111827', fontWeight: '700' },
  empty: { color: '#6b7280', textAlign: 'center', marginTop: 20 },
});
