const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'ghost.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to the SQLite ghost database.');
    initDb();
  }
});

function initDb() {
  db.run(`
    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      originalName TEXT NOT NULL,
      size INTEGER NOT NULL,
      mimeType TEXT,
      expiresAt DATETIME NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

function saveFileMetadata(id, filename, originalName, size, mimeType) {
  return new Promise((resolve, reject) => {
    // Expires exactly 1 hour from now
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    db.run(
      `INSERT INTO files (id, filename, originalName, size, mimeType, expiresAt) VALUES (?, ?, ?, ?, ?, ?)`,
      [id, filename, originalName, size, mimeType, expiresAt],
      function (err) {
        if (err) reject(err);
        else resolve({ id, expiresAt });
      }
    );
  });
}

function getFileMetadata(id) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM files WHERE id = ?`, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function getExpiredFiles() {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    db.all(`SELECT * FROM files WHERE expiresAt <= ?`, [now], (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

function getAllFiles() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM files ORDER BY createdAt DESC`, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

function deleteFileMetadata(id) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM files WHERE id = ?`, [id], function (err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
}

module.exports = {
  db,
  saveFileMetadata,
  getFileMetadata,
  getExpiredFiles,
  getAllFiles,
  deleteFileMetadata
};
