import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './storage/AppContext';
import OnboardingScreen from './screens/OnboardingScreen';
import DashboardScreen from './screens/DashboardScreen';
import DietTemplateScreen from './screens/DietTemplateScreen';
import DailyLogScreen from './screens/DailyLogScreen';
import FoodLibraryScreen from './screens/FoodLibraryScreen';
import SupplementsScreen from './screens/SupplementsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Diet Template" component={DietTemplateScreen} />
      <Tab.Screen name="Daily Log" component={DailyLogScreen} />
      <Tab.Screen name="Food Library" component={FoodLibraryScreen} />
      <Tab.Screen name="Supplements" component={SupplementsScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { loading, profile } = useApp();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!profile ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
}
