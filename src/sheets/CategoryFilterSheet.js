import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDB } from '../db/database';
import { COLORS } from '../theme/colors';

export default function CategoryFilterSheet({
  isVisible,
  onClose,
  selectedCategories,
  onSelectCategory,
}) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const db = await getDB();
    const res = await db.executeSql('SELECT * FROM categories');
    const rows = [];
    for (let i = 0; i < res[0].rows.length; i++) {
      rows.push(res[0].rows.item(i));
    }
    setCategories(rows);
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.sheet}>
        <Text style={styles.title}>Filter by Category</Text>

        <TouchableOpacity
          style={styles.clear}
          onPress={() => {
            onSelectCategory(null);
            onClose();
          }}
        >
          <Text style={{ color: COLORS.primary }}>Clear Filter</Text>
        </TouchableOpacity>

        <FlatList
          data={categories}
          keyExtractor={i => i.id.toString()}
          renderItem={({ item }) => {
            const active = selectedCategories.some(c => c.id === item.id);
            return (
              <TouchableOpacity
                style={styles.row}
                onPress={() => {
                  onSelectCategory(item);
                  onClose();
                }}
              >
                <View style={[styles.icon, { backgroundColor: item.color }]}>
                  <Icon name={item.icon} size={16} color="#fff" />
                </View>
                <Text style={styles.name}>{item.name}</Text>
                {active && (
                  <Icon name="check" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { justifyContent: 'flex-end', margin: 0 },
  sheet: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  clear: { paddingVertical: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  name: { flex: 1, fontSize: 15 },
});
