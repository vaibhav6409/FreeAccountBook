import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ICONS, COLORS } from '../constants/categoryOptions';
import { getDB } from '../db/database';

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
        [name, icon, color, editData.id]
      );
    } else {
      await db.executeSql(
        `INSERT INTO categories (name, icon, color) VALUES (?, ?, ?)`,
        [name, icon, color]
      );
    }

    onSaved();
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {editData ? 'Edit Category' : 'Add Category'}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* NAME */}
        <TextInput
          placeholder="Category name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        {/* ICON PICKER */}
        <Text style={styles.label}>Icon</Text>
        <FlatList
          data={ICONS}
          numColumns={5}
          keyExtractor={(i) => i}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.iconBox,
                icon === item && { backgroundColor: color },
              ]}
              onPress={() => setIcon(item)}
            >
              <Icon
                name={item}
                size={22}
                color={icon === item ? '#fff' : '#555'}
              />
            </TouchableOpacity>
          )}
        />

        {/* COLOR PICKER */}
        <Text style={styles.label}>Color</Text>
        <View style={styles.colorRow}>
          {COLORS.map((c) => (
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

        {/* SAVE */}
        <TouchableOpacity style={styles.saveBtn} onPress={save}>
          <Text style={styles.saveText}>
            {editData ? 'Update' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { justifyContent: 'flex-end', margin: 0 },
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
  },

  label: {
    marginTop: 16,
    marginBottom: 6,
    fontWeight: '600',
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
    backgroundColor: '#f1f1f1',
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
    marginRight: 10,
    marginBottom: 10,
  },
  activeColor: {
    borderWidth: 3,
    borderColor: '#000',
  },

  saveBtn: {
    backgroundColor: '#3478f6',
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
