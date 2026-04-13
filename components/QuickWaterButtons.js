import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function QuickWaterButtons({ onAdd }) {
  const amounts = [100, 200, 500];
  return (
    <View style={styles.row}>
      {amounts.map((amount) => (
        <TouchableOpacity key={amount} style={styles.btn} onPress={() => onAdd(amount)}>
          <Text style={styles.txt}>+{amount}ml</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, marginTop: 6 },
  btn: {
    flex: 1,
    backgroundColor: '#dbeafe',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  txt: { fontWeight: '700', color: '#1e40af' },
});
