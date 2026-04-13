const activityMap = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export const getTDEE = ({ age, gender, heightCm, weightKg, activityLevel }) => {
  const bmr =
    gender === 'male'
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  return Math.round(bmr * (activityMap[activityLevel] || 1.2));
};

export const getCalorieTargetForGoal = (tdee, goal) => {
  if (goal === 'fat_loss') return Math.round(tdee - 350);
  if (goal === 'muscle_gain') return Math.round(tdee + 250);
  return tdee;
};

export const getMacroTargets = ({ calories, weightKg }) => {
  const protein = Math.round(weightKg * 2);
  const fat = Math.round((calories * 0.25) / 9);
  const proteinCalories = protein * 4;
  const fatCalories = fat * 9;
  const carbs = Math.max(0, Math.round((calories - proteinCalories - fatCalories) / 4));
  const fiber = Math.max(25, Math.round(calories / 1000) * 14);

  return { calories, protein, carbs, fat, fiber };
};

export const getZigZagTargets = ({ baseCalories, weightKg }) => {
  const low = Math.max(1200, baseCalories - 150);
  const high = baseCalories + 150;
  return {
    low: getMacroTargets({ calories: low, weightKg }),
    high: getMacroTargets({ calories: high, weightKg }),
  };
};
