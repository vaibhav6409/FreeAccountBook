import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';

export default function ReportSummaryCard({ summary }) {
  return (
    <View style={styles.card}>
      <Text style={styles.balanceLabel}>Balance</Text>
      <Text style={styles.balance}>₹ {summary.balance.toFixed(2)}</Text>

      <View style={styles.row}>
        <View style={styles.box}>
          <View style={[styles.dot, { backgroundColor: COLORS.income }]} />
          <Text style={styles.label}>Income</Text>
          <Text style={styles.value}>₹ {summary.income.toFixed(2)}</Text>
        </View>

        <View style={styles.box}>
          <View style={[styles.dot, { backgroundColor: COLORS.expense }]} />
          <Text style={styles.label}>Expense</Text>
          <Text style={styles.value}>₹ {summary.expense.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    marginTop: 10,
    borderRadius: 18,
    padding: 20,
    backgroundColor: COLORS.primary,
  },
  balanceLabel: {
    color: '#fff',
    fontSize: 14,
  },
  balance: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 12,
    borderRadius: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 6,
  },
  label: {
    color: '#fff',
    fontSize: 13,
  },
  value: {
    color: '#fff',
    fontWeight: '700',
    marginTop: 4,
  },
});
