import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDB } from '../db/database';

export default function TransactionActionSheet({
  isVisible,
  onClose,
  transaction,
  onEdit,
  onCopy,
  onDeleted,
}) {
  if (!transaction) return null;

  const deleteTxn = () => {
    Alert.alert(
      'Delete Transaction?',
      'This action cannot be undone',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const db = await getDB();
            await db.executeSql(
              'DELETE FROM transactions WHERE id=?',
              [transaction.id]
            );
            onDeleted();
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <View style={styles.container}>
        <View style={styles.handle} />

        <Text style={styles.title}>Transactions</Text>

        <Action
          icon="pencil-outline"
          label="Edit"
          onPress={() => {
            onEdit(transaction);
            onClose();
          }}
        />

        <Action
          icon="content-copy"
          label="Copy"
          subtitle="Entry will stay in this Account"
          onPress={() => {
            onCopy(transaction);
            onClose();
          }}
        />

        <Action
          icon="delete-outline"
          label="Delete"
          danger
          onPress={deleteTxn}
        />
      </View>
    </Modal>
  );
}

function Action({ icon, label, subtitle, danger, onPress }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <Icon
        name={icon}
        size={22}
        color={danger ? '#e74c3c' : '#3478f6'}
        style={{ width: 32 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={[styles.label, danger && { color: '#e74c3c' }]}>
          {label}
        </Text>
        {subtitle && <Text style={styles.sub}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingBottom: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  label: {
    fontSize: 16,
  },
  sub: {
    fontSize: 12,
    color: '#888',
  },
});
