import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../storage/AppContext';

const mealNames = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

export default function DietTemplateScreen() {
  const { foods, template, setTemplate, logTemplateMeal } = useApp();
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [editingItems, setEditingItems] = useState([]);

  const foodMap = useMemo(() => Object.fromEntries(foods.map((f) => [f.id, f])), [foods]);

  const openEdit = (mealName) => {
    setSelectedMeal(mealName);
    setEditingItems(template[mealName] || []);
  };

  const saveTemplate = async () => {
    const next = { ...template, [selectedMeal]: editingItems };
    await setTemplate(next);
    setSelectedMeal(null);
  };

  const addFoodToMeal = () => {
    if (!foods.length) return;
    setEditingItems((prev) => [...prev, { foodId: foods[0].id, quantity: 1 }]);
  };

  const quickTick = async (mealName) => {
    await logTemplateMeal(mealName);
    Alert.alert('Logged', `${mealName} added to today.`);
  };

  const confirmTickWithEdit = async () => {
    await logTemplateMeal(selectedMeal, editingItems);
    setSelectedMeal(null);
    Alert.alert('Logged', `${selectedMeal} added with custom quantities.`);
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Base Diet Template</Text>
        {mealNames.map((meal) => (
          <View key={meal} style={styles.card}>
            <Text style={styles.meal}>{meal}</Text>
            {(template[meal] || []).length === 0 ? (
              <Text style={styles.empty}>No foods added</Text>
            ) : (
              (template[meal] || []).map((item, idx) => (
                <Text key={`${item.foodId}-${idx}`} style={styles.foodItem}>
                  • {foodMap[item.foodId]?.name || 'Unknown'} x {item.quantity}
                </Text>
              ))
            )}
            <View style={styles.row}>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => quickTick(meal)}>
                <Text style={styles.primaryTxt}>Tick Meal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => openEdit(meal)}>
                <Text style={styles.secondaryTxt}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={!!selectedMeal} animationType="slide" transparent>
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{selectedMeal} - Edit Quantities</Text>
            <ScrollView style={{ maxHeight: 280 }}>
              {editingItems.map((item, idx) => (
                <View key={`${idx}`} style={styles.editRow}>
                  <Text style={styles.foodName}>{foodMap[item.foodId]?.name || 'Food'}</Text>
                  <TextInput
                    style={styles.qtyInput}
                    keyboardType="decimal-pad"
                    value={String(item.quantity)}
                    onChangeText={(v) => {
                      const copy = [...editingItems];
                      copy[idx] = { ...copy[idx], quantity: Number(v || 0) };
                      setEditingItems(copy);
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setEditingItems((prev) => prev.filter((_, i) => i !== idx))}
                    style={styles.removeBtn}
                  >
                    <Text style={styles.removeTxt}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.addBtn} onPress={addFoodToMeal}>
              <Text style={styles.addTxt}>+ Add Food</Text>
            </TouchableOpacity>

            <View style={styles.row}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={saveTemplate}>
                <Text style={styles.secondaryTxt}>Save Template</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryBtn} onPress={confirmTickWithEdit}>
                <Text style={styles.primaryTxt}>Confirm + Tick</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setSelectedMeal(null)}>
              <Text style={styles.cancel}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 16, paddingBottom: 30 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 12, color: '#111827' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12 },
  meal: { fontSize: 18, fontWeight: '800', marginBottom: 8, color: '#111827' },
  empty: { color: '#6b7280' },
  foodItem: { color: '#374151', marginBottom: 4 },
  row: { flexDirection: 'row', gap: 8, marginTop: 10 },
  primaryBtn: { flex: 1, backgroundColor: '#111827', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  primaryTxt: { color: '#fff', fontWeight: '700' },
  secondaryBtn: { flex: 1, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  secondaryTxt: { color: '#111827', fontWeight: '700' },
  modalWrap: { flex: 1, backgroundColor: 'rgba(17,24,39,0.4)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  editRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  foodName: { flex: 1, color: '#111827' },
  qtyInput: { width: 70, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 8, textAlign: 'center' },
  removeBtn: { padding: 8 },
  removeTxt: { color: '#dc2626', fontWeight: '800' },
  addBtn: { backgroundColor: '#e0e7ff', borderRadius: 10, paddingVertical: 10, alignItems: 'center', marginTop: 6 },
  addTxt: { color: '#3730a3', fontWeight: '700' },
  cancel: { textAlign: 'center', marginTop: 10, color: '#6b7280', fontWeight: '600' },
});
