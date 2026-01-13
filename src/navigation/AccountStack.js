import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AccountList from '../screens/AccountList';
import AddAccount from '../screens/AddAccount';
import LedgerScreen from '../screens/LedgerScreen';
import AddTransaction from '../screens/AddTransaction';
import CategoriesScreen from '../screens/CategoriesScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function AccountStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: '#3478f6',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="AccountList"
        component={AccountList}
        options={{ title: 'Accounts' }}
      />
      <Stack.Screen
        name="AddAccount"
        component={AddAccount}
        options={{ title: 'Add Account' }}
      />
      <Stack.Screen
        name="Ledger"
        component={LedgerScreen}
        options={{ title: 'Ledger' }}
      />
      <Stack.Screen
        name="AddTransaction"
        component={AddTransaction}
        options={{ title: 'Add Transaction' }}
      />
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ title: 'Categories' }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      {/* <Stack.Screen name="Currency" component={CurrencyScreen} /> */}
    </Stack.Navigator>
  );
}
