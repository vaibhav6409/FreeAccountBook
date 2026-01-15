import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(false);
SQLite.enablePromise(true);

let db = null;

export const getDB = async () => {
  if (db) return db;

  db = await SQLite.openDatabase({
    name: 'accountbook.db',
    location: 'default',
  });

  return db;
};

export const initDB = async () => {
  const database = await getDB();

  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY NOT NULL,
      currency TEXT
    );
  `);

  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      opening_balance REAL DEFAULT 0,
      created_at TEXT
    );
  `);

  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT
    );
  `);

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

  // ---- CATEGORY MIGRATION ----
try {
  await database.executeSql(
    `ALTER TABLE categories ADD COLUMN icon TEXT`
  );
} catch (e) {
  // column already exists
}

try {
  await database.executeSql(
    `ALTER TABLE categories ADD COLUMN color TEXT`
  );
} catch (e) {
  // column already exists
}
try {
await db.executeSql(
  `ALTER TABLE accounts ADD COLUMN is_pinned INTEGER DEFAULT 0`
);
} catch (e) {
  // column already exists
}


await database.executeSql(
  `UPDATE categories 
   SET icon = 'cart', color = '#3498db'
   WHERE icon IS NULL OR color IS NULL`
);

// ---- SETTINGS MIGRATION ----
try {
  await database.executeSql(
    `ALTER TABLE settings ADD COLUMN date_format TEXT DEFAULT 'DD/MM/YYYY'`
  );
} catch (e) {}

try {
  await database.executeSql(
    `ALTER TABLE settings ADD COLUMN amount_labels TEXT DEFAULT 'IE'`
  );
} catch (e) {}

await database.executeSql(`
  INSERT OR IGNORE INTO settings (id, currency, date_format, amount_labels)
  VALUES (1, 'INR', 'DD/MM/YYYY', 'IE')
`);




};
