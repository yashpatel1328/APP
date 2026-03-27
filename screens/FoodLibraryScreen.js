import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useApp } from '../storage/AppContext';

const emptyForm = {
  name: '', calories: '', protein: '', carbs: '', fat: '', fiber: '', micros: '',
};

export default function FoodLibraryScreen() {
  const { foods, setFoods } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (food) => {
    setEditingId(food.id);
    setForm(Object.fromEntries(Object.entries(food).map(([k, v]) => [k, String(v)])));
    setModalOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) return Alert.alert('Name required');
    const payload = {
      id: editingId || `food-${Date.now()}`,
      name: form.name,
      calories: Number(form.calories || 0),
      protein: Number(form.protein || 0),
      carbs: Number(form.carbs || 0),
      fat: Number(form.fat || 0),
      fiber: Number(form.fiber || 0),
      micros: form.micros || '',
    };
    const next = editingId ? foods.map((f) => (f.id === editingId ? payload : f)) : [payload, ...foods];
    await setFoods(next);
    setModalOpen(false);
  };

  const remove = async (id) => {
    await setFoods(foods.filter((f) => f.id !== id));
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title}>Food Library</Text>
          <TouchableOpacity style={styles.addTopBtn} onPress={openCreate}>
            <Text style={styles.addTopTxt}>+ Add Food</Text>
          </TouchableOpacity>
        </View>

        {foods.map((food) => (
          <View key={food.id} style={styles.card}>
            <Text style={styles.name}>{food.name}</Text>
            <Text style={styles.meta}>Cals {food.calories} | P {food.protein} | C {food.carbs} | F {food.fat} | Fi {food.fiber}</Text>
            {!!food.micros && <Text style={styles.micros}>Micros: {food.micros}</Text>}
            <View style={styles.row}>
              <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(food)}>
                <Text style={styles.editTxt}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.delBtn} onPress={() => remove(food.id)}>
                <Text style={styles.delTxt}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={modalOpen} transparent animationType="slide">
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingId ? 'Edit Food' : 'Add Food'}</Text>
            {[
              ['Name', 'name', 'default'],
              ['Calories', 'calories', 'decimal-pad'],
              ['Protein', 'protein', 'decimal-pad'],
              ['Carbs', 'carbs', 'decimal-pad'],
              ['Fat', 'fat', 'decimal-pad'],
              ['Fiber', 'fiber', 'decimal-pad'],
              ['Micronutrients', 'micros', 'default'],
            ].map(([label, key, keyboardType]) => (
              <TextInput
                key={key}
                style={styles.input}
                placeholder={label}
                keyboardType={keyboardType}
                value={form[key]}
                onChangeText={(v) => setForm((p) => ({ ...p, [key]: v }))}
              />
            ))}
            <View style={styles.row}>
              <TouchableOpacity style={styles.editBtn} onPress={() => setModalOpen(false)}>
                <Text style={styles.editTxt}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={save}>
                <Text style={styles.saveTxt}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 16, paddingBottom: 30 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827' },
  addTopBtn: { backgroundColor: '#111827', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12 },
  addTopTxt: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10 },
  name: { fontWeight: '800', fontSize: 16, color: '#111827' },
  meta: { color: '#374151', marginTop: 4 },
  micros: { color: '#6b7280', marginTop: 4 },
  row: { flexDirection: 'row', gap: 8, marginTop: 10 },
  editBtn: { flex: 1, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  editTxt: { fontWeight: '700', color: '#111827' },
  delBtn: { flex: 1, borderWidth: 1, borderColor: '#fecaca', borderRadius: 10, paddingVertical: 10, alignItems: 'center', backgroundColor: '#fef2f2' },
  delTxt: { fontWeight: '700', color: '#b91c1c' },
  modalWrap: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' },
  modalCard: { backgroundColor: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 10, marginBottom: 8 },
  saveBtn: { flex: 1, backgroundColor: '#111827', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  saveTxt: { color: '#fff', fontWeight: '700' },
});
