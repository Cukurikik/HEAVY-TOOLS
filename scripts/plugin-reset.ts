import 'dotenv/config';
import { pgPool } from '../src/lib/db';

async function reset() {
  const client = await pgPool.connect();
  try {
    await client.query(`
      DROP TABLE IF EXISTS plugin_licenses CASCADE;
      DROP TABLE IF EXISTS plugin_reviews CASCADE;
      DROP TABLE IF EXISTS plugin_permissions CASCADE;
      DROP TABLE IF EXISTS installed_plugins CASCADE;
      DROP TABLE IF EXISTS plugin_versions CASCADE;
      DROP TABLE IF EXISTS plugins CASCADE;
    `);
    console.log('✅ Plugin tables dropped successfully.');
  } finally {
    client.release();
    await pgPool.end();
  }
}

reset();
