import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

const TABS = [
  { label: 'Monthly', value: 'MONTHLY' },
  { label: 'All Time', value: 'ALL' },
  { label: 'Yearly', value: 'YEARLY' },
];

export default function ReportTabs({ mode, onChange }) {
  return (
    <View style={styles.container}>
      {TABS.map(t => {
        const active = mode === t.value;
        return (
          <TouchableOpacity
            key={t.value}
            onPress={() => onChange(t.value)}
            style={[styles.tab, active && styles.active]}
          >
            <Text style={[styles.text, active && styles.activeText]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderColor: COLORS.primarySoft,
    borderWidth: 1,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  active: {
    backgroundColor: COLORS.primarySoft,
  },
  text: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  activeText: {
    color: COLORS.primary,
  },
});
