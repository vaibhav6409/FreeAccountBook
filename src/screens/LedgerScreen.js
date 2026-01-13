import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import { getDB } from '../db/database';
import AddTransactionSheet from './AddTransactionSheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TransactionActionSheet from '../components/TransactionActionSheet';
import AppHeader from '../components/AppHeader';
import AnimatedHeader from '../components/AnimatedHeader';
import HeaderActionsSheet from '../components/HeaderActionsSheet';

export default function LedgerScreen({ route, navigation }) {
  const { accountId, name } = route.params;
  const [filter, setFilter] = useState('ALL');
  const [txns, setTxns] = useState([]);
  const [showSheet, setShowSheet] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [actionTxn, setActionTxn] = useState(null);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });
  const [searchText, setSearchText] = useState('');
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    // navigation.setOptions({ title: name });
    loadTxns();
    loadSummary();
  }, [filter]);

  const loadTxns = async () => {
    const db = await getDB();

    let where = '';
    if (filter === 'CR') where = "AND t.type='CR'";
    if (filter === 'DR') where = "AND t.type='DR'";

    const res = await db.executeSql(
      `
    SELECT 
      t.*,
      c.icon AS category_icon,
      c.color AS category_color
    FROM transactions t
    LEFT JOIN categories c ON c.id = t.category_id
    WHERE t.account_id=?
    ${where}
    ORDER BY t.date DESC`,
      [accountId],
    );

    const rows = [];
    for (let i = 0; i < res[0].rows.length; i++) {
      rows.push(res[0].rows.item(i));
    }
    // console.log('rows', rows);
    setTxns(rows);
  };

  const loadSummary = async () => {
    const db = await getDB();

    const res = await db.executeSql(
      `
    SELECT
      SUM(CASE WHEN t.type='CR' THEN t.amount ELSE 0 END) AS income,
      SUM(CASE WHEN t.type='DR' THEN t.amount ELSE 0 END) AS expense
    FROM transactions t
    WHERE t.account_id=?
  `,
      [accountId],
    );

    const row = res[0].rows.item(0);

    const income = row.income || 0;
    const expense = row.expense || 0;

    setSummary({
      income,
      expense,
      balance: income - expense,
    });
  };

  const filteredTxns = txns.filter(
    t =>
      t.note?.toLowerCase().includes(searchText.toLowerCase()) ||
      t.amount.toString().includes(searchText),
  );

  return (
    <View style={{ flex: 1, justifyContent: 'flex-start' }}>
      <HeaderActionsSheet
        isVisible={showActions}
        onClose={() => setShowActions(false)}
      />
      <AnimatedHeader
        title={name}
        showBack
        scrollY={scrollY}
        onSearch={text => setSearchText(text)}
        // onMore={() => setShowActions(true)}
      />

      {/* LIST */}
      <Animated.FlatList
        data={filteredTxns}
        keyExtractor={i => i.id.toString()}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 160 }}
        ListHeaderComponent={
          <View style={{ backgroundColor: '#ffffff' }}>
            <View style={styles.filterRow}>
              {['ALL', 'CR', 'DR'].map(f => (
                <TouchableOpacity
                  key={f}
                  onPress={() => setFilter(f)}
                  style={[styles.filterBtn, filter === f && styles.active]}
                >
                  <Text>
                    {f === 'ALL' ? 'All' : f === 'CR' ? 'Income' : 'Expense'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.tableHeader}>
              <Text style={[styles.th, { flex: 2 }]}>Date ↓</Text>
              <Text style={[styles.th, { flex: 2 }]}>Notes</Text>
              <Text style={[styles.th, { flex: 2, textAlign: 'right' }]}>
                Amount
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.txnRow}
            onPress={() => {
              setActionTxn(item);
              setShowActionSheet(true);
            }}
          >
            {/* ICON */}
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: item.category_icon
                    ? item.category_color
                    : '#d1d5db', // gray
                },
              ]}
            >
              {item.category_icon ? (
                <Icon name={item.category_icon} size={14} color="#fff" />
              ) : (
                <Icon name="dots-horizontal" size={16} color="#555" />
              )}
            </View>

            {/* DATE */}
            <Text style={[styles.date, { flex: 1.2 }]}>{item.date}</Text>

            {/* NOTE */}
            <Text style={[styles.note, { flex: 2 }]} numberOfLines={1}>
              {item.note || ''}
            </Text>

            {/* AMOUNT */}
            <Text
              style={[
                styles.amount,
                {
                  flex: 2,
                  // backgroundColor:'red',
                  textAlign: 'right',
                  color: item.type === 'CR' ? '#2ecc71' : '#e74c3c',
                },
              ]}
            >
              {item.amount}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No transactions yet</Text>
        }
      />
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Income</Text>
          <Text style={styles.footerValue}>{summary.income.toFixed(2)}</Text>
        </View>

        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Expense</Text>
          <Text style={styles.footerValue}>{summary.expense.toFixed(2)}</Text>
        </View>

        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Balance</Text>
          <Text style={styles.footerValue}>{summary.balance.toFixed(2)}</Text>
        </View>
      </View>
      {/* <View style={{ height: 20 }}>

      </View> */}

      {/* ADD BUTTON */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setSelectedTxn(null);
          setShowSheet(true);
        }}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      <AddTransactionSheet
        isVisible={showSheet}
        onClose={() => {
          setSelectedTxn(null);
          setShowSheet(false);
        }}
        accountId={accountId}
        onSaved={() => {
          setSelectedTxn(null);
          loadTxns();
          loadSummary(); // 🔥 ADD THIS
        }}
        editData={selectedTxn} // 👈 NEW
      />
      <TransactionActionSheet
        isVisible={showActionSheet}
        transaction={actionTxn}
        onClose={() => {
          setShowActionSheet(false);
          setActionTxn(null);
        }}
        onEdit={txn => {
          setShowActionSheet(false); // ✅ close first
          setActionTxn(null);

          setSelectedTxn(txn);
          setShowSheet(true);
        }}
        onCopy={txn => {
          setSelectedTxn({
            ...txn,
            id: null, // important
          });
          setShowSheet(true);
        }}
        onDeleted={() => {
          loadTxns();
          loadSummary();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    backgroundColor: '#eef1f6',
    margin: 12,
    borderRadius: 14,
    padding: 4,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  active: {
    backgroundColor: '#fff',
    elevation: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    // backgroundColor: '#3478f6',
    backgroundColor: '#cecece',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  th: {
    color: '#fff',
    fontWeight: '600',
  },

  txnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  iconCircle: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },

  iconText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  fab: {
    position: 'absolute',
    bottom: 90, // ⬅️ important
    right: 20,
    backgroundColor: '#3478f6',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  fabText: { color: '#fff', fontSize: 30 },
  txnCard: {
    backgroundColor: '#fff',
    padding: 14,
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },

  left: {
    flex: 1,
  },

  date: {
    fontSize: 12,
    color: '#888',
  },

  note: {
    fontSize: 12,
    fontWeight: 'normal',
    marginTop: 1,
  },

  amount: {
    fontSize: 16,
    fontWeight: '700',
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
  },

  footer: {
    flexDirection: 'row',
    backgroundColor: '#3478f6',
    paddingVertical: 14,
  },

  footerItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  footerLabel: {
    color: '#cfe0ff',
    fontSize: 12,
  },

  footerValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'right',
  },
});
