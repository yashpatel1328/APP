import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useApp } from '../storage/AppContext';

export default function SupplementsScreen() {
  const { supplements, setSupplements, today, toggleSupplementTaken } = useApp();
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');

  const taken = new Set(today?.supplementLog || []);

  const addSupplement = async () => {
    if (!name.trim()) return;
    const next = [{ id: `supp-${Date.now()}`, name: name.trim(), dosage: dosage.trim() || '-' }, ...supplements];
    await setSupplements(next);
    setName('');
    setDosage('');
  };

  const removeSupplement = async (id) => {
    await setSupplements(supplements.filter((s) => s.id !== id));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Supplements</Text>

      <View style={styles.addCard}>
        <TextInput style={styles.input} placeholder="Supplement name (e.g., Vitamin D3)" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Dosage (e.g., 2000 IU)" value={dosage} onChangeText={setDosage} />
        <TouchableOpacity style={styles.addBtn} onPress={addSupplement}>
          <Text style={styles.addTxt}>Add Supplement</Text>
        </TouchableOpacity>
      </View>

      {supplements.map((supp) => (
        <View key={supp.id} style={styles.card}>
          <Text style={styles.name}>{supp.name}</Text>
          <Text style={styles.dose}>Dosage: {supp.dosage}</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.takeBtn, taken.has(supp.id) && styles.takeBtnDone]}
              onPress={() => toggleSupplementTaken(supp.id)}
            >
              <Text style={taken.has(supp.id) ? styles.takeTxtDone : styles.takeTxt}>{taken.has(supp.id) ? 'Taken' : 'Mark Taken'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.removeBtn} onPress={() => removeSupplement(supp.id)}>
              <Text style={styles.removeTxt}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 16, paddingBottom: 30 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 12, color: '#111827' },
  addCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 10, marginBottom: 8 },
  addBtn: { backgroundColor: '#111827', borderRadius: 10, paddingVertical: 11, alignItems: 'center' },
  addTxt: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10 },
  name: { fontSize: 16, fontWeight: '800', color: '#111827' },
  dose: { marginTop: 4, color: '#374151' },
  row: { flexDirection: 'row', gap: 8, marginTop: 10 },
  takeBtn: { flex: 1, backgroundColor: '#dcfce7', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  takeBtnDone: { backgroundColor: '#bbf7d0' },
  takeTxt: { color: '#166534', fontWeight: '700' },
  takeTxtDone: { color: '#14532d', fontWeight: '800' },
  removeBtn: { flex: 1, backgroundColor: '#fee2e2', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  removeTxt: { color: '#991b1b', fontWeight: '700' },
});
