import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppHeader from '../components/AppHeader';

export default function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#f4f6fb' }}>
      <AppHeader title="Settings" />

      <ScrollView contentContainerStyle={styles.container}>
        {/* SETTINGS CARD */}
        <View style={styles.card}>
          <SettingItem
            icon="currency-inr"
            title="Change Currency"
            value="INR"
            onPress={() => navigation.navigate('Currency')}
          />

          <Divider />

          <SettingItem
            icon="shape-outline"
            title="Categories"
            onPress={() => navigation.navigate('Categories')}
          />
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------- ROW COMPONENT ---------- */
function SettingItem({ icon, title, value, onPress }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={styles.left}>
        <View style={styles.iconWrap}>
          <Icon name={icon} size={20} color="#3478f6" />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.right}>
        {value && <Text style={styles.value}>{value}</Text>}
        <Icon name="chevron-right" size={22} color="#999" />
      </View>
    </TouchableOpacity>
  );
}

const Divider = () => <View style={styles.divider} />;

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 6,
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
    backgroundColor: '#eaf1ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  title: {
    fontSize: 15,
    fontWeight: '500',
  },

  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  value: {
    color: '#3478f6',
    marginRight: 6,
    fontWeight: '500',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginLeft: 64,
  },
});
