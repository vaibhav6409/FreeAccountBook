import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  TextInput,
  Platform,
} from 'react-native';
import { getDB } from '../db/database';
import { useFocusEffect } from '@react-navigation/native';
import AccountOptionsSheet from '../sheets/AccountOptionsSheet';
import AddAccountSheet from '../sheets/AddAccountSheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getCurrency } from '../utils/settings';
import { COLORS } from '../theme/colors';
import EmptyState from '../components/EmptyState';
import MyBannerAd from '../components/Ads/AdsComponents';

const HEADER_MAX_HEIGHT = 60;
const HEADER_MIN_HEIGHT = 60;

export default function AccountList({ navigation }) {
  const [accounts, setAccounts] = useState([]);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const [searchText, setSearchText] = useState('');
  const [searchMode, setSearchMode] = useState(false);
  const [query, setQuery] = useState('');
  const [currency, setCurrency] = useState({ currency_symbol: '₹' });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 40],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 40],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  useFocusEffect(
    useCallback(() => {
      getCurrency().then(setCurrency);
      loadAccounts();
    }, []),
  );
  const loadAccounts = async () => {
    setSelectedAccount(null);
    setShowAddSheet(false);
    const db = await getDB();
    const res = await db.executeSql(`
    SELECT a.id, a.name, a.is_pinned,
      IFNULL(SUM(CASE WHEN t.type='CR' THEN t.amount END),0) as income,
      IFNULL(SUM(CASE WHEN t.type='DR' THEN t.amount END),0) as expense
    FROM accounts a
    LEFT JOIN transactions t ON t.account_id = a.id
    GROUP BY a.id
    ORDER BY a.is_pinned DESC, a.name ASC
  `);

    const rows = [];
    for (let i = 0; i < res[0].rows.length; i++) {
      rows.push(res[0].rows.item(i));
    }
    setAccounts(rows);
  };
  const filteredAccounts = accounts.filter(a =>
    a.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  useEffect(() => {
    if (query.length >= 2) {
      setSearchText(query);
    } else {
      setSearchText('');
    }
  }, [query]);

  const sanitizeSearch = (value) => {
    let cleaned = value.replace(/^\s+/, '');

    cleaned = cleaned.replace(/\s{2,}/g, ' ');

    if (/^[^a-zA-Z0-9\s]+$/.test(cleaned)) {
      return '';
    }

    return cleaned;
  };

  const renderItem = ({ item }) => {
    const balance = item.income - item.expense;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.card}
        onPress={() =>
          navigation.navigate('Ledger', {
            accountId: item.id,
            name: item.name,
          })
        }
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleRow}>
            {item.is_pinned === 1 && (
              <View style={styles.pinBadge}>
                <Icon name="pin" size={12} color="#fff" />
              </View>
            )}
            <Text style={styles.title} numberOfLines={1}>
              {item.name}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              setSelectedAccount(item);
              setShowOptions(true);
            }}
          >
            <Icon name="dots-vertical" size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balance}>
            {currency.currency_symbol} {balance.toFixed(2)}
          </Text>
        </View>
        <View style={styles.footerRow}>
          <View style={styles.stat}>
            <Icon name="arrow-down-left" size={16} color={COLORS.income} />
            <Text style={styles.income}>
              {currency.currency_symbol} {item.income}
            </Text>
          </View>

          <View style={styles.stat}>
            <Icon name="arrow-up-right" size={16} color={COLORS.expense} />
            <Text style={styles.expense}>
              {currency.currency_symbol} {item.expense}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: COLORS.surface,
      }}
    >
      <Animated.View style={[styles.container, { height: headerHeight }]}>
        {!searchMode && (
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Text style={styles.topTitle}>Accounts</Text>
            <View style={{ flex: 1, flexDirection: 'column' }} />
            {!searchMode && (
              <TouchableOpacity onPress={() => setSearchMode(true)}>
                <Icon name="magnify" size={22} color={COLORS.primary} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Settings');
              }}
              style={{ marginLeft: 14 }}
            >
              <Icon name="cog-outline" size={22} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        )}
        {searchMode && (
          <Animated.View style={{}}>
            <View style={styles.searchBox}>
              <Icon name="magnify" size={18} color="#888" />
              <TextInput
                autoFocus
                placeholder="Search..."
                value={query}
                onChangeText={(t) => {
                  const cleaned = sanitizeSearch(t);
                  setQuery(cleaned);
                  setSearchText(cleaned);
                }}
                maxLength={20}
                style={styles.input}
              />

              <TouchableOpacity
                onPress={() => {
                  setQuery('');
                  setSearchMode(false);
                  setSearchText('');
                }}
              >
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </Animated.View>

      <Animated.FlatList
        data={filteredAccounts}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        keyExtractor={i => i.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          accounts.length == 0 ? (
            <EmptyState
              icon="wallet-outline"
              title="No accounts yet"
              description="Create your first account to start tracking income and expenses."
              buttonText="Create Account"
              onPress={() => setShowAddSheet(true)}
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

      {accounts&&accounts.length != 0 &&
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setSelectedAccount(null);
          setShowAddSheet(true);
        }}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
      }

      {/* <View style={{ alignItems: 'center', flex:1 }}>
        <MyBannerAd />
      </View> */}
      
      <AccountOptionsSheet
        isVisible={showOptions}
        account={selectedAccount}
        onClose={() => setShowOptions(false)}
        onEdit={() => {
          setShowOptions(false);
          setShowAddSheet(true);
        }}
        onRefresh={loadAccounts}
      />

      <AddAccountSheet
        isVisible={showAddSheet}
        editData={selectedAccount}
        onClose={() => {
          setSelectedAccount(null);
          setShowAddSheet(false);
        }}
        onSaved={loadAccounts}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: COLORS.textSecondary,
  },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  fabText: {
    color: '#fff',
    fontSize: 32,
  },
  container: {
    backgroundColor: COLORS.headerBg,
    justifyContent: 'flex-start',
    paddingHorizontal: 14,
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  topTitle: {
    fontSize: 34,
    fontWeight: '800',
    marginTop: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  cancel: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  input: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },

  card: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  pinBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flexShrink: 1,
  },

  balanceRow: {
    marginTop: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },

  balanceLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  balance: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 2,
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  income: {
    marginLeft: 6,
    color: COLORS.income,
    fontWeight: '600',
  },

  expense: {
    marginLeft: 6,
    color: COLORS.expense,
    fontWeight: '600',
  },
});
