import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AccountList from '../screens/AccountList';
import AddAccount from '../screens/AddAccount';
import LedgerScreen from '../screens/LedgerScreen';
import AddTransaction from '../screens/AddTransaction';
import CategoriesScreen from '../screens/CategoriesScreen';

const Stack = createNativeStackNavigator();

export default function AccountStack() {
  return (
    <Stack.Navigator>
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
    </Stack.Navigator>
  );
}
