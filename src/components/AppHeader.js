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

export default function AppHeader({
  title,
  showBack = false,
  rightIcons = [], // [{ name, onPress }]
}) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* LEFT */}
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" size={30} color="#3478f6" />
          </TouchableOpacity>
        )}
      </View>

      {/* TITLE */}
      <View style={styles.center}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      </View>

      {/* RIGHT */}
      <View style={styles.right}>
        {rightIcons.map((icon, index) => (
          <TouchableOpacity
            key={index}
            onPress={icon.onPress}
            style={{ marginLeft: 14 }}
          >
            <Icon name={icon.name} size={22} color="#3478f6" />
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
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    backgroundColor: '#fff',
    elevation: 4,
  },

  left: {
    width: 40,
    alignItems: 'flex-start',
  },

  center: {
    flex: 1,
    alignItems: 'center',
  },

  right: {
    width: 80,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
});
