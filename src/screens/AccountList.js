import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { getDB } from '../db/database';

export default function AccountList({ navigation }) {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    const db = await getDB();
    const res = await db.executeSql(`
      SELECT a.id, a.name,
        IFNULL(SUM(CASE WHEN t.type='CR' THEN t.amount END),0) as income,
        IFNULL(SUM(CASE WHEN t.type='DR' THEN t.amount END),0) as expense
      FROM accounts a
      LEFT JOIN transactions t ON t.account_id = a.id
      GROUP BY a.id
    `);

    const rows = [];
    for (let i = 0; i < res[0].rows.length; i++) {
      rows.push(res[0].rows.item(i));
    }
    setAccounts(rows);
  };

  const renderItem = ({ item }) => {
    const balance = item.income - item.expense;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('Ledger', { accountId: item.id, name: item.name })
        }
      >
        <Text style={styles.title}>{item.name}</Text>

        <View style={styles.row}>
          <View>
            <Text style={styles.balance}>₹ {balance.toFixed(2)}</Text>
            <Text style={styles.label}>Balance</Text>
          </View>

          <View>
            <Text style={styles.income}>₹ {item.income}</Text>
            <Text style={styles.expense}>₹ {item.expense}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={accounts}
        keyExtractor={(i) => i.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddAccount')}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  balance: { color: 'green', fontSize: 22, fontWeight: '700' },
  label: { color: '#777' },
  income: { color: 'green', fontSize: 16 },
  expense: { color: 'red', fontSize: 16 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#3478f6',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: { color: '#fff', fontSize: 32 },
});
