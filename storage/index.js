import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './keys';

export const saveItem = async (key, value) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const getItem = async (key, fallback) => {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
};

export const storage = {
  getProfile: () => getItem(STORAGE_KEYS.profile, null),
  setProfile: (v) => saveItem(STORAGE_KEYS.profile, v),
  getFoods: () => getItem(STORAGE_KEYS.foods, []),
  setFoods: (v) => saveItem(STORAGE_KEYS.foods, v),
  getTemplate: () => getItem(STORAGE_KEYS.template, null),
  setTemplate: (v) => saveItem(STORAGE_KEYS.template, v),
  getLogs: () => getItem(STORAGE_KEYS.logs, {}),
  setLogs: (v) => saveItem(STORAGE_KEYS.logs, v),
  getSupplements: () => getItem(STORAGE_KEYS.supplements, []),
  setSupplements: (v) => saveItem(STORAGE_KEYS.supplements, v),
};
