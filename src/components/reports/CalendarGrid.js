import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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

export default function CalendarGrid({
  year,
  month,
  data,
  dataMap,
  onSelectDay,
  onPrev,
  onNext,
}) {
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [selected, setSelected] = useState(null);

  return (
    <View style={styles.card}>
      <View style={styles.container}>
        <TouchableOpacity onPress={onPrev} style={styles.arrowBtn}>
          <Icon name="chevron-left" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        <Text style={styles.title}>
          {MONTHS[month - 1]} {year}
        </Text>

        <TouchableOpacity onPress={onNext} style={styles.arrowBtn}>
          <Icon name="chevron-right" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.grid}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <Text key={d} style={styles.week}>
            {d}
          </Text>
        ))}

        {data.map((day, i) => {
          if (!day) return <View key={i} style={styles.cell} />;

          const key = `${year}-${String(month).padStart(2, '0')}-${String(
            day,
          ).padStart(2, '0')}`;
          const info = dataMap[key];

          const isToday = key === todayKey;
          const isSelected = key === selected;

          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.cell,
                isToday && styles.today,
                isSelected && styles.selected,
              ]}
              onPress={() => {
                setSelected(key);
                onSelectDay(key);
              }}
            >
              <Text style={styles.day}>{day}</Text>

              {info?.income > 0 && (
                <Text style={styles.income}>+{info.income}</Text>
              )}
              {info?.expense > 0 && (
                <Text style={styles.expense}>-{info.expense}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 12,
    marginTop: 12,
  },
  week: {
    width: '14.28%',
    textAlign: 'center',
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  cell: {
    width: '14.28%',
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 1,
  },
  today: {
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  selected: {
    backgroundColor: COLORS.primaryLight,
  },
  day: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  income: {
    fontSize: 10,
    color: COLORS.income,
  },
  expense: {
    fontSize: 10,
    color: COLORS.expense,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    paddingHorizontal: 20,
    marginHorizontal: 10,
    backgroundColor: COLORS.primarySoft,
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  arrowBtn: {
    width: 40,
    height: 40,
    marginVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  card: {
    backgroundColor: COLORS.surface,
    margin: 12,
    marginTop: 16,
    borderRadius: 16,
    padding: 8,
    elevation: 2,
  },
});
