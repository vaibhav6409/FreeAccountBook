import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(false);
SQLite.enablePromise(true);

let db = null;

/**
 * Open / Get DB instance (singleton)
 */
export const getDB = async () => {
  if (db) return db;

  db = await SQLite.openDatabase({
    name: 'accountbook.db',
    location: 'default',
  });

  return db;
};

/**
 * Initialize DB with base tables
 */
export const initDB = async () => {
  const database = await getDB();

  // ---------------- SETTINGS ----------------
  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY NOT NULL,
      currency TEXT,
      date_format TEXT DEFAULT 'DD/MM/YYYY',
      amount_labels TEXT DEFAULT 'IE',
      currency_code TEXT,
      currency_symbol TEXT
    );
  `);

  // ---------------- ACCOUNTS ----------------
  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      opening_balance REAL DEFAULT 0,
      created_at TEXT,
      is_pinned INTEGER DEFAULT 0
    );
  `);

  // ---------------- CATEGORIES ----------------
  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT,
      icon TEXT,
      color TEXT
    );
  `);

  // ---------------- TRANSACTIONS ----------------
  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_id INTEGER,
      amount REAL,
      type TEXT,
      date TEXT,
      note TEXT,
      category_id INTEGER
    );
  `);

  // ---------------- DEFAULT SETTINGS ROW ----------------
  await database.executeSql(`
    INSERT OR IGNORE INTO settings
    (id, currency, date_format, amount_labels, currency_code, currency_symbol)
    VALUES (1, 'INR', 'DD/MM/YYYY', 'IE', 'INR', '₹')
  `);

  // ---------------- CATEGORY DEFAULT UPDATE ----------------
  await database.executeSql(`
    UPDATE categories
    SET icon='cart', color='#3498db'
    WHERE icon IS NULL OR color IS NULL
  `);
};

/**
 * Settings migration (for very old users)
 */
export const migrateSettingsTable = async () => {
  const database = await getDB();

  const res = await database.executeSql(`PRAGMA table_info(settings);`);
  const columns = [];

  for (let i = 0; i < res[0].rows.length; i++) {
    columns.push(res[0].rows.item(i).name);
  }

  if (!columns.includes('currency_code')) {
    await database.executeSql(
      `ALTER TABLE settings ADD COLUMN currency_code TEXT`
    );
  }

  if (!columns.includes('currency_symbol')) {
    await database.executeSql(
      `ALTER TABLE settings ADD COLUMN currency_symbol TEXT`
    );
  }

  // migrate old currency → new structure
  if (columns.includes('currency')) {
    const old = await database.executeSql(
      `SELECT currency FROM settings WHERE id=1`
    );

    if (old[0].rows.length > 0) {
      const value = old[0].rows.item(0).currency;

      const map = {
        '₹': { code: 'INR', symbol: '₹' },
        '$': { code: 'USD', symbol: '$' },
        '€': { code: 'EUR', symbol: '€' },
        'INR': { code: 'INR', symbol: '₹' },
      };

      const resolved = map[value] || map['INR'];

      await database.executeSql(
        `UPDATE settings
         SET currency_code=?, currency_symbol=?
         WHERE id=1`,
        [resolved.code, resolved.symbol]
      );
    }
  }
};
