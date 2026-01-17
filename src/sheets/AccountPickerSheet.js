import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../theme/colors';

export default function AccountPickerSheet({
  isVisible,
  onClose,
  accounts = [],
  selectedAccountId,
  onSelectAccount,
}) {
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

        <Text style={styles.title}>Select Account</Text>
        <View style={{ height: 1, backgroundColor: COLORS.border }} />
        <FlatList
          data={[{ id: null, name: 'All Accounts' }, ...accounts]}
          keyExtractor={(item, index) =>
            item.id === null ? 'all' : item.id.toString()
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => {
            const active = item.id === selectedAccountId;

            return (
              <TouchableOpacity
                style={[styles.row, active && styles.rowActive]}
                onPress={() => {
                  onSelectAccount(item.id);
                  onClose();
                }}
              >
                <Text style={styles.name}>{item.name}</Text>

                {active && (
                  <Icon name="check" size={18} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            );
          }}
        />

        <View style={styles.footer}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
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
    maxHeight: '80%',
    paddingTop: 10,
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
    marginBottom: 10,
    color: COLORS.textPrimary,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  rowActive: {
    backgroundColor: COLORS.primarySoft,
  },

  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  closeBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: COLORS.primarySoft,
  },

  closeText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
