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
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (editData) setName(editData.name);
    else setName('');
  }, [editData]);

  const validateName = async (value) => {
  if (!value || value.trim().length === 0) {
    return 'Account name is required';
  }

  const trimmed = value.trim();

  // only special characters
  if (/^[^a-zA-Z0-9]+$/.test(trimmed)) {
    return 'Use letters or numbers';
  }

  const db = await getDB();

  const [res] = await db.executeSql(
    `SELECT id FROM accounts WHERE LOWER(name)=?`,
    [trimmed.toLowerCase()]
  );

  if (
    res.rows.length > 0 &&
    (!editData || res.rows.item(0).id !== editData.id)
  ) {
    return 'Account name already exists';
  }

  return '';
};

  const save = async () => {
    if (!name.trim()) return;

    const error = await validateName(name);
    setNameError(error);

    if (error) return;

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
    <Modal isVisible={isVisible} onBackdropPress={onClose} onBackButtonPress={onClose} style={styles.modal}>
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
          onChangeText={async (val) => {
            // remove leading spaces
            let cleaned = val.replace(/^\s+/, '');

            // collapse multiple spaces
            cleaned = cleaned.replace(/\s{2,}/g, ' ');

            setName(cleaned);

            if (cleaned.length > 0) {
              setNameError(await validateName(cleaned));
            } else {
              setNameError('');
            }
          }}
          placeholder="Account name"
          placeholderTextColor={COLORS.textSecondary}
          maxLength={20}
          style={[
            styles.input,
            nameError && { borderColor: COLORS.expense },
          ]}
        />
        {nameError ? (
          <Text style={styles.errorText}>{nameError}</Text>
        ) : null}

        <TouchableOpacity disabled={!!nameError} style={styles.btn} onPress={save}>
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

  errorText: {
    color: COLORS.expense,
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 4,
  },

});
