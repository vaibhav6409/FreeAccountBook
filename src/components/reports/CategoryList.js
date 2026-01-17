import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../theme/colors';

export default function CategoryList({ data }) {
  const total = data.reduce((s, i) => s + Number(i.total), 0);

  return (
    <View style={styles.container}>
      {data.map(cat => {
        const percent = ((cat.total / total) * 100).toFixed(1);
        return (
          <View key={cat.id} style={styles.row}>
            <View
              style={[
                styles.icon,
                { backgroundColor: cat.color ?? COLORS.iconMuted },
              ]}
            >
              {cat.icon ? (
                <Icon name={cat.icon} size={16} color="#fff" />
              ) : (
                <Icon
                  name="dots-horizontal"
                  size={16}
                  color={COLORS.background}
                />
              )}
            </View>

            <Text style={styles.name}>{cat.name ?? 'Others'}</Text>

            <Text style={styles.amount}>₹ {cat.total.toFixed(2)}</Text>

            <Text style={styles.percent}>{percent}%</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  name: {
    flex: 1,
    fontWeight: '600',
  },
  amount: {
    fontWeight: '600',
    marginRight: 8,
  },
  percent: {
    color: COLORS.textSecondary,
  },
});
