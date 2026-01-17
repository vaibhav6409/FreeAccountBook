import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
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
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
      propagateSwipe
    >
      <View style={styles.sheet}>
        <View style={styles.handle} />

        <Text style={styles.title}>Filter by Category</Text>

        <FlatList
          data={categories}
          keyExtractor={i => i.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <Text
              style={{ textAlign: 'center', marginVertical: 60, color: '#999' }}
            >
              No categories found
            </Text>
          }
          renderItem={({ item }) => {
            const active = selectedCategories.some(c => c.id === item.id);

            return (
              <TouchableOpacity
                style={[styles.row, active && styles.rowActive]}
                onPress={() => onSelectCategory(item)}
                activeOpacity={0.7}
              >
                <View style={[styles.icon, { backgroundColor: item.color }]}>
                  <Icon name={item.icon} size={16} color="#fff" />
                </View>

                <Text style={styles.name}>{item.name}</Text>

                <View
                  style={[styles.checkbox, active && styles.checkboxActive]}
                >
                  {active && <Icon name="check" size={14} color="#fff" />}
                </View>
              </TouchableOpacity>
            );
          }}
        />

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => {
              onSelectCategory(null);
              onClose();
            }}
          >
            <Text style={styles.clearText}>{categories&&categories.length>0?"Clear":"Close"}</Text>
          </TouchableOpacity>

          {categories&&categories.length>0?(<TouchableOpacity style={styles.applyBtn} onPress={onClose}>
            <Text style={styles.applyText}>Apply</Text>
          </TouchableOpacity>):null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },

  sheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 10,
    maxHeight: '80%',
  },

  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginBottom: 12,
    color: COLORS.textPrimary,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  rowActive: {
    backgroundColor: COLORS.primarySoft,
  },

  icon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  clearBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: COLORS.primarySoft,
  },

  clearText: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  applyBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },

  applyText: {
    color: '#fff',
    fontWeight: '700',
  },
});
