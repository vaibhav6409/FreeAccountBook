import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../components/AppHeader';
import { getDB } from '../db/database';
import { COLORS } from '../theme/colors';

const OPTIONS = [
  {
    label: 'Income / Expense',
    desc: 'Use Income and Expense terms',
    value: 'IE',
    icon: 'arrow-up-down',
  },
  {
    label: 'Credit / Debit',
    desc: 'Use Credit and Debit terms',
    value: 'CD',
    icon: 'swap-horizontal',
  },
];

export default function AmountLabelScreen({ navigation }) {
  const [selected, setSelected] = useState('IE');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const db = await getDB();
    const res = await db.executeSql(
      `SELECT amount_labels FROM settings WHERE id=1`,
    );
    if (res[0].rows.length) {
      setSelected(res[0].rows.item(0).amount_labels);
    }
  };

  const update = async value => {
    const db = await getDB();
    await db.executeSql(`UPDATE settings SET amount_labels=? WHERE id=1`, [
      value,
    ]);
    setSelected(value);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Amount Labels" showBack />

      <View style={styles.card}>
        {OPTIONS.map((o, index) => {
          const active = selected === o.value;

          return (
            <TouchableOpacity
              key={o.value}
              onPress={() => update(o.value)}
              style={[
                styles.row,
                active && styles.activeRow,
                {
                  borderTopWidth: index == 0 ? 0 : 1,
                  borderTopColor: COLORS.border,
                },
              ]}
            >
              <View
                style={[
                  styles.iconWrap,
                  active && { backgroundColor: COLORS.primarySoft },
                ]}
              >
                <Icon
                  name={o.icon}
                  size={22}
                  color={active ? COLORS.primary : COLORS.muted}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.label}>{o.label}</Text>
                <Text style={styles.desc}>{o.desc}</Text>
              </View>

              {active && (
                <Icon name="check-circle" size={22} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
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
    margin: 16,
    paddingVertical: 6,
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  activeRow: {
    backgroundColor: COLORS.primarySoft + '55',
  },

  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },

  desc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
