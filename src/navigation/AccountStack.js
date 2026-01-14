import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AccountList from '../screens/AccountList';
import LedgerScreen from '../screens/LedgerScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CurrencyChangeScreen from '../screens/CurrencyChangeScreen';

const Stack = createNativeStackNavigator();

export default function AccountStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AccountList" component={AccountList} />
      <Stack.Screen name="Ledger" component={LedgerScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Currency" component={CurrencyChangeScreen} />
    </Stack.Navigator>
  );
}
