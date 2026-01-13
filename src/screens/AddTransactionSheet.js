import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';
import { getDB } from '../db/database';
import CategorySelector from '../components/CategorySelector';
import DatePicker from 'react-native-date-picker';
import CategorySheet from './CategorySheet';

export default function AddTransactionSheet({
  isVisible,
  onClose,
  accountId,
  onSaved,
  editData = null,
}) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [type, setType] = useState('CR'); // CR = Income, DR = Expense
  const [category, setCategory] = useState(null);
  const [dateOpen, setDateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [categoryRefresh, setCategoryRefresh] = useState(0);



useEffect(() => {
  if (editData) {    
    setAmount(String(editData.amount));
    setNote(editData.note || '');
    setType(editData.type);
    setSelectedDate(editData.date);
    setCategory({id:editData.category_id} || null);
  }else {
    setAmount('');
    setNote('');
    setType('CR');
  }
}, [editData]);



  const saveTransaction = async (type) => {
  if (!amount) return;

  const db = await getDB();

  if (editData) {
    await db.executeSql(
      `UPDATE transactions SET
        amount=?, type=?, date=?, note=?, category_id=?
       WHERE id=?`,
      [
        amount,
        type,
        selectedDate,
        note,
        category?.id || null,
        editData.id,
      ]
    );
  } else {
    await db.executeSql(
      `INSERT INTO transactions
        (account_id, amount, type, date, note, category_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        accountId,
        amount,
        type,
        selectedDate,
        note,
        category?.id || null,
      ]
    );
  }

  onSaved();
  onClose();
};


  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>{editData ? 'Edit Transaction' : 'Add New Transaction'}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* DATE */}
        <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => setDateOpen(true)}
            >
            <Text style={styles.dateText}>
                📅 {selectedDate}
            </Text>
        </TouchableOpacity>


        {/* AMOUNT */}
        <TextInput
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          maxLength={12}
          style={styles.amount}
        />

        {/* NOTE */}
        <TextInput
          placeholder="Notes"
          value={note}
          onChangeText={setNote}
          style={styles.note}
        />

        {/* CATEGORY (STATIC FOR NOW) */}
        <View style={styles.categoryRow}>
          <TouchableOpacity
            style={styles.addCat}
            onPress={() => setShowCategorySheet(true)}
            >
            <Text style={styles.plus}>＋</Text>
            </TouchableOpacity>


            <CategorySelector
                selected={category}
                onSelect={setCategory}
                refreshKey={categoryRefresh}
            />

        </View>

        {/* ACTION BUTTONS */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.income]}
            onPress={() => {
              setType('CR');
              saveTransaction('CR');
            }}
          >
            <Text style={styles.actionText}>＋ Income</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.expense]}
            onPress={() => {
              setType('DR');
              saveTransaction('DR');
            }}
          >
            <Text style={styles.actionText}>− Expense</Text>
          </TouchableOpacity>
        </View>
      </View>
      <DatePicker
        modal
        open={dateOpen}
        date={new Date(selectedDate)}
        mode="date"
        onConfirm={(date) => {
            setDateOpen(false);
            setSelectedDate(date.toISOString().slice(0, 10));
        }}
        onCancel={() => setDateOpen(false)}
        />
        <CategorySheet
        isVisible={showCategorySheet}
        onClose={() => setShowCategorySheet(false)}
        onSaved={() => {
            setCategoryRefresh((v) => v + 1);
            setShowCategorySheet(false);
            // CategorySelector reloads automatically on mount
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
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: '600' },
  close: { fontSize: 20 },

  dateBtn: {
    marginTop: 16,
    backgroundColor: '#eef3ff',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  dateText: { color: '#3478f6' },

  amount: {
    borderWidth: 2,
    borderColor: '#3478f6',
    borderRadius: 10,
    padding: 14,
    fontSize: 18,
    marginTop: 16,
  },

  note: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 14,
    marginTop: 12,
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
    backgroundColor: '#e8f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  plus: { fontSize: 22, color: '#3478f6' },
  catChip: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  actionBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  income: { backgroundColor: '#2ecc71' },
  expense: { backgroundColor: '#e74c3c' },
  actionText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
