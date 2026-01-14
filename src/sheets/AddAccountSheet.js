import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDB } from '../db/database';
import { COLORS } from '../theme/colors';

export default function AddAccountSheet({
  isVisible,
  editData,
  onClose,
  onSaved,
}) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (editData) setName(editData.name);
    else setName('');
  }, [editData]);

  const save = async () => {
    if (!name.trim()) return;

    const db = await getDB();

    if (editData) {
      await db.executeSql('UPDATE accounts SET name=? WHERE id=?', [
        name,
        editData.id,
      ]);
    } else {
      await db.executeSql('INSERT INTO accounts (name) VALUES (?)', [name]);
    }

    setName('');
    onSaved();
    onClose();
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {editData ? 'Rename Account' : 'Add New Account'}
          </Text>

          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={22} color={COLORS.iconMuted} />
          </TouchableOpacity>
        </View>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Account name"
          placeholderTextColor={COLORS.textSecondary}
          maxLength={20}
          style={styles.input}
        />

        <TouchableOpacity style={styles.btn} onPress={save}>
          <Text style={styles.btnText}>{editData ? 'Update' : 'Add'}</Text>
        </TouchableOpacity>
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 16,
    backgroundColor: COLORS.surface,
  },

  btn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
