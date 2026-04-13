import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MacroProgress from '../components/MacroProgress';
import QuickWaterButtons from '../components/QuickWaterButtons';
import { useApp } from '../storage/AppContext';

export default function DashboardScreen({ navigation }) {
  const { profile, setProfile, consumed, today, addWater } = useApp();
  if (!profile) return null;

  const targets = profile.targets;
  const water = today?.waterMl || 0;
  const waterTarget = profile.waterGoalMl || 3000;

  const setDayType = async (type) => {
    await setProfile({ ...profile, dayType: type, targets: profile.zigzag[type] });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Today</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Zigzag Calories</Text>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.dayBtn, profile.dayType === 'low' && styles.dayBtnActive]} onPress={() => setDayType('low')}>
            <Text style={profile.dayType === 'low' ? styles.dayTxtActive : styles.dayTxt}>Low ({profile.zigzag.low.calories})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dayBtn, profile.dayType === 'high' && styles.dayBtnActive]} onPress={() => setDayType('high')}>
            <Text style={profile.dayType === 'high' ? styles.dayTxtActive : styles.dayTxt}>High ({profile.zigzag.high.calories})</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Calories</Text>
        <Text style={styles.calories}>{consumed.calories.toFixed(0)} / {targets.calories}</Text>
        <MacroProgress label="Protein (g)" consumed={consumed.protein} target={targets.protein} color="#ef4444" />
        <MacroProgress label="Carbs (g)" consumed={consumed.carbs} target={targets.carbs} color="#3b82f6" />
        <MacroProgress label="Fat (g)" consumed={consumed.fat} target={targets.fat} color="#f59e0b" />
        <MacroProgress label="Fiber (g)" consumed={consumed.fiber} target={targets.fiber} color="#10b981" />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Water Intake</Text>
        <Text style={styles.calories}>{water} / {waterTarget} ml</Text>
        <MacroProgress label="Hydration" consumed={water} target={waterTarget} color="#06b6d4" />
        <QuickWaterButtons onAdd={addWater} />
      </View>

      <View style={styles.quickRow}>
        <TouchableOpacity style={styles.quickBtn} onPress={() => navigation.navigate('Diet Template')}>
          <Text style={styles.quickTxt}>Log Meal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickBtn} onPress={() => addWater(200)}>
          <Text style={styles.quickTxt}>Add Water</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickBtn} onPress={() => navigation.navigate('Supplements')}>
          <Text style={styles.quickTxt}>Supplements</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  content: { padding: 16, paddingBottom: 30 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 12, color: '#111827' },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 12 },
  cardTitle: { fontWeight: '800', fontSize: 16, marginBottom: 10, color: '#111827' },
  calories: { fontSize: 22, fontWeight: '800', marginBottom: 10, color: '#111827' },
  row: { flexDirection: 'row', gap: 8 },
  dayBtn: { flex: 1, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  dayBtnActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  dayTxt: { color: '#111827', fontWeight: '700' },
  dayTxtActive: { color: '#fff', fontWeight: '800' },
  quickRow: { flexDirection: 'row', gap: 8 },
  quickBtn: { flex: 1, backgroundColor: '#111827', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  quickTxt: { color: '#fff', fontWeight: '700' },
});
