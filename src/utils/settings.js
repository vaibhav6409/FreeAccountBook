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
