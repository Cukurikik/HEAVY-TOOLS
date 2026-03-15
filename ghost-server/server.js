const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const prisma = new PrismaClient();

// Ensure uploads dir exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
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
// 1. PUBLIC API (Gateway)
// ==========================================

// Upload Endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { jobType, payload } = req.body;
    const file = req.file;
    const id = path.parse(file.filename).name;
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Create File Record and optional Job
    const fileRecord = await prisma.file.create({
      data: {
        id,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        expiresAt
      }
    });

    let jobRecord = null;
    if (jobType) {
      jobRecord = await prisma.job.create({
        data: {
          fileId: id,
          type: jobType,
          payload: payload ? JSON.parse(payload) : {},
        }
      });
    }

    res.status(201).json({
      message: 'File completely uploaded and tracked.',
      file: fileRecord,
      job: jobRecord,
      downloadUrl: `/api/download/${id}`
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
    const meta = await prisma.file.findUnique({ where: { id } });

    if (!meta) {
      return res.status(404).json({ error: 'File not found or has expired.' });
    }

    const filePath = path.join(UPLOADS_DIR, meta.filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Physical file is corrupt or lost.' });
    }

    res.download(filePath, meta.originalName);
  } catch (error) {
    console.error('Download Error:', error);
    res.status(500).json({ error: 'Server error retrieving file.' });
  }
});

// Info Endpoint
app.get('/api/info/:id', async (req, res) => {
  try {
    const meta = await prisma.file.findUnique({ 
      where: { id: req.params.id },
      include: { jobs: true }
    });
    if (!meta) return res.status(404).json({ error: 'File not found or expired.' });
    
    const remainingMs = meta.expiresAt.getTime() - Date.now();
    res.json({
      ...meta,
      remainingMinutes: Math.max(0, Math.round(remainingMs / 60000))
    });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================================
// 2. OMNI MESSAGE BROKER (Internal Worker API)
// ==========================================

// Worker attempts to pop exactly ONE job Atomically
app.post('/internal/jobs/pop', async (req, res) => {
  try {
    const { workerId, supportedTypes } = req.body; // e.g., ["VIDEO_CONVERT"]
    
    if (!workerId || !supportedTypes || !supportedTypes.length) {
      return res.status(400).json({ error: 'Worker ID and supportedTypes required.' });
    }

    const typesStr = supportedTypes.map(t => `'${t}'`).join(',');

    // Atomic Checkout using SELECT FOR UPDATE SKIP LOCKED
    // This strictly prevents other workers from picking up the exact same job.
    const poppedJobs = await prisma.$queryRawUnsafe(`
      UPDATE "Job"
      SET 
        status = 'LOCKED',
        "workerId" = $1,
        "lockedAt" = NOW()
      WHERE id = (
        SELECT id FROM "Job"
        WHERE status = 'PENDING' AND type IN (${typesStr})
        ORDER BY "createdAt" ASC
        FOR UPDATE SKIP LOCKED
        LIMIT 1
      )
      RETURNING *;
    `, workerId);

    if (poppedJobs && poppedJobs.length > 0) {
      return res.json({ job: poppedJobs[0] });
    } else {
      return res.json({ job: null, message: 'No pending jobs.' });
    }
  } catch (error) {
    console.error('[BROKER POP ERROR]', error);
    res.status(500).json({ error: 'Broker error.' });
  }
});

// Worker updates the status of the job
app.post('/internal/jobs/:id/status', async (req, res) => {
  try {
    const jobId = req.params.id;
    const { status, errorOutput } = req.body;

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ error: 'Job not found.' });

    if (status === 'SUCCESS') {
      await prisma.job.update({
        where: { id: jobId },
        data: { status: 'SUCCESS', completedAt: new Date() }
      });
      return res.json({ success: true });
    }

    if (status === 'FAILED') {
      const newRetries = job.retryCount + 1;
      
      if (newRetries >= 3) {
        // Move to DLQ (Dead Letter Queue)
        await prisma.$transaction([
          prisma.job.update({
            where: { id: jobId },
            data: { status: 'FAILED', retryCount: newRetries, error: errorOutput }
          }),
          prisma.deadLetterQueue.create({
            data: {
              jobId: job.id,
              fileId: job.fileId,
              type: job.type,
              payload: job.payload,
              lastError: errorOutput || 'Unknown total failure.'
            }
          })
        ]);
        console.warn(`[DLQ ALERT] Job ${jobId} failed completely and moved to DLQ.`);
      } else {
        // Re-queue the job, keep moving
        await prisma.job.update({
          where: { id: jobId },
          data: { status: 'PENDING', retryCount: newRetries, error: errorOutput, workerId: null, lockedAt: null }
        });
      }

      return res.json({ success: true, retries: newRetries });
    }

    res.status(400).json({ error: 'Invalid status update.' });
  } catch (error) {
    console.error('[BROKER STATUS ERROR]', error);
    res.status(500).json({ error: 'Broker status update error.' });
  }
});


// ==========================================
// 3. OMNI STORAGE (Multi Region Sync P2P)
// ==========================================

// Receiver endpoint for P2P chunk sync
app.post('/internal/sync/receive', upload.single('chunk'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No synced file.' });
    
    // In a real P2P, we just store it identically in uploads dir
    // and upsert the DB record to know this node has it too.
    const { id, originalName, size, mimeType, expiresAt } = req.body;

    const fileRecord = await prisma.file.upsert({
      where: { id },
      update: {},
      create: {
        id,
        filename: req.file.filename,
        originalName,
        size: Number(size),
        mimeType,
        expiresAt: new Date(expiresAt)
      }
    });

    res.json({ success: true, file: fileRecord });
  } catch (error) {
    console.error('[SYNC RECEIVE ERROR]', error);
    res.status(500).json({ error: 'Failed to receive sync chunk.' });
  }
});

// Utility function to broadcast to other nodes
async function broadcastFileToRegions(fileRecord, filePath) {
  try {
    const nodes = await prisma.nodeRegistry.findMany({ where: { type: 'STORAGE', isActive: true } });
    for (const node of nodes) {
      console.log(`[SYNCING] Broadcasting ${fileRecord.originalName} to Region: ${node.address}`);
      // using fetch or axios to POST to node.address + '/internal/sync/receive'
      // formData.append('chunk', fs.createReadStream(filePath))
      // omitted for brevity, but this is the hook
    }
  } catch (e) {
    console.warn('[BROADCAST FAILED]', e);
  }
}

// ==========================================
// 4. OMNI CLEANER (Cron Job)
// ==========================================
// Runs every 5 minutes to sweep and destroy expired files and their DB records
cron.schedule('*/5 * * * *', async () => {
  console.log('[CLEANER] Sweeping for expired ghost files/jobs...');
  try {
    const now = new Date();
    
    // Find expired
    const expiredFiles = await prisma.file.findMany({
      where: { expiresAt: { lte: now } }
    });
    
    for (const file of expiredFiles) {
      const filePath = path.join(UPLOADS_DIR, file.filename);
      // 1. Destroy physical file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`[CLEANER DELETED] Physical File: ${file.filename}`);
      }
      // 2. Erase from Database (Cascase deletes jobs)
      await prisma.file.delete({ where: { id: file.id } });
      console.log(`[CLEANER ERASED] Database Record cascading jobs: ${file.id}`);
    }
  } catch (err) {
    console.error('[CLEANER ERROR]', err);
  }
});

// START
app.listen(PORT, () => {
  console.log(`[Ghost Server - Omni Broker] Running strictly on http://localhost:${PORT}`);
  console.log(`[Ghost Server] Files & Jobs strictly auto-delete after 1 hour.`);
});
