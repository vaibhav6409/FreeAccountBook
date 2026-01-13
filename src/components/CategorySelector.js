import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDB } from '../db/database';

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

  return (
    <FlatList
      horizontal
      data={categories}
      keyExtractor={(i) => i.id.toString()}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => {
        const active = selected?.id === item.id;
        return (
          <TouchableOpacity
            style={[
              styles.chip,
              active && { borderColor: item.color },
            ]}
            onPress={() => onSelect(item)}
          >
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: item.color },
              ]}
            >
              <Icon name={item.icon} size={18} color="#fff" />
            </View>
            <Text style={styles.text}>{item.name}</Text>
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
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  text: {
    fontSize: 14,
  },
});
