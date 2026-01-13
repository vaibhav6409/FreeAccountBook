import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDB } from '../db/database';
import CategorySheet from './CategorySheet';

export default function CategoriesScreen() {
  const [categories, setCategories] = useState([]);
  const [showSheet, setShowSheet] = useState(false);
  const [editCat, setEditCat] = useState(null);

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

  const remove = async (id) => {
    Alert.alert('Delete?', 'This category will be removed', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          const db = await getDB();
          await db.executeSql(
            'DELETE FROM categories WHERE id=?',
            [id]
          );
          load();
        },
      },
    ]);
  };

  return (
  <View style={{ flex: 1 }}>
    <FlatList
      data={categories}
      keyExtractor={(i) => i.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <View style={styles.left}>
            <View
              style={[
                styles.icon,
                { backgroundColor: item.color },
              ]}
            >
              <Icon name={item.icon} size={18} color="#fff" />
            </View>
            <Text style={styles.name}>{item.name}</Text>
          </View>

          {/* EDIT */}
          <TouchableOpacity
            onPress={() => {
              setEditCat(item);
              setShowSheet(true);
            }}
          >
            <Icon name="pencil-outline" size={22} />
          </TouchableOpacity>

          {/* DELETE */}
          <TouchableOpacity onPress={() => remove(item.id)}>
            <Icon name="delete-outline" size={22} />
          </TouchableOpacity>
        </View>
      )}
    />

    {/* ADD BUTTON */}
    <TouchableOpacity
      style={styles.fab}
      onPress={() => {
        setEditCat(null);
        setShowSheet(true);
      }}
    >
      <Text style={styles.fabText}>＋</Text>
    </TouchableOpacity>

    {/* 🔽 ADD THIS HERE */}
    <CategorySheet
      isVisible={showSheet}
      editData={editCat}
      onClose={() => {
        setShowSheet(false);
        setEditCat(null);
      }}
      onSaved={load}
    />
  </View>
);

}
