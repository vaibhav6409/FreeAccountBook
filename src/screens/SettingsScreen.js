import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../components/AppHeader';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../theme/colors';
import { getAppSettings } from '../utils/settings';
import DeviceInfo from 'react-native-device-info';
import MyBannerAd from '../components/Ads/AdsComponents';

export default function SettingsScreen({ navigation }) {
  const [currency, setCurrency] = useState('INR');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [amountLabels, setAmountLabels] = useState('IE');
  const [appVersion, setAppVersion] = useState('');
  const [buildNumber, setBuildNumber] = useState('');

  useFocusEffect(
    useCallback(() => {
      getAppSettings().then(s => {
        setCurrency(s.currency_code);
        setDateFormat(s.date_format);
        setAmountLabels(s.amount_labels);
      });
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      setAppVersion(DeviceInfo.getVersion());
      setBuildNumber(DeviceInfo.getBuildNumber());
    }, []),
  );

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <AppHeader title="Settings" showBack />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <SettingItem
            icon="currency-inr"
            title="Change Currency"
            value={currency}
            onPress={() => navigation.navigate('Currency')}
          />

          <Divider />
          <SettingItem
            icon="calendar"
            title="Date Format"
            value={dateFormat}
            onPress={() => navigation.navigate('DateFormat')}
          />

          <Divider />

          <SettingItem
            icon="swap-vertical"
            title="Amount Labels"
            value={amountLabels === 'IE' ? 'Income / Expense' : 'Credit / Debit'}
            onPress={() => navigation.navigate('AmountLabels')}
          />

          <Divider />

          <SettingItem
            icon="file-chart-outline"
            title="Reports"
            onPress={() => navigation.navigate('Reports')}
          />

          <Divider />

          <SettingItem
            icon="shape-outline"
            title="Categories"
            onPress={() => navigation.navigate('Categories')}
          />
        </View>

        <View style={{ alignItems: 'center', flex:1 }}>
          <MyBannerAd />
        </View>

        <View style={[styles.card, { marginTop: 20 }]}>
          <SettingItem
            icon="shield-lock-outline"
            title="Privacy Policy"
            onPress={() => navigation.navigate('PrivacyPolicy')}
          />

          <Divider />

          <SettingItem
            icon="advertisements"
            title="Ads Policy"
            onPress={() => navigation.navigate('AdsPolicy')}
          />
        </View>
        <View style={{ height: 30 }} />

        <View style={styles.appInfo}>
          <Text style={styles.appName}>Free Account Book</Text>
          <Text style={styles.version}>
            Version {appVersion || '1.0.0'} ({buildNumber || '1'})
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function SettingItem({ icon, title, value, onPress }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={styles.left}>
        <View style={styles.iconWrap}>
          <Icon name={icon} size={20} color={COLORS.primary} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.right}>
        {value && <Text style={styles.value}>{value}</Text>}
        <Icon name="chevron-right" size={22} color={COLORS.muted} />
      </View>
    </TouchableOpacity>
  );
}

const Divider = () => <View style={styles.divider} />;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingVertical: 6,
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  title: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
  },

  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  value: {
    color: COLORS.primary,
    marginRight: 6,
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 64,
  },

  appInfo: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },

  appName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },

  version: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
  },
});
