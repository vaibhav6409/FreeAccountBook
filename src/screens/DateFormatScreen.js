import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../components/AppHeader';
import { getDB } from '../db/database';
import { COLORS } from '../theme/colors';

const FORMATS = [
  { format: 'DD/MM/YYYY', label: 'Day / Month / Year' },
  { format: 'MM/DD/YYYY', label: 'Month / Day / Year' },
  { format: 'DD MMM YYYY', label: 'Day Month Year' },
  { format: 'MMM DD, YYYY', label: 'Month Day, Year' },
  { format: 'YYYY-MM-DD', label: 'ISO Format' },
];

export default function DateFormatScreen({ navigation }) {
  const [selected, setSelected] = useState('DD/MM/YYYY');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const db = await getDB();
    const res = await db.executeSql(
      `SELECT date_format FROM settings WHERE id=1`,
    );
    if (res[0].rows.length) {
      setSelected(res[0].rows.item(0).date_format);
    }
  };

  const update = async value => {
    const db = await getDB();
    await db.executeSql(`UPDATE settings SET date_format=? WHERE id=1`, [
      value,
    ]);
    setSelected(value);
    navigation.goBack();
  };

  const preview = format => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const mmm = d.toLocaleString('en-US', { month: 'short' });

    switch (format) {
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'DD MMM YYYY':
        return `${day} ${mmm} ${year}`;
      case 'MMM DD, YYYY':
        return `${mmm} ${day}, ${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Date Format" showBack />

      <View style={styles.card}>
        {FORMATS.map((item, index) => {
          const active = selected === item.format;

          return (
            <TouchableOpacity
              key={item.format}
              onPress={() => update(item.format)}
              style={[
                styles.row,
                active && styles.activeRow,
                {
                  borderTopWidth: index == 0 ? 0 : 1,
                  borderTopColor: COLORS.border,
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.format}>{item.format}</Text>
                <Text style={styles.preview}>
                  Example: {preview(item.format)}
                </Text>
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

  format: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },

  preview: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});
