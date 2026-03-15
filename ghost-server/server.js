const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure uploads dir exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

// Middleware
app.use(cors());
app.use(express.json());

// Set up Multer for high-speed file physical storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  }
});
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB max 
});

// ==========================================
// API Endpoints
// ==========================================

// Upload Endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    // Extract the uuid from the auto-generated filename
    const id = path.parse(file.filename).name;

    const meta = await db.saveFileMetadata(
      id,
      file.filename,
      file.originalname,
      file.size,
      file.mimetype
    );

    res.status(201).json({
      message: 'File completely uploaded and tracked.',
      id: meta.id,
      expiresAt: meta.expiresAt,
      downloadUrl: `/api/download/${meta.id}`
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Failed to process file' });
  }
});

// Download Endpoint
app.get('/api/download/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const meta = await db.getFileMetadata(id);

    if (!meta) {
      return res.status(404).json({ error: 'File not found or has expired.' });
    }

    const filePath = path.join(UPLOADS_DIR, meta.filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Physical file is corrupt or lost.' });
    }

    // Force download headers
    res.download(filePath, meta.originalName);
  } catch (error) {
    console.error('Download Error:', error);
    res.status(500).json({ error: 'Server error retrieving file.' });
  }
});

// File Info Endpoint
app.get('/api/info/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const meta = await db.getFileMetadata(id);
    if (!meta) return res.status(404).json({ error: 'File not found or expired.' });
    
    // Add time remaining
    const remainingMs = new Date(meta.expiresAt).getTime() - Date.now();
    res.json({
      ...meta,
      remainingMinutes: Math.max(0, Math.round(remainingMs / 60000))
    });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// CDN Manager - Get All Files Endpoint
app.get('/api/files', async (req, res) => {
  try {
    const files = await db.getAllFiles();
    
    // Enhance with time remaining
    const enhancedFiles = files.map(meta => {
      const remainingMs = new Date(meta.expiresAt).getTime() - Date.now();
      return {
        ...meta,
        remainingMinutes: Math.max(0, Math.round(remainingMs / 60000))
      };
    });
    
    res.json({ files: enhancedFiles });
  } catch (error) {
    console.error('Fetch All Files Error:', error);
    res.status(500).json({ error: 'Server error retrieving files.' });
  }
});

// CDN Manager - Purge File Endpoint
app.delete('/api/file/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const meta = await db.getFileMetadata(id);
    
    if (!meta) {
      return res.status(404).json({ error: 'File not found or already deleted.' });
    }

    const filePath = path.join(UPLOADS_DIR, meta.filename);
    
    // 1. Destroy physical file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`[CDN MANAGER PURGED] Physical File: ${meta.filename}`);
    }
    
    // 2. Erase from Database
    await db.deleteFileMetadata(id);
    console.log(`[CDN MANAGER ERASED] Database Record: ${id}`);
    
    res.json({ message: 'File purged successfully.' });
  } catch (error) {
    console.error('Delete File Error:', error);
    res.status(500).json({ error: 'Server error deleting file.' });
  }
});

// ==========================================
// The Executioner (Cron Job)
// ==========================================
// Runs every 5 minutes to sweep and destroy expired files
cron.schedule('*/5 * * * *', async () => {
  console.log('[CRON] Sweeping for expired ghost files...');
  try {
    const expiredFiles = await db.getExpiredFiles();
    
    for (const file of expiredFiles) {
      const filePath = path.join(UPLOADS_DIR, file.filename);
      // 1. Destroy physical file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`[DELETED] Physical File: ${file.filename}`);
      }
      
      // 2. Erase from Database
      await db.deleteFileMetadata(file.id);
      console.log(`[ERASED] Database Record: ${file.id}`);
    }
  } catch (err) {
    console.error('[CRON ERROR]', err);
  }
});

app.listen(PORT, () => {
  console.log(`[Ghost Server] Running strictly on http://localhost:${PORT}`);
  console.log(`[Ghost Server] Files strictly auto-delete after 1 hour.`);
});
