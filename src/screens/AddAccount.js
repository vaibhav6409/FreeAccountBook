import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { getDB } from '../db/database';

export default function AddAccount({ navigation }) {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');

  const saveAccount = async () => {
    const db = await getDB();
    await db.executeSql(
      'INSERT INTO accounts (name, opening_balance, created_at) VALUES (?, ?, ?)',
      [name, balance || 0, new Date().toISOString()]
    );
    navigation.goBack();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Account Name" onChangeText={setName} />
      <TextInput placeholder="Opening Balance" keyboardType="numeric" onChangeText={setBalance} />
      <Button title="Save" onPress={saveAccount} />
    </View>
  );
}
