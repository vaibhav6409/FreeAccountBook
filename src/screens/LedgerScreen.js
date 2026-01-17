import React, { useCallback, useEffect, useState } from 'react';
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
import AddTransactionSheet from '../sheets/AddTransactionSheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TransactionActionSheet from '../sheets/TransactionActionSheet';
import AnimatedHeader from '../components/AnimatedHeader';
import HeaderActionsSheet from '../sheets/HeaderActionsSheet';
import { useFocusEffect } from '@react-navigation/native';
import { getAppSettings, getCurrency } from '../utils/settings';
import { COLORS } from '../theme/colors';
import CategoryFilterSheet from '../sheets/CategoryFilterSheet';
import dayjs from 'dayjs';
import EmptyState from '../components/EmptyState';

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
  const [settings, setSettings] = useState({
    date_format: 'DD/MM/YYYY',
    amount_labels: 'IE',
  });
  const [searchText, setSearchText] = useState('');
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [showActions, setShowActions] = useState(false);
  const [currency, setCurrency] = useState({ currency_symbol: '₹' });
  const [sortBy, setSortBy] = useState('date'); 
  const [sortOrder, setSortOrder] = useState('DESC'); 
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getCurrency().then(setCurrency);
      getAppSettings().then(setSettings);
      loadTxns();
    }, [accountId]),
  );

  useEffect(() => {
    let income = 0;
    let expense = 0;

    filteredTxns.forEach(t => {
      if (t.type === 'CR') income += Number(t.amount);
      if (t.type === 'DR') expense += Number(t.amount);
    });

    setSummary({
      income,
      expense,
      balance: income - expense,
    });
  }, [txns, filter, selectedCategories, searchText]);

  const loadTxns = async () => {
    const db = await getDB();

    const res = await db.executeSql(
      `
      SELECT 
        t.*,
        c.icon AS category_icon,
        c.color AS category_color
      FROM transactions t
      LEFT JOIN categories c ON c.id = t.category_id
      WHERE t.account_id=?
      `,
      [accountId],
    );

    const rows = [];
    for (let i = 0; i < res[0].rows.length; i++) {
      rows.push(res[0].rows.item(i));
    }
    console.log('rows', rows);

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

  const filteredTxns = txns
    .filter(t => {
      if (filter === 'CR') return t.type === 'CR';
      if (filter === 'DR') return t.type === 'DR';
      return true;
    })

    .filter(t => {
      if (selectedCategories.length === 0) return true;
      return selectedCategories.some(c => c.id === t.category_id);
    })

    .filter(
      t =>
        t.note?.toLowerCase().includes(searchText.toLowerCase()) ||
        t.amount.toString().includes(searchText),
    )

    .sort((a, b) => {
      let v1, v2;

      if (sortBy === 'date') {
        v1 = new Date(a.date);
        v2 = new Date(b.date);
      } else if (sortBy === 'amount') {
        v1 = Number(a.amount);
        v2 = Number(b.amount);
      } else {
        v1 = (a.note || '').toLowerCase();
        v2 = (b.note || '').toLowerCase();
      }

      if (v1 < v2) return sortOrder === 'ASC' ? -1 : 1;
      if (v1 > v2) return sortOrder === 'ASC' ? 1 : -1;
      return 0;
    });

  const toggleSort = field => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('DESC');
    }
  };
  const toggleCategory = (category) => {
    if (!category) {
      setSelectedCategories([]);
      return;
    }
    setSelectedCategories(prev => {
      const exists = prev.find(c => c.id === category.id);
      if (exists) {
        return prev.filter(c => c.id !== category.id);
      }
      return [...prev, category];
    });
  };

  function HeaderSort({ label, value, sortBy, sortOrder, onPress, align }) {
    const active = sortBy === value;

    return (
      <TouchableOpacity
        onPress={() => onPress(value)}
        style={{
          flex: 2,
          flexDirection: 'row',
          alignItems: 'center',
          alignContent: 'center',
          justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
        }}
      >
        <Text style={[styles.th, active && { fontWeight: '800' }]}>
          {label}
        </Text>
        {active && (
          <Icon
            name={sortOrder === 'ASC' ? 'arrow-up' : 'arrow-down'}
            size={14}
            color={COLORS.primary}
            style={{ marginLeft: 4 }}
          />
        )}
      </TouchableOpacity>
    );
  }

  function getAmountLabel(type, mode) {
    if (mode === 'CD') {
      return type === 'CR' ? 'Credit' : 'Debit';
    }
    return type === 'CR' ? 'Income' : 'Expense';
  }

  return (
    <View
      style={{ flex: 1, justifyContent: 'flex-start', backgroundColor: '#fff' }}
    >
      <HeaderActionsSheet
        isVisible={showActions}
        onClose={() => setShowActions(false)}
      />
      <AnimatedHeader
        title={name}
        showBack
        scrollY={scrollY}
        onSearch={text => setSearchText(text)}
        onMore={() => setShowCategoryFilter(true)}
      />
      <View style={{ backgroundColor: '#ffffff' }}>
        <View style={styles.filterRow}>
          {['ALL', 'CR', 'DR'].map(f => {
            const label =
              f === 'ALL' ? 'All' : getAmountLabel(f, settings.amount_labels);

            return (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                style={[styles.filterBtn, filter === f && styles.active]}
              >
                <Text
                  style={[
                    styles.filterBtnText,
                    filter === f && styles.activeText,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {selectedCategories.length > 0 && (
          <View style={styles.chipWrap}>
            {selectedCategories.map(cat => (
              <View
                key={cat.id}
                style={[
                  styles.categoryChip,
                  { backgroundColor: cat.color + '22' },
                ]}
              >
                <View
                  style={[styles.categoryIcon, { backgroundColor: cat.color }]}
                >
                  <Icon name={cat.icon} size={14} color="#fff" />
                </View>

                <Text style={styles.categoryText}>{cat.name}</Text>

                <TouchableOpacity
                  onPress={() =>
                    setSelectedCategories(prev =>
                      prev.filter(c => c.id !== cat.id),
                    )
                  }
                >
                  <Icon name="close" size={14} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            ))}

            {/* CLEAR ALL */}
            <TouchableOpacity
              style={styles.clearAll}
              onPress={() => setSelectedCategories([])}
            >
              <Text style={styles.clearAllText}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.tableHeader}>
          <HeaderSort
            label="Date"
            value="date"
            sortBy={sortBy}
            sortOrder={sortOrder}
            onPress={v => toggleSort(v)}
          />
          <HeaderSort
            label="Notes"
            value="note"
            sortBy={sortBy}
            sortOrder={sortOrder}
            onPress={v => toggleSort(v)}
          />
          <HeaderSort
            label="Amount"
            value="amount"
            sortBy={sortBy}
            sortOrder={sortOrder}
            onPress={v => toggleSort(v)}
            align="right"
          />
        </View>
      </View>
      <Animated.FlatList
        data={filteredTxns}
        keyExtractor={i => i.id.toString()}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <Pressable
            style={styles.txnRow}
            onPress={() => {
              setActionTxn(item);
              setShowActionSheet(true);
            }}
          >
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: item.category_icon
                    ? item.category_color
                    : COLORS.iconMuted,
                },
              ]}
            >
              {item.category_icon ? (
                <Icon
                  name={item.category_icon}
                  size={14}
                  color={COLORS.background}
                />
              ) : (
                <Icon
                  name="dots-horizontal"
                  size={16}
                  color={COLORS.background}
                />
              )}
            </View>
            <Text style={[styles.date, { flex: 1.2 }]}>
              {dayjs(item.date).format(settings.date_format)}
            </Text>
            <Text style={[styles.note, { flex: 2 }]} numberOfLines={3}>
              {item.note || ''}
            </Text>
            <Text
              style={[
                styles.amount,
                {
                  flex: 2,
                  textAlign: 'right',
                  color: item.type === 'CR' ? COLORS.income : COLORS.expense,
                },
              ]}
            >
              {currency.currency_symbol} {item.amount}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          txns.length == 0 ? (
            <EmptyState
              icon="file-document-outline"
              title="No transactions yet"
              description="Start adding income or expense entries."
              buttonText="Add Transaction"
              onPress={() => {
                setSelectedTxn(null);
                setShowSheet(true);
              }}
            />
          ) : (
            <EmptyState
              icon="magnify"
              title="No results found"
              description="Try a different keyword."
              showButton={false}
            />
          )
        }
      />
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>
            {settings.amount_labels === 'CD' ? 'Credit' : 'Income'}
          </Text>
          <Text style={styles.footerValue}>{summary.income.toFixed(2)}</Text>
        </View>

        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>
            {settings.amount_labels === 'CD' ? 'Debit' : 'Expense'}
          </Text>
          <Text style={styles.footerValue}>{summary.expense.toFixed(2)}</Text>
        </View>

        <View style={styles.footerItem}>
          <Text style={styles.footerLabel}>Balance</Text>
          <Text style={styles.footerValue}>{summary.balance.toFixed(2)}</Text>
        </View>
      </View>

      {txns && txns.length != 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            setSelectedTxn(null);
            setShowSheet(true);
          }}
        >
          <Text style={styles.fabText}>＋</Text>
        </TouchableOpacity>
      )}

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
          loadSummary();
        }}
        editData={selectedTxn}
        settings={settings}
      />
      <TransactionActionSheet
        isVisible={showActionSheet}
        transaction={actionTxn}
        onClose={() => {
          setShowActionSheet(false);
          setActionTxn(null);
        }}
        onEdit={txn => {
          setShowActionSheet(false);
          setActionTxn(null);

          setSelectedTxn(txn);
          setShowSheet(true);
        }}
        onCopy={txn => {
          setSelectedTxn({
            ...txn,
            id: null,
          });
          setShowSheet(true);
        }}
        onDeleted={() => {
          loadTxns();
          loadSummary();
        }}
      />
      <CategoryFilterSheet
        isVisible={showCategoryFilter}
        selectedCategories={selectedCategories}
        onSelectCategory={toggleCategory}
        onClose={() => setShowCategoryFilter(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    borderColor: COLORS.border,
    borderWidth: 1,
    backgroundColor: COLORS.background,
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
    backgroundColor: COLORS.primarySoft,
    elevation: 2,
  },
  activeText: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  filterBtnText: {
    color: '#000',
    fontWeight: '600',
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.primarySoft,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  th: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  txnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#fff',
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
    bottom: 130,
    right: 20,
    backgroundColor: COLORS.primary,
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
    backgroundColor: COLORS.primarySoft,
    paddingVertical: 14,
  },

  footerItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  footerLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },

  footerValue: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'right',
  },
  activeChip: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
    marginBottom: 6,
  },

  activeChipText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  chipWrap: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginHorizontal: 12,
  marginBottom: 6,
  alignItems: 'center',
},

categoryChip: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 8,
  paddingVertical: 6,
  borderRadius: 18,
  marginRight: 6,
  marginBottom: 6,
},

categoryIcon: {
  width: 20,
  height: 20,
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 6,
},

categoryText: {
  fontSize: 12,
  fontWeight: '600',
  marginRight: 4,
  color: COLORS.textPrimary,
},

clearAll: {
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 14,
  backgroundColor: COLORS.primarySoft,
},

clearAllText: {
  color: COLORS.primary,
  fontWeight: '600',
  fontSize: 12,
},
});
