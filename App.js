import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { initDB, getDB } from './src/db/database';
import CurrencyScreen from './src/screens/CurrencyScreen';
import AccountStack from './src/navigation/AccountStack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';

const RootStack = createNativeStackNavigator();

export default function App() {
  const [ready, setReady] = useState(false);
  const [hasCurrency, setHasCurrency] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initDB();
      const db = await getDB();
      const res = await db.executeSql('SELECT * FROM settings LIMIT 1');
      setHasCurrency(res[0].rows.length > 0);
      setReady(true);
    };
    init();
  }, []);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#3478f6" />
      <SafeAreaProvider>
        <NavigationContainer>
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            {!hasCurrency ? (
              <RootStack.Screen name="Currency">
                {props => (
                  <CurrencyScreen
                    {...props}
                    onDone={() => setHasCurrency(true)}
                  />
                )}
              </RootStack.Screen>
            ) : (
              <RootStack.Screen name="AccountStack" component={AccountStack} />
            )}
          </RootStack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </SafeAreaProvider>
  );
}
