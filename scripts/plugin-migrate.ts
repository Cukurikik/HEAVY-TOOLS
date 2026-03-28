import 'dotenv/config';
import { readFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { pgPool } from '../src/lib/db'; // adjust path to where db.ts is

// Fase 2: Task 12 - Custom Migration Runner
async function runMigrations() {
  const migrationsDir = resolve(process.cwd(), 'migrations');
  console.log(`🔍 Memulai Migrasi Custom Plugin Engine di: ${migrationsDir}`);

  try {
    const files = readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Memastikan urutan 001_, 002_, dst

    const client = await pgPool.connect();

    try {
      await client.query('BEGIN'); // Start transaction
      
      for (const file of files) {
        console.log(`⏳ Mengeksekusi migrasi: ${file}...`);
        const filePath = join(migrationsDir, file);
        const sql = readFileSync(filePath, 'utf8');
        
        await client.query(sql);
        console.log(`✅ ${file} berhasil dieksekusi.`);
      }

      await client.query('COMMIT');
      console.log('🎉 Semua migrasi berhasil disimpan ke database!');
    } catch (err: any) {
      await client.query('ROLLBACK');
      console.error('❌ Terjadi kesalahan saat migrasi. Transaksi di-ROLLBACK.', err.message);
      throw err;
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('❌ Gagal membaca folder migrasi atau koneksi DB:', error.message);
  } finally {
    await pgPool.end(); // Tutup pool setelah selesai
  }
}

runMigrations();
