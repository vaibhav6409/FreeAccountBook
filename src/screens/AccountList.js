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
import AccountOptionsSheet from './AccountOptionsSheet';
import AddAccountSheet from './AddAccountSheet';
import AppHeader from '../components/AppHeader';
import AnimatedHeader from '../components/AnimatedHeader';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import Animated, { FadeInDown } from 'react-native-reanimated';
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

  // useEffect(() => {
  //   loadAccounts();
  // }, [navigation]);

  useFocusEffect(
    useCallback(() => {
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

  const renderItem = ({ item }) => {
    const balance = item.income - item.expense;

    return (
      // <Animated.View entering={FadeInDown.delay(index * 50)}></Animated.View>
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('Ledger', {
            accountId: item.id,
            name: item.name,
          })
        }
      >
        {/* HEADER */}
        <View style={styles.cardHeader}>
          
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {item.is_pinned === 1 && (
              <Text style={{ marginRight: 6 }}>📌</Text>
            )}
            <Text style={styles.title}>{item.name}</Text>
          </View>

          <TouchableOpacity
            style={{ padding: 5 }}
            onPress={() => {
              setSelectedAccount(item);
              setShowOptions(true);
            }}
          >
            <Text style={{ fontSize: 22 }}>⋮</Text>
          </TouchableOpacity>
        </View>

        {/* BODY */}
        <View style={styles.row}>
          <View>
            <Text style={styles.balance}>₹ {balance.toFixed(2)}</Text>
            <Text style={styles.label}>Balance</Text>
          </View>

          <View>
            <Text style={styles.income}>₹ {item.income}</Text>
            <Text style={styles.expense}>₹ {item.expense}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'flex-start', backgroundColor: '#f5f5f5' }}>
      <Animated.View style={[styles.container, { height: headerHeight }]}>
        {!searchMode && (
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Text style={styles.topTitle}>Accounts</Text>
          <View style={{ flex: 1, flexDirection: 'column' }} /> 
          {!searchMode && (
          <TouchableOpacity onPress={() => setSearchMode(true)}>
            <Icon name="magnify" size={22} color="#3478f6" />
          </TouchableOpacity>)}
          <TouchableOpacity onPress={() => {navigation.navigate('Settings') }} style={{ marginLeft: 14 }}>
            <Icon name="cog-outline" size={22} color="#3478f6" />
          </TouchableOpacity>
        </View>)}
        {searchMode&&(
          <Animated.View style={{ opacity: titleOpacity }}>
        <View style={styles.searchBox}>
          <Icon name="magnify" size={18} color="#888" />
          <TextInput
            autoFocus
            placeholder="Search..."
            value={query}
            onChangeText={t => {
              setQuery(t);
              setSearchText(t);
            }}
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
         </Animated.View>)}
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
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Animated.Text
            // entering={FadeInDown}
            style={{ textAlign: 'center', marginTop: 60, color: '#999' }}
          >
            No accounts found
          </Animated.Text>
        }
      />

      {/* Floating Add Button */}
      {/* <Animated.View entering={FadeInDown.delay(300)}></Animated.View> */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setSelectedAccount(null);
          setShowAddSheet(true);
        }}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  balance: { color: 'green', fontSize: 22, fontWeight: '700' },
  label: { color: '#777' },
  income: { color: 'green', fontSize: 16 },
  expense: { color: 'red', fontSize: 16 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#3478f6',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: { color: '#fff', fontSize: 32 },
  container: {
    backgroundColor: '#fff',
    // paddingTop: Platform.OS === 'ios' ? 40 : 10,
    justifyContent:'flex-start',
    paddingHorizontal: 14,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topTitle: {
    fontSize: 34,
    fontWeight: '800',
    marginTop: 10,
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
  },

  input: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },

  cancel: {
    color: '#3478f6',
    fontWeight: '600',
  },
});
