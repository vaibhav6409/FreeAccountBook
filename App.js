import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { initDB, getDB } from './src/db/database';
import CurrencyScreen from './src/screens/CurrencyScreen';
import AccountStack from './src/navigation/AccountStack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { migrateSettingsTable } from './src/db/migrations';
import { COLORS } from './src/theme/colors';
import SplashScreen from './src/screens/SplashScreen';

const RootStack = createNativeStackNavigator();

export default function App() {
  const [ready, setReady] = useState(false);
  const [hasCurrency, setHasCurrency] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const init = async () => {
      await initDB();
      await migrateSettingsTable(); // 🔥 ADD THIS
      const db = await getDB();
      const res = await db.executeSql(
        'SELECT currency_code FROM settings WHERE id=1',
      );
      if (res[0].rows.length > 0) {
        const row = res[0].rows.item(0);
        setHasCurrency(!!row.currency_code);
        setReady(true);
      } else {
        setHasCurrency(false);
        setReady(true);
      }
    };
    init();
  }, []);

  // if (!ready) {
  //   return (
  //     <SafeAreaProvider>
  //       <StatusBar
  //         barStyle="dark-content"
  //         backgroundColor={COLORS.background}
  //       />
  //       <View
  //         style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
  //       >
  //         <ActivityIndicator size="large" />
  //       </View>
  //     </SafeAreaProvider>
  //   );
  // }

  if (!ready || showSplash) {
  return (
    <SplashScreen onFinish={() => setShowSplash(false)} />
  );
}

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
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
  );
}
