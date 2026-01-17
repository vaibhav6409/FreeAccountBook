import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { COLORS } from '../theme/colors';
import AppHeader from '../components/AppHeader';

export default function AdsPolicyScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader title="Advertising Policy" showBack />
      <ScrollView style={styles.container}>
        <Text style={styles.text}>
          This app displays advertisements to support development and
          maintenance.
        </Text>

        <Text style={styles.heading}>Ad Providers</Text>
        <Text style={styles.text}>
          We use third-party advertising services (such as Google Ad services)
          that may collect anonymized data to show relevant ads.
        </Text>

        <Text style={styles.heading}>Personalized Ads</Text>
        <Text style={styles.text}>
          Ads may be personalized based on your device and usage patterns. You
          can control ad personalization from your device settings.
        </Text>

        <Text style={styles.heading}>No Control Over Ads</Text>
        <Text style={styles.text}>
          We do not control the content of ads shown by third-party providers.
        </Text>

        <Text style={styles.heading}>Contact</Text>
        <Text style={styles.text}>
          For advertising concerns, contact: support@yourapp.com
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: COLORS.textPrimary,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 14,
    color: COLORS.textPrimary,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 6,
    color: COLORS.textSecondary,
  },
});
