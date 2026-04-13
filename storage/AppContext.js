import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { storage } from './index';
import { defaultFoods, defaultTemplate } from '../utils/defaultData';
import { getTodayKey } from '../utils/date';

const AppContext = createContext(null);

const addNumbers = (a, b) => Number((a + b).toFixed(2));

const multiplyFood = (food, qty) => ({
  calories: addNumbers(0, food.calories * qty),
  protein: addNumbers(0, food.protein * qty),
  carbs: addNumbers(0, food.carbs * qty),
  fat: addNumbers(0, food.fat * qty),
  fiber: addNumbers(0, food.fiber * qty),
});

export function AppProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfileState] = useState(null);
  const [foods, setFoodsState] = useState([]);
  const [template, setTemplateState] = useState(defaultTemplate);
  const [logs, setLogsState] = useState({});
  const [supplements, setSupplementsState] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [p, f, t, l, s] = await Promise.all([
        storage.getProfile(),
        storage.getFoods(),
        storage.getTemplate(),
        storage.getLogs(),
        storage.getSupplements(),
      ]);
      setProfileState(p);
      setFoodsState(f.length ? f : defaultFoods);
      setTemplateState(t || defaultTemplate);
      setLogsState(l || {});
      setSupplementsState(s || []);
      setLoading(false);
    };
    load();
  }, []);

  const setProfile = async (next) => {
    setProfileState(next);
    await storage.setProfile(next);
  };

  const setFoods = async (next) => {
    setFoodsState(next);
    await storage.setFoods(next);
  };

  const setTemplate = async (next) => {
    setTemplateState(next);
    await storage.setTemplate(next);
  };

  const setLogs = async (next) => {
    setLogsState(next);
    await storage.setLogs(next);
  };

  const setSupplements = async (next) => {
    setSupplementsState(next);
    await storage.setSupplements(next);
  };

  const ensureToday = (inputLogs = logs) => {
    const key = getTodayKey();
    if (inputLogs[key]) return { key, day: inputLogs[key], allLogs: inputLogs };
    const day = { entries: [], waterMl: 0, supplementLog: [] };
    return { key, day, allLogs: { ...inputLogs, [key]: day } };
  };

  const getFoodById = (id) => foods.find((f) => f.id === id);

  const logTemplateMeal = async (mealName, overrideItems) => {
    const mealItems = overrideItems || template[mealName] || [];
    const resolvedItems = mealItems
      .map((item) => {
        const food = getFoodById(item.foodId);
        if (!food) return null;
        const qty = Number(item.quantity) || 1;
        return { foodId: food.id, name: food.name, quantity: qty, macros: multiplyFood(food, qty) };
      })
      .filter(Boolean);

    const totals = resolvedItems.reduce(
      (acc, i) => ({
        calories: addNumbers(acc.calories, i.macros.calories),
        protein: addNumbers(acc.protein, i.macros.protein),
        carbs: addNumbers(acc.carbs, i.macros.carbs),
        fat: addNumbers(acc.fat, i.macros.fat),
        fiber: addNumbers(acc.fiber, i.macros.fiber),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
    );

    const { key, day, allLogs } = ensureToday();
    const nextDay = {
      ...day,
      entries: [
        ...day.entries,
        { id: `${Date.now()}`, mealName, items: resolvedItems, totals, createdAt: new Date().toISOString() },
      ],
    };
    const nextLogs = { ...allLogs, [key]: nextDay };
    await setLogs(nextLogs);
  };

  const addWater = async (amount) => {
    const { key, day, allLogs } = ensureToday();
    const nextLogs = { ...allLogs, [key]: { ...day, waterMl: (day.waterMl || 0) + amount } };
    await setLogs(nextLogs);
  };

  const removeEntry = async (entryId) => {
    const { key, day, allLogs } = ensureToday();
    const nextDay = { ...day, entries: day.entries.filter((e) => e.id !== entryId) };
    await setLogs({ ...allLogs, [key]: nextDay });
  };

  const toggleSupplementTaken = async (supplementId) => {
    const { key, day, allLogs } = ensureToday();
    const set = new Set(day.supplementLog || []);
    if (set.has(supplementId)) set.delete(supplementId);
    else set.add(supplementId);
    const nextDay = { ...day, supplementLog: Array.from(set) };
    await setLogs({ ...allLogs, [key]: nextDay });
  };

  const today = useMemo(() => ensureToday().allLogs[getTodayKey()], [logs]);

  const consumed = useMemo(
    () =>
      (today?.entries || []).reduce(
        (acc, e) => ({
          calories: addNumbers(acc.calories, e.totals.calories),
          protein: addNumbers(acc.protein, e.totals.protein),
          carbs: addNumbers(acc.carbs, e.totals.carbs),
          fat: addNumbers(acc.fat, e.totals.fat),
          fiber: addNumbers(acc.fiber, e.totals.fiber),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
      ),
    [today]
  );

  const value = {
    loading,
    profile,
    setProfile,
    foods,
    setFoods,
    template,
    setTemplate,
    logs,
    today,
    consumed,
    logTemplateMeal,
    addWater,
    removeEntry,
    supplements,
    setSupplements,
    toggleSupplementTaken,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
