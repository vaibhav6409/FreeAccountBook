import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function MonthlyTable({ data, currency, onPrev, onNext, year }) {
  const totalIncome = data.reduce((s, i) => s + i.income, 0);
  const totalExpense = data.reduce((s, i) => s + i.expense, 0);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onPrev} style={styles.arrowBtn}>
         <Icon name="chevron-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        <Text style={styles.yearText}>{year}</Text>

        <TouchableOpacity onPress={onNext} style={styles.arrowBtn}>
          <Icon name="chevron-right" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <View style={[styles.row, styles.header]}>
          <Text style={[styles.cell, { textAlign: 'left', flex: 2 }]}>
            Month
          </Text>
          <Text style={styles.cell}>Income</Text>
          <Text style={styles.cell}>Expense</Text>
          <Text style={styles.cell}>Balance</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {data.map((m, i) => (
            <View key={i} style={styles.row}>
              <Text
                style={[
                  styles.cell,
                  { color: '#000', textAlign: 'left', flex: 2 },
                ]}
              >
                {MONTHS[m.month]}
              </Text>

              <Text style={[styles.cell, styles.income]}>
                {currency} {m.income.toFixed(2)}
              </Text>

              <Text style={[styles.cell, styles.expense]}>
                {currency} {m.expense.toFixed(2)}
              </Text>

              <Text
                style={[
                  styles.cell,
                  m.balance >= 0 ? styles.income : styles.expense,
                ]}
              >
                {currency} {m.balance.toFixed(2)}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={[styles.row, styles.total]}>
          <Text style={[styles.cell, { textAlign: 'left', flex: 2 }]}>
            Total
          </Text>
          <Text style={styles.cell}>
            {currency} {totalIncome.toFixed(2)}
          </Text>
          <Text style={styles.cell}>
            {currency} {totalExpense.toFixed(2)}
          </Text>
          <Text style={styles.cell}>
            {currency} {(totalIncome - totalExpense).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    marginVertical: 5,
    marginHorizontal: 2.5,
    paddingVertical: 1,
    borderRadius: 14,
    overflow: 'hidden',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    backgroundColor: COLORS.primary,
  },
  total: {
    backgroundColor: COLORS.primary,
  },
  cell: {
    flex: 2,
    fontSize: 13,
    textAlign: 'right',
    color: '#fff',
    fontWeight: '600',
  },
  income: {
    color: COLORS.income,
  },
  expense: {
    color: COLORS.expense,
  },

  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    paddingHorizontal: 15,
    marginHorizontal: 35,
    marginTop: 10,
    backgroundColor: COLORS.primarySoft,
    borderRadius: 12,
  },
  yearText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  arrowBtn: {
    width: 40,
    height: 40,
    marginVertical: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
});
