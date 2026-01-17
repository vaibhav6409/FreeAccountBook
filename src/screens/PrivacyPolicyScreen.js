import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { COLORS } from '../theme/colors';
import AppHeader from '../components/AppHeader';

export default function PrivacyPolicyScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader title="Privacy Policy" showBack />
      <ScrollView style={styles.container}>
        <Text style={styles.text}>
          We respect your privacy and are committed to protecting your personal
          data.
        </Text>

        <Text style={styles.heading}>Information We Collect</Text>
        <Text style={styles.text}>
          • Account names and transaction data entered by you{'\n'}• App usage
          data for improving app performance{'\n'}• Device information
          (non-personal)
        </Text>

        <Text style={styles.heading}>How We Use Your Data</Text>
        <Text style={styles.text}>
          • To manage accounts and transactions{'\n'}• To improve app features
          and stability{'\n'}• To display relevant advertisements
        </Text>

        <Text style={styles.heading}>Data Storage</Text>
        <Text style={styles.text}>
          Your data is stored locally on your device. We do not sell or share
          your personal data with third parties.
        </Text>

        <Text style={styles.heading}>Contact</Text>
        <Text style={styles.text}>
          If you have questions, contact us at: support@yourapp.com
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
