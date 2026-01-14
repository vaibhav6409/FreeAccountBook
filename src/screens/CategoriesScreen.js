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
import CategorySheet from '../sheets/CategorySheet';
import AppHeader from '../components/AppHeader';
import { COLORS } from '../theme/colors';

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

  const remove = async id => {
    Alert.alert('Delete category?', 'This category will be removed', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const db = await getDB();
          await db.executeSql('DELETE FROM categories WHERE id=?', [id]);
          load();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Categories" showBack />
      <FlatList
        data={categories}
        keyExtractor={i => i.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.left}>
              <View style={[styles.iconWrap, { backgroundColor: item.color }]}>
                <Icon name={item.icon} size={18} color={COLORS.icon} />
              </View>
              <Text style={styles.name}>{item.name}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  setEditCat(item);
                  setShowSheet(true);
                }}
              >
                <Icon name="pencil-outline" size={20} color={COLORS.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => remove(item.id)}
              >
                <Icon name="delete-outline" size={20} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No categories yet</Text>}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setEditCat(null);
          setShowSheet(true);
        }}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  name: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
  },

  actions: {
    flexDirection: 'row',
  },

  actionBtn: {
    padding: 6,
    marginLeft: 6,
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },

  fabText: {
    color: COLORS.icon,
    fontSize: 32,
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: COLORS.muted,
  },
});
