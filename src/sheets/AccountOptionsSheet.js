import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDB } from '../db/database';
import { COLORS } from '../theme/colors';

export default function AccountOptionsSheet({
  isVisible,
  account,
  onClose,
  onEdit,
  onRefresh,
}) {
  if (!account) return null;

  const togglePin = async () => {
    const db = await getDB();
    await db.executeSql(`UPDATE accounts SET is_pinned=? WHERE id=?`, [
      account.is_pinned ? 0 : 1,
      account.id,
    ]);
    onRefresh();
    onClose();
  };

  const deleteAccount = () => {
    Alert.alert(
      'Delete Account',
      `Deleting "${account.name}" will also delete all its transactions. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const db = await getDB();

            // 🔥 delete related transactions first
            await db.executeSql(
              'DELETE FROM transactions WHERE account_id=?',
              [account.id]
            );

            // 🔥 then delete account
            await db.executeSql(
              'DELETE FROM accounts WHERE id=?',
              [account.id]
            );

            onRefresh();
            onClose();
          },
        },
      ],
    );
  };


  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} onBackButtonPress={onClose} style={styles.modal}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>{account.name}</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={22} color={COLORS.iconMuted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.row} onPress={onEdit}>
          <Icon name="pencil-outline" size={20} color={COLORS.primary} />
          <Text style={styles.rowText}>Rename account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={togglePin}>
          <Icon
            name={account.is_pinned ? 'pin-off-outline' : 'pin-outline'}
            size={20}
            color={COLORS.primary}
          />
          <Text style={styles.rowText}>
            {account.is_pinned ? 'Unpin account' : 'Pin account'}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.row} onPress={deleteAccount}>
          <Icon name="delete-outline" size={20} color={COLORS.expense} />
          <Text style={[styles.rowText, styles.deleteText]}>
            Delete account
          </Text>
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

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },

  rowText: {
    marginLeft: 14,
    fontSize: 16,
    color: COLORS.textPrimary,
  },

  deleteText: {
    color: COLORS.expense,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
});
