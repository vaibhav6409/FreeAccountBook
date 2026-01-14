import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../theme/colors';

export default function AppHeader({
  title,
  showBack = false,
  rightIcons = [],
}) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconBtn}
          >
            <Icon name="chevron-left" size={28} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.center}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      </View>

      <View style={styles.right}>
        {rightIcons.map((icon, index) => (
          <TouchableOpacity
            key={index}
            onPress={icon.onPress}
            style={styles.iconBtn}
          >
            <Icon name={icon.name} size={22} color={COLORS.primary} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 44 : 14,
    paddingBottom: 14,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  left: {
    width: 44,
    alignItems: 'flex-start',
  },

  center: {
    flex: 1,
    alignItems: 'flex-start',
  },

  right: {
    minWidth: 44,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },

  iconBtn: {
    padding: 6,
    marginLeft: 8,
    borderRadius: 20,
  },
});
