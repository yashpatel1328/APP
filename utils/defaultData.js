export const defaultFoods = [
  { id: 'food-rice', name: 'Rice (100g)', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, micros: 'Manganese' },
  { id: 'food-chicken', name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, micros: 'Niacin, Selenium' },
  { id: 'food-eggs', name: 'Eggs (1 large)', calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8, fiber: 0, micros: 'Vitamin B12, Choline' },
  { id: 'food-milk', name: 'Milk (250ml)', calories: 122, protein: 8, carbs: 12, fat: 5, fiber: 0, micros: 'Calcium, Vitamin D' },
  { id: 'food-ketchup', name: 'Ketchup (1 tbsp)', calories: 19, protein: 0.2, carbs: 4.5, fat: 0, fiber: 0.1, micros: 'Lycopene' },
  { id: 'food-soy-sauce', name: 'Soy Sauce (1 tbsp)', calories: 10, protein: 1, carbs: 1, fat: 0, fiber: 0, micros: 'Sodium' },
  { id: 'food-olive-oil', name: 'Olive Oil (1 tbsp)', calories: 119, protein: 0, carbs: 0, fat: 13.5, fiber: 0, micros: 'Vitamin E' },
];

export const defaultTemplate = {
  Breakfast: [
    { foodId: 'food-eggs', quantity: 2 },
    { foodId: 'food-milk', quantity: 1 },
  ],
  Lunch: [
    { foodId: 'food-rice', quantity: 2 },
    { foodId: 'food-chicken', quantity: 2 },
  ],
  Dinner: [
    { foodId: 'food-rice', quantity: 1.5 },
    { foodId: 'food-chicken', quantity: 2 },
    { foodId: 'food-ketchup', quantity: 1 },
  ],
  Snacks: [{ foodId: 'food-eggs', quantity: 1 }],
};
