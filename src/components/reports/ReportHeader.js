import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../theme/colors';

export default function ReportHeader({
  accountId,
  accounts,
  onOpenPicker,
}) {
  const selectedAccount = accounts.find(a => a.id === accountId);

  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.accountBtn} onPress={onOpenPicker}>
        <Text style={styles.accountText}>
          {selectedAccount ? selectedAccount.name : 'All Accounts'}
        </Text>
        <Icon name="chevron-down" size={20} color={COLORS.primary} />
      </TouchableOpacity>

      {/* <TouchableOpacity>
        <Icon name="download" size={22} color={COLORS.primary} />
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  accountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.primarySoft,
    borderWidth: 1,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  accountText: {
    color: COLORS.primary,
    fontWeight: '600',
    marginRight: 6,
  },
});
