import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { getDB } from '../db/database';
import { COLORS } from '../theme/colors';

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
    Alert.alert('Delete Transaction', 'This action cannot be undone', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const db = await getDB();
          await db.executeSql('DELETE FROM transactions WHERE id=?', [
            transaction.id,
          ]);
          onDeleted?.();
          onClose();
        },
      },
    ]);
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <View style={styles.container}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <View style={{ width: 24 }} />
          <Text style={styles.title}>Transaction</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={20} color={COLORS.iconMuted} />
          </TouchableOpacity>
        </View>

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
          subtitle="Duplicate this transaction"
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
      <View style={styles.iconWrap}>
        <Icon
          name={icon}
          size={22}
          color={danger ? COLORS.danger : COLORS.primary}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={[styles.label, danger && { color: COLORS.danger }]}>
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
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 12,
  },

  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 10,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 6,
  },

  title: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },

  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  sub: {
    fontSize: 12,
    marginTop: 2,
    color: COLORS.textSecondary,
  },
});
