import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { getDB } from '../db/database';
import AppHeader from '../components/AppHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../theme/colors';

const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
];

export default function CurrencyChangeScreen({ navigation }) {
  const [selected, setSelected] = useState('INR');

  useEffect(() => {
    loadCurrent();
  }, []);

  const loadCurrent = async () => {
    const db = await getDB();
    const res = await db.executeSql(
      'SELECT currency_code FROM settings WHERE id=1',
    );
    if (res[0].rows.length > 0) {
      setSelected(res[0].rows.item(0).currency_code);
    }
  };

  const changeCurrency = async item => {
    const db = await getDB();

    await db.executeSql(
      `UPDATE settings
       SET currency_code=?, currency_symbol=?
       WHERE id=1`,
      [item.code, item.symbol],
    );

    setSelected(item.code);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Change Currency" showBack />

      <FlatList
        data={CURRENCIES}
        keyExtractor={i => i.code}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const active = selected === item.code;

          return (
            <TouchableOpacity
              style={[styles.card, active && styles.activeCard]}
              onPress={() => changeCurrency(item)}
            >
              <View style={styles.left}>
                <View style={styles.symbolCircle}>
                  <Text style={styles.symbol}>{item.symbol}</Text>
                </View>

                <View>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.code}>{item.code}</Text>
                </View>
              </View>

              {active && (
                <Icon name="check-circle" size={22} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 0,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },

  activeCard: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  symbolCircle: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  symbol: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
  },

  name: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },

  code: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
});
