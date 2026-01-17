import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../theme/colors';

export default function EmptyState({
  icon = 'information-outline',
  title = 'Nothing here',
  description = '',
  buttonText = 'Add',
  onPress,
  showButton = true,
}) {
  return (
    <View style={styles.container}>
      <Icon name={icon} size={72} color={COLORS.textSecondary} />

      <Text style={styles.title}>{title}</Text>

      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}

      {showButton && onPress && (
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 6,
  },

  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },

  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 30,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
