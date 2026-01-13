import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { getDB } from '../db/database';

export default function AccountOptionsSheet({
  isVisible,
  account,
  onClose,
  onEdit,
  onRefresh,
}) {
  const togglePin = async () => {
    const db = await getDB();

    await db.executeSql(`UPDATE accounts SET is_pinned=? WHERE id=?`, [
      account.is_pinned ? 0 : 1,
      account.id,
    ]);

    onRefresh();
    onClose();
  };

  const deleteAccount = async () => {
    Alert.alert('Confirm Delete', `Delete ${account.name} account?`, [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const db = await getDB();
          await db.executeSql('DELETE FROM accounts WHERE id=?', [account.id]);
          onRefresh();
          onClose();
        },
      },
    ]);
  };

  if (!account) return null;

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>{account.name}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.row} onPress={onEdit}>
          <Text>✏ Rename</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={togglePin}>
          <Text>
            {account.is_pinned ? '📌 Unpin Account' : '📌 Pin Account'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={deleteAccount}>
          <Text style={{ color: 'red' }}>🗑 Delete</Text>
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    paddingVertical: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  close: { fontSize: 20 },
});
