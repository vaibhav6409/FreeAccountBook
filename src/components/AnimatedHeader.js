import React, { useState } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const HEADER_MAX_HEIGHT = 100;
const HEADER_MIN_HEIGHT = 56;

export default function AnimatedHeader({
  title,
  scrollY,
  showBack = false,
  onSearch,
  onMore,
}) {
  const navigation = useNavigation();
  const [searchMode, setSearchMode] = useState(false);
  const [query, setQuery] = useState('');

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 40],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.container, { height: headerHeight }]}>
      {/* TOP BAR */}
      <View style={styles.topRow}>
        {showBack && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" size={30} color="#3478f6" />
          </TouchableOpacity>
        )}

        <View style={{ flex: 1 }} />

        {!searchMode && (
          <>
            <TouchableOpacity onPress={() => setSearchMode(true)}>
              <Icon name="magnify" size={22} color="#3478f6" />
            </TouchableOpacity>

            <TouchableOpacity onPress={onMore} style={{ marginLeft: 14 }}>
              <Icon name="dots-horizontal" size={22} color="#3478f6" />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* TITLE / SEARCH */}
      <Animated.View style={{ opacity: titleOpacity }}>
        {!searchMode ? (
          <Text style={styles.title}>{title}</Text>
        ) : (
          <View style={styles.searchBox}>
            <Icon name="magnify" size={18} color="#888" />
            <TextInput
              autoFocus
              placeholder="Search..."
              value={query}
              onChangeText={(t) => {
                setQuery(t);
                onSearch?.(t);
              }}
              style={styles.input}
            />
            <TouchableOpacity
              onPress={() => {
                setQuery('');
                setSearchMode(false);
                onSearch?.('');
              }}
            >
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
    paddingHorizontal: 14,
    elevation: 4,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
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
