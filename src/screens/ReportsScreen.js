import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Modal,
} from 'react-native';
import { COLORS } from '../theme/colors';
import AppHeader from '../components/AppHeader';
import ReportHeader from '../components/reports/ReportHeader';
import ReportTabs from '../components/reports/ReportTabs';
import ReportSummaryCard from '../components/reports/ReportSummaryCard';
import CategoryPieChart from '../components/reports/CategoryPieChart';
import CategoryList from '../components/reports/CategoryList';
import MonthlyTable from '../components/reports/MonthlyTable';
import CalendarGrid from '../components/reports/CalendarGrid';
import AccountPickerSheet from '../sheets/AccountPickerSheet';
import {
  getCurrency,
  getAccountList,
  getCategoryReport,
  getDailyReport,
  getOverallReport,
  getMonthlyReport,
} from '../utils/settings';

export default function ReportsScreen() {
  const [mode, setMode] = useState('MONTHLY'); // MONTHLY | YEARLY | ALL
  const [accountId, setAccountId] = useState(null); // null = All
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [type, setType] = useState('DR'); // DR | CR
  const [currency, setCurrency] = useState({ currency_symbol: '₹' });
  const [dailyData, setDailyData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  const [monthlyData, setMonthlyData] = useState([]);

  const [categories, setCategories] = useState([]);
  const [reportType, setReportType] = useState('DR'); // DR / CR
  const [accounts, setAccounts] = useState([]);
  const [showAccountPicker, setShowAccountPicker] = useState(false);

  useEffect(() => {
    getAccountList().then(setAccounts);
  }, []);
  useEffect(() => {
    getCategoryReport({
      accountId,
      year: mode !== 'ALL' ? year : null,
      month: mode === 'MONTHLY' ? month : null,
      type: reportType,
    }).then(setCategories);

    getOverallReport({
      accountId,
    }).then(setSummary);
  }, [mode, accountId, year, month, reportType]);

  useEffect(() => {
    getMonthlyReport({
      year,
      accountId,
    }).then(setMonthlyData);
  }, [year, accountId]);

  useEffect(() => {
    getCurrency().then(setCurrency);
  }, []);

  useEffect(() => {
    getDailyReport({
      year,
      month,
      accountId,
    }).then(setDailyData);
  }, [year, month, accountId]);

  const dataMap = dailyData.reduce((acc, item) => {
    acc[item.date] = {
      income: item.income || 0,
      expense: item.expense || 0,
    };
    return acc;
  }, {});

  const onSelectDay = dateKey => {
    setSelectedDate(dateKey);
  };

  const onPrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
  };

  const onNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
  };
  const onPrevYear = () => setYear(y => y - 1);
  const onNextYear = () => setYear(y => y + 1);

  const calendarData = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();

    const arr = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) arr.push(i);
    return arr;
  }, [year, month]);

  return (
    <View style={styles.container}>
      <AppHeader showBack title="Reports" />
      <ReportHeader
        accountId={accountId}
        accounts={accounts}
        onOpenPicker={() => setShowAccountPicker(true)}
      />
      <ReportTabs
        mode={mode}
        onChange={m => {
          setMode(m);
          setYear(new Date().getFullYear());
          setMonth(new Date().getMonth() + 1);
        }}
      />
      {mode === 'ALL' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <ReportSummaryCard summary={summary} />
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>Categories</Text>

              <TouchableOpacity
                onPress={() => setReportType(reportType === 'DR' ? 'CR' : 'DR')}
                style={[
                  styles.toggle,
                  {
                    backgroundColor:
                      reportType === 'DR'
                        ? COLORS.expenseSoft
                        : COLORS.incomeSoft,
                  },
                ]}
              >
                <Text
                  style={{
                    color: reportType === 'DR' ? COLORS.expense : COLORS.income,
                  }}
                >
                  {reportType === 'DR' ? 'Expense' : 'Income'}
                </Text>
              </TouchableOpacity>
            </View>

            <CategoryPieChart data={categories} type={reportType} />
            <CategoryList data={categories} />
          </View>
        </ScrollView>
      )}
      {mode === 'YEARLY' && (
        <MonthlyTable
          year={year}
          data={monthlyData}
          currency={currency.currency_symbol}
          onPrev={onPrevYear}
          onNext={onNextYear}
        />
      )}
      {mode === 'MONTHLY' && (
        <CalendarGrid
          year={year}
          month={month}
          data={calendarData}
          dataMap={dataMap}
          selectedDate={selectedDate}
          onSelectDay={onSelectDay}
          onPrev={onPrevMonth}
          onNext={onNextMonth}
        />
      )}

      <AccountPickerSheet
        isVisible={showAccountPicker}
        accounts={accounts}
        selectedAccountId={accountId}
        onSelectAccount={setAccountId}
        onClose={() => setShowAccountPicker(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  card: {
    backgroundColor: COLORS.surface,
    margin: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },

  toggle: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  accountItem: {
    paddingVertical: 14,
  },
  accountName: {
    fontSize: 16,
    color: COLORS.text,
  },
});
