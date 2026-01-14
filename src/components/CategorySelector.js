import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDB } from '../db/database';
import { COLORS } from '../theme/colors';

export default function CategorySelector({ selected, onSelect, refreshKey }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, [refreshKey]);

  const loadCategories = async () => {
    const db = await getDB();
    const res = await db.executeSql('SELECT * FROM categories');
    const rows = [];
    for (let i = 0; i < res[0].rows.length; i++) {
      rows.push(res[0].rows.item(i));
    }
    setCategories(rows);
  };

  if (!categories.length) {
    return <Text style={{ color: COLORS.textMuted }}>No categories yet</Text>;
  }

  return (
    <FlatList
      horizontal
      data={categories}
      keyExtractor={i => i.id.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 4 }}
      renderItem={({ item }) => {
        const active = selected?.id === item.id;
        return (
          <TouchableOpacity
            style={[
              styles.chip,
              active && {
                borderColor: item.color,
                backgroundColor: COLORS.surface,
              },
            ]}
            onPress={() => onSelect(active ? null : item)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconWrap, { backgroundColor: item.color }]}>
              <Icon name={item.icon} size={16} color="#fff" />
            </View>

            <Text
              style={[styles.text, active && styles.activeText]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}
const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: COLORS.background,
  },

  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },

  text: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },

  activeText: {
    fontWeight: '700',
  },
});
