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
import { COLORS } from '../theme/colors';

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

  const headerHeight = scrollY?.interpolate({
    inputRange: [0, 60],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const sanitizeTransactionSearch = (value) => {
    if (!value) return '';
    let cleaned = value.replace(/^\s+/, '');
    cleaned = cleaned.replace(/\s{2,}/g, ' ');
    if (/^[^a-zA-Z0-9.\s]+$/.test(cleaned)) {
      return '';
    }
    return cleaned;
  };

  return (
    <Animated.View
      style={[
        styles.container,
      ]}
    >
      <View style={styles.topRow}>
        {showBack && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" size={30} color={COLORS.primary} />
          </TouchableOpacity>
        )}

        <View style={styles.center}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        </View>

        {!searchMode && (
          <TouchableOpacity onPress={() => setSearchMode(true)}>
            <Icon name="magnify" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        )}

        {onMore && (
          <TouchableOpacity onPress={onMore} style={{ marginLeft: 14 }}>
              <Icon name="filter-variant" size={22} color={COLORS.primary} />
          </TouchableOpacity>
          )}
      </View>

      {searchMode && (
        <View style={styles.searchBox}>
          <Icon name="magnify" size={18} color={COLORS.iconMuted} />

          <TextInput
            autoFocus
            placeholder="Search..."
            placeholderTextColor={COLORS.textSecondary}
            value={query}
            onChangeText={(t) => {
              const cleaned = sanitizeTransactionSearch(t);
              setQuery(cleaned);
              onSearch?.(cleaned);
            }}
            maxLength={20}
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
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.headerBg,
    paddingTop: Platform.OS === 'ios' ? 44 : 12,
    paddingBottom: 5,
    paddingHorizontal: 14,
    elevation: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  center: {
    flex: 1,
    marginLeft: 8,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 16,
    color: COLORS.textPrimary,
  },

  cancel: {
    color: COLORS.primary,
    fontWeight: '600',
    paddingLeft: 6,
  },
});
