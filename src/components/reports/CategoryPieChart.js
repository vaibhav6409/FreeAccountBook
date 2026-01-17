import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { COLORS } from '../../theme/colors';

export default function CategoryPieChart({ data = [], type }) {
  const pieData = data
    .filter(d => d && d.total != null && Number(d.total) > 0)
    .map((d, index) => ({
      value: Number(d.total),
      color: d.color || COLORS.iconMuted,
      text: d.categoryName || `Item ${index + 1}`,
    }));

  if (!pieData.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No data</Text>
      </View>
    );
  }

  const total = pieData.reduce((s, i) => s + i.value, 0);

  return (
    <View style={styles.container}>
      <PieChart
        data={pieData}
        donut
        radius={120}
        innerRadius={70}
        focusOnPress
        showText={false}
        centerLabelComponent={() => (
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.centerLabel}>
              Total {type === 'DR' ? 'Expense' : 'Income'}
            </Text>
            <Text style={styles.centerValue}>₹ {total.toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  centerLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  centerValue: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
    color: COLORS.text,
  },
  empty: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
  },
});
