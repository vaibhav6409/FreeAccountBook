import React from 'react';
import { View, Button, Text } from 'react-native';
import { getDB } from '../db/database';

export default function CurrencyScreen({ onDone }) {
  const saveCurrency = async (currency) => {
    const db = await getDB();

    await db.executeSql(
      'INSERT OR REPLACE INTO settings (id, currency) VALUES (1, ?)',
      [currency]
    );

    onDone();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Select Currency</Text>
      <Button title="₹ INR" onPress={() => saveCurrency('₹')} />
      <Button title="$ USD" onPress={() => saveCurrency('$')} />
      <Button title="€ EUR" onPress={() => saveCurrency('€')} />
    </View>
  );
}
