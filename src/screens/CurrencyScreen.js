import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getDB } from '../db/database';
import { COLORS } from '../theme/colors';

const currencies = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
];

export default function CurrencyScreen({ onDone }) {
  const saveCurrency = async currency => {
    const db = await getDB();

    await db.executeSql(
      `INSERT OR REPLACE INTO settings
       (id, currency_code, currency_symbol)
       VALUES (1, ?, ?)`,
      [currency.code, currency.symbol],
    );

    onDone();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your currency</Text>
      <Text style={styles.subtitle}>This will be used across the app</Text>

      {currencies.map(item => (
        <TouchableOpacity
          key={item.code}
          style={styles.card}
          onPress={() => saveCurrency(item)}
        >
          <View style={styles.icon}>
            <Text style={styles.symbol}>{item.symbol}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.code}>{item.code}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 24,
    justifyContent: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 24,
  },

  card: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  icon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  symbol: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
  },

  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },

  code: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
});
