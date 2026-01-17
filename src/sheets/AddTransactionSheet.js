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
import DatePicker from 'react-native-date-picker';

import { getDB } from '../db/database';
import CategorySelector from '../components/CategorySelector';
import CategorySheet from '../sheets/CategorySheet';
import { COLORS } from '../theme/colors';

export default function AddTransactionSheet({
  isVisible,
  onClose,
  accountId,
  onSaved,
  editData = null,
  settings
}) {
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [note, setNote] = useState('');
  const [noteError, setNoteError] = useState('');
  const [type, setType] = useState('CR');
  const [category, setCategory] = useState(null);
  const [dateOpen, setDateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [categoryRefresh, setCategoryRefresh] = useState(0);

  useEffect(() => {
    if (editData) {
      setAmount(String(editData.amount));
      setNote(editData.note || '');
      setType(editData.type);
      setSelectedDate(editData.date);
      setCategory(editData.category_id ? { id: editData.category_id } : null);
    } else {
      setAmount('');
      setNote('');
      setType('CR');
      setCategory(null);
      setSelectedDate(new Date().toISOString().slice(0, 10));
    }
  }, [editData]);

  const validateAmount = (value) => {
    if (!value || value.trim() === '') {
      return 'Amount is required';
    }

    const num = Number(value);

    if (isNaN(num)) {
      return 'Enter a valid number';
    }

    if (num <= 0) {
      return 'Amount must be greater than 0';
    }

    return '';
  };

  const validateNote = (value) => {
  if (!value) return '';

  // Trim spaces
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return 'Note cannot be empty spaces';
  }

  // Only special characters
  if (/^[^a-zA-Z0-9]+$/.test(trimmed)) {
    return 'Note should contain letters or numbers';
  }

  return '';
};

  const saveTransaction = async txType => {
    const amountErr = validateAmount(amount);
    const noteErr = validateNote(note);

    setAmountError(amountErr);
    setNoteError(noteErr);

    if (amountErr || noteErr) return;

    const db = await getDB();

    if (editData) {
      await db.executeSql(
        `UPDATE transactions SET
          amount=?, type=?, date=?, note=?, category_id=?
         WHERE id=?`,
        [amount, txType, selectedDate, note, category?.id || null, editData.id],
      );
    } else {
      await db.executeSql(
        `INSERT INTO transactions
          (account_id, amount, type, date, note, category_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [accountId, amount, txType, selectedDate, note, category?.id || null],
      );
    }
      setAmount('');
      setNote('');
      setType('CR');
      setCategory(null);
      setSelectedDate(new Date().toISOString().slice(0, 10));

    onSaved();
    onClose();
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} onBackButtonPress={onClose} style={styles.modal}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {editData ? 'Edit Transaction' : 'Add Transaction'}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={22} color={COLORS.iconMuted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setDateOpen(true)}
        >
          <Icon name="calendar-outline" size={16} color={COLORS.primary} />
          <Text style={styles.dateText}>{selectedDate}</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Amount"
          placeholderTextColor={COLORS.textSecondary}
          value={amount}
          onChangeText={(val) => {
            // allow only numbers & decimal
            const cleaned = val.replace(/[^0-9.]/g, '');

            // prevent multiple dots
            if ((cleaned.match(/\./g) || []).length > 1) return;

            setAmount(cleaned);
            setAmountError(validateAmount(cleaned));
          }}
          keyboardType="decimal-pad"
          maxLength={12}
          style={[
            styles.amount,
            amountError && { borderColor: COLORS.expense },
          ]}
        />
        {amountError ? (
          <Text style={styles.errorText}>{amountError}</Text>
        ) : null}

        <TextInput
          placeholder="Notes (optional)"
          placeholderTextColor={COLORS.textSecondary}
          value={note}
          onChangeText={(val) => {
            // prevent leading spaces
            let cleaned = val.replace(/^\s+/, '');

            // replace multiple spaces with single
            cleaned = cleaned.replace(/\s{2,}/g, ' ');

            setNote(cleaned);
            setNoteError(validateNote(cleaned));
          }}
          maxLength={35}
          style={[
            styles.note,
            noteError && { borderColor: COLORS.expense },
          ]}
        />
        {noteError ? (
          <Text style={styles.errorText}>{noteError}</Text>
        ) : null}

        <View style={styles.categoryRow}>
          <TouchableOpacity
            style={styles.addCat}
            onPress={() => setShowCategorySheet(true)}
          >
            <Icon name="plus" size={20} color={COLORS.primary} />
          </TouchableOpacity>

          <CategorySelector
            selected={category}
            onSelect={setCategory}
            refreshKey={categoryRefresh}
          />
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            disabled={!!amountError}
            style={[styles.actionBtn, styles.income]}
            onPress={() => saveTransaction('CR')}
          >
            <Text style={styles.actionText}>{settings.amount_labels === 'CD' ? 'Credit' : 'Income'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={!!amountError}
            style={[styles.actionBtn, styles.expense]}
            onPress={() => saveTransaction('DR')}
          >
            <Text style={styles.actionText}>{settings.amount_labels === 'CD' ? 'Debit' : 'Expense'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <DatePicker
        modal
        open={dateOpen}
        date={new Date(selectedDate)}
        mode="date"
        onConfirm={date => {
          setDateOpen(false);
          setSelectedDate(date.toISOString().slice(0, 10));
        }}
        onCancel={() => setDateOpen(false)}
      />

      <CategorySheet
        isVisible={showCategorySheet}
        onClose={() => setShowCategorySheet(false)}
        onSaved={() => {
          setCategoryRefresh(v => v + 1);
          setShowCategorySheet(false);
        }}
      />
    </Modal>
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
    padding: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: COLORS.primarySoft,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },

  dateText: {
    marginLeft: 8,
    color: COLORS.primary,
    fontWeight: '600',
  },

  amount: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    marginTop: 16,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.surface,
  },

  note: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.textPrimary,
  },

  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },

  addCat: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 22,
  },

  actionBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginHorizontal: 6,
  },

  income: {
    backgroundColor: COLORS.income,
  },

  expense: {
    backgroundColor: COLORS.expense,
  },

  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    marginTop: 6,
    marginLeft: 4,
    fontSize: 12,
    color: COLORS.expense,
    fontWeight: '500',
  },
});
