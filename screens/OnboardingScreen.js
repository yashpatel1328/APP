import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useApp } from '../storage/AppContext';
import { getTDEE, getCalorieTargetForGoal, getMacroTargets, getZigZagTargets } from '../utils/calculations';

const activityOptions = [
  { label: 'Sedentary', value: 'sedentary' },
  { label: 'Light', value: 'light' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'Active', value: 'active' },
  { label: 'Very Active', value: 'very_active' },
];

const goals = [
  { label: 'Fat Loss', value: 'fat_loss' },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Muscle Gain', value: 'muscle_gain' },
];

export default function OnboardingScreen() {
  const { setProfile } = useApp();
  const [form, setForm] = useState({
    age: '28',
    gender: 'male',
    heightCm: '175',
    weightKg: '75',
    activityLevel: 'moderate',
    goal: 'maintenance',
    waterGoalMl: '3000',
  });

  const save = async () => {
    const payload = {
      age: Number(form.age),
      gender: form.gender,
      heightCm: Number(form.heightCm),
      weightKg: Number(form.weightKg),
      activityLevel: form.activityLevel,
      goal: form.goal,
      waterGoalMl: Number(form.waterGoalMl),
      dayType: 'low',
    };
    const tdee = getTDEE(payload);
    const baseCalories = getCalorieTargetForGoal(tdee, payload.goal);
    const zigzag = getZigZagTargets({ baseCalories, weightKg: payload.weightKg });

    await setProfile({
      ...payload,
      tdee,
      zigzag,
      targets: zigzag.low,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Set Up Your Profile</Text>

      {[
        ['Age', 'age'],
        ['Height (cm)', 'heightCm'],
        ['Weight (kg)', 'weightKg'],
        ['Water Goal (ml)', 'waterGoalMl'],
      ].map(([label, key]) => (
        <View key={key} style={styles.field}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={form[key]}
            onChangeText={(v) => setForm((p) => ({ ...p, [key]: v }))}
          />
        </View>
      ))}

      <Text style={styles.label}>Gender</Text>
      <View style={styles.row}>
        {['male', 'female'].map((g) => (
          <TouchableOpacity
            key={g}
            style={[styles.chip, form.gender === g && styles.chipActive]}
            onPress={() => setForm((p) => ({ ...p, gender: g }))}
          >
            <Text style={form.gender === g ? styles.chipTextActive : styles.chipText}>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Activity Level</Text>
      <View style={styles.wrapRow}>
        {activityOptions.map((a) => (
          <TouchableOpacity
            key={a.value}
            style={[styles.chip, form.activityLevel === a.value && styles.chipActive]}
            onPress={() => setForm((p) => ({ ...p, activityLevel: a.value }))}
          >
            <Text style={form.activityLevel === a.value ? styles.chipTextActive : styles.chipText}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Goal</Text>
      <View style={styles.wrapRow}>
        {goals.map((g) => (
          <TouchableOpacity
            key={g.value}
            style={[styles.chip, form.goal === g.value && styles.chipActive]}
            onPress={() => setForm((p) => ({ ...p, goal: g.value }))}
          >
            <Text style={form.goal === g.value ? styles.chipTextActive : styles.chipText}>{g.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={save}>
        <Text style={styles.saveTxt}>Start Tracking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 16, color: '#111827' },
  field: { marginBottom: 10 },
  label: { fontSize: 14, color: '#374151', marginBottom: 6, fontWeight: '600' },
  input: { backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  row: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#fff' },
  chipActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  chipText: { color: '#374151', fontWeight: '600' },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  saveBtn: { marginTop: 14, backgroundColor: '#111827', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  saveTxt: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
