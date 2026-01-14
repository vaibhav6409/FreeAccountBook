import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ICONS, COLORS } from '../constants/categoryOptions';
import { getDB } from '../db/database';
import { COLORS as THEME } from '../theme/colors';

export default function CategorySheet({
  isVisible,
  onClose,
  onSaved,
  editData = null,
}) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => {
    if (editData) {
      setName(editData.name);
      setIcon(editData.icon);
      setColor(editData.color);
    } else {
      setName('');
      setIcon(ICONS[0]);
      setColor(COLORS[0]);
    }
  }, [editData, isVisible]);

  const save = async () => {
    if (!name.trim()) return;

    const db = await getDB();

    if (editData) {
      await db.executeSql(
        `UPDATE categories SET name=?, icon=?, color=? WHERE id=?`,
        [name, icon, color, editData.id],
      );
    } else {
      await db.executeSql(
        `INSERT INTO categories (name, icon, color) VALUES (?, ?, ?)`,
        [name, icon, color],
      );
    }

    onSaved();
    onClose();
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
    
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.title}>
            {editData ? 'Edit Category' : 'Add Category'}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <TextInput
          placeholder="Category name"
          value={name}
          onChangeText={setName}
          maxLength={30}
          autoFocus
          style={styles.input}
        />
       
        <View style={styles.preview}>
          <View style={[styles.previewIcon, { backgroundColor: color }]}>
            <Icon name={icon} size={22} color="#fff" />
          </View>
          <Text style={styles.previewText}>{name || 'Preview'}</Text>
        </View>

        <Text style={styles.label}>Icon</Text>
        <FlatList
          data={ICONS}
          // numColumns={6}
          horizontal
          keyExtractor={i => i}
          renderItem={({ item }) => {
            const active = icon === item;
            return (
              <TouchableOpacity
                style={[styles.iconBox, active && { backgroundColor: color }]}
                onPress={() => setIcon(item)}
              >
                <Icon name={item} size={20} color={active ? '#fff' : '#666'} />
              </TouchableOpacity>
            );
          }}
        />

        <Text style={styles.label}>Color</Text>
        <View style={styles.colorRow}>
          {COLORS.map(c => (
            <TouchableOpacity
              key={c}
              style={[
                styles.color,
                { backgroundColor: c },
                color === c && styles.activeColor,
              ]}
              onPress={() => setColor(c)}
            />
          ))}
        </View>
         </ScrollView>

        <TouchableOpacity style={styles.saveBtn} onPress={save}>
          <Text style={styles.saveText}>
            {editData ? 'Update Category' : 'Add Category'}
          </Text>
        </TouchableOpacity>
       
      </KeyboardAvoidingView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modal: { justifyContent: 'flex-end', margin: 0 },

  container: {
    backgroundColor: THEME.background,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 10,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: { fontSize: 18, fontWeight: '600' },
  close: { fontSize: 20 },

  input: {
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    backgroundColor: THEME.surface,
  },

  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },

  previewIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  previewText: {
    fontSize: 16,
    fontWeight: '600',
  },

  label: {
    marginTop: 20,
    marginBottom: 8,
    fontWeight: '600',
    color: THEME.textSecondary,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
    backgroundColor: THEME.surface,
  },

  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },

  color: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    marginBottom: 12,
  },

  activeColor: {
    borderWidth: 3,
    borderColor: '#000',
  },

  saveBtn: {
    backgroundColor: THEME.primary,
    padding: 14,
    borderRadius: 14,
    marginTop: 24,
    alignItems: 'center',
  },

  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
