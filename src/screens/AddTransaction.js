import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { getDB } from '../db/database';

export default function AddTransaction({ route, navigation }) {
  const { accountId } = route.params;
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('CR');
  const [note, setNote] = useState('');

  const saveTxn = async () => {
    const db = await getDB();
    await db.executeSql(
      `INSERT INTO transactions 
       (account_id, amount, type, date, note) 
       VALUES (?, ?, ?, ?, ?)`,
      [accountId, amount, type, new Date().toISOString(), note]
    );
    navigation.goBack();
  };

  return (
    <View>
      <TextInput placeholder="Amount" keyboardType="numeric" onChangeText={setAmount} />
      <TextInput placeholder="Note" onChangeText={setNote} />
      <Button title="Save" onPress={saveTxn} />
    </View>
  );
}
