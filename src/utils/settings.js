import { getDB } from '../db/database';

export const getCurrency = async () => {
  const db = await getDB();
  const res = await db.executeSql(
    'SELECT currency_code, currency_symbol FROM settings WHERE id=1'
  );

  if (res[0].rows.length === 0) {
    return { currency_code: 'INR', currency_symbol: '₹' };
  }

  return res[0].rows.item(0);
};

export async function getAppSettings() {
  const db = await getDB();
  const res = await db.executeSql(`SELECT * FROM settings WHERE id=1`);
  return res[0].rows.item(0);
}

export async function getCategoryReport({
  accountId = null,
  year = null,
  month = null,
  type = 'DR', // DR = Expense, CR = Income
}) {
  const db = await getDB();

  let where = `t.type='${type}'`;
  const params = [];

  if (accountId) {
    where += ` AND t.account_id=?`;
    params.push(accountId);
  }

  if (year) {
    where += ` AND strftime('%Y', t.date)=?`;
    params.push(String(year));
  }

  if (month) {
    where += ` AND strftime('%m', t.date)=?`;
    params.push(String(month).padStart(2, '0'));
  }

  const res = await db.executeSql(
    `
    SELECT 
      c.id,
      c.name,
      c.icon,
      c.color,
      SUM(t.amount) as total
    FROM transactions t
    LEFT JOIN categories c ON c.id = t.category_id
    WHERE ${where}
    GROUP BY c.id
    ORDER BY total DESC
    `,
    params,
  );

  const rows = [];
  for (let i = 0; i < res[0].rows.length; i++) {
    rows.push(res[0].rows.item(i));
  }

  return rows;
}

export async function getMonthlyReport({ year, accountId = null }) {
  const db = await getDB();

  let where = `strftime('%Y', t.date)=?`;
  const params = [String(year)];

  if (accountId) {
    where += ` AND t.account_id=?`;
    params.push(accountId);
  }

  const res = await db.executeSql(
    `
    SELECT 
      strftime('%m', t.date) AS month,
      SUM(CASE WHEN t.type='CR' THEN t.amount ELSE 0 END) AS income,
      SUM(CASE WHEN t.type='DR' THEN t.amount ELSE 0 END) AS expense
    FROM transactions t
    WHERE ${where}
    GROUP BY month
    `,
    params,
  );

  const map = {};
  for (let i = 0; i < res[0].rows.length; i++) {
    const r = res[0].rows.item(i);
    map[r.month] = r;
  }

  // Ensure Jan–Dec always present
  return Array.from({ length: 12 }, (_, i) => {
    const m = String(i + 1).padStart(2, '0');
    const row = map[m] || { income: 0, expense: 0 };
    return {
      month: i,
      income: Number(row.income || 0),
      expense: Number(row.expense || 0),
      balance: Number(row.income || 0) - Number(row.expense || 0),
    };
  });
}

export async function getOverallReport({ accountId = null }) {
  const db = await getDB();

  let where = ``;
  const params = [];

  if (accountId) {
    where += `WHERE t.account_id=?`;
    params.push(accountId);
  }

  const res = await db.executeSql(
    `
    SELECT 
      SUM(CASE WHEN t.type='CR' THEN t.amount ELSE 0 END) AS income,
      SUM(CASE WHEN t.type='DR' THEN t.amount ELSE 0 END) AS expense
    FROM transactions t
    ${where}
    `,
    params,
  );

  const row = res[0].rows.item(0);

  const income = row.income || 0;
  const expense = row.expense || 0;

  // Ensure Jan–Dec always present
  return {
    income: Number(income || 0),
    expense: Number(expense || 0),
    balance: Number(income || 0) - Number(expense || 0),
  };
}

export async function getDailyReport({ year, month, accountId }) {
  const db = await getDB();

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

  let where = ``;
  const params = [startDate, endDate];

  if (accountId) {
    where += ` AND (? IS NULL OR account_id = ?)`;
    params.push(accountId);
    params.push(accountId);
  }

  const [result] = await db.executeSql(
    `
    SELECT 
      DATE(date) as date,
      SUM(CASE WHEN type = 'CR' THEN amount ELSE 0 END) as income,
      SUM(CASE WHEN type = 'DR' THEN amount ELSE 0 END) as expense
    FROM transactions
    WHERE date BETWEEN ? AND ?
      ${where}
    GROUP BY DATE(date)
    `,
    params,
  );

  return result.rows.raw().map(r => ({
    date: r.date,
    income: r.income || 0,
    expense: r.expense || 0,
  }));
}

export async function getAccountList() {
  const db = await getDB();

  const [result] = await db.executeSql(
    `
    SELECT 
      id,
      name
    FROM accounts
    ORDER BY name ASC
    `,
  );

  return result.rows.raw().map(row => ({
    id: row.id,
    name: row.name,
  }));
}
