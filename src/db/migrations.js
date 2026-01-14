import { getDB } from './database';

export async function migrateSettingsTable() {
  const db = await getDB();

  // get existing columns
  const res = await db.executeSql(`PRAGMA table_info(settings);`);
  const columns = [];

  for (let i = 0; i < res[0].rows.length; i++) {
    columns.push(res[0].rows.item(i).name);
  }

  // add currency_code if missing
  if (!columns.includes('currency_code')) {
    await db.executeSql(
      `ALTER TABLE settings ADD COLUMN currency_code TEXT`
    );
  }

  // add currency_symbol if missing
  if (!columns.includes('currency_symbol')) {
    await db.executeSql(
      `ALTER TABLE settings ADD COLUMN currency_symbol TEXT`
    );
  }

  // migrate old currency column → new structure
  if (columns.includes('currency')) {
    const old = await db.executeSql(
      `SELECT currency FROM settings WHERE id=1`
    );

    if (old[0].rows.length > 0) {
      const symbol = old[0].rows.item(0).currency;

      const map = {
        '₹': 'INR',
        '$': 'USD',
        '€': 'EUR',
      };

      await db.executeSql(
        `UPDATE settings
         SET currency_symbol=?, currency_code=?
         WHERE id=1`,
        [symbol, map[symbol] || 'INR']
      );
    }
  }
}
