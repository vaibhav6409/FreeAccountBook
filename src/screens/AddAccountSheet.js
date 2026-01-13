import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { getDB } from '../db/database';

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
      await db.executeSql(
        'UPDATE accounts SET name=? WHERE id=?',
        [name, editData.id]
      );
    } else {
      await db.executeSql(
        'INSERT INTO accounts (name) VALUES (?)',
        [name]
      );
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
            <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
        </View>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Account name"
          style={styles.input}
        />

        <TouchableOpacity style={styles.btn} onPress={save}>
          <Text style={styles.btnText}>
            {editData ? 'Update' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { justifyContent: 'flex-end', margin: 0 },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  title: { fontSize: 18, fontWeight: '600' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16 
  },
  close: { fontSize: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#3478f6',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  btn: {
    backgroundColor: '#3478f6',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '600' },
});

