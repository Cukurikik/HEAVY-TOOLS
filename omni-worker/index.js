require('dotenv').config();
const axios = require('axios');
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');
const util = require('util');
const path = require('path');

const execPromise = util.promisify(exec);

const WORKER_ID = uuidv4();
const GHOST_SERVER_URL = process.env.GHOST_SERVER_URL || 'http://ghost-backend:3000';
const SUPPORTED_TYPES = ['VIDEO_CONVERT', 'AUDIO_CONVERT']; 
// In reality, this specific worker node might only do Video. 
// Another node might do 'IMAGE_PROCESS'. We'll claim video and audio.

// A shared mount is expected at /usr/src/app/uploads so the worker can read the files.
const UPLOADS_DIR = process.env.UPLOADS_DIR || '/usr/src/app/uploads';

const POLLING_INTERVAL = 3000; // 3 seconds

async function reportStatus(jobId, status, errorOutput = null) {
  try {
    const res = await axios.post(`${GHOST_SERVER_URL}/internal/jobs/${jobId}/status`, {
      status, 
      errorOutput
    });
    console.log(`[WORKER] Reported Job ${jobId} as ${status}. Response: ${res.data.success ? 'OK' : 'FAIL'}`);
  } catch (err) {
    console.error(`[WORKER] Failed to report status for Job ${jobId}`, err.message);
  }
}

async function processJob(job) {
  console.log(`[WORKER] Processing Job: ${job.id} | Type: ${job.type}`);
  
  // We need the filename, but the job object only has fileId.
  // In a robust implementation, the broker includes the filename in the pop payload, or we query it.
  // For safety, let's just pretend we query it or it's provided. We'll query it via info endpoint.
  let fileMeta;
  try {
    const infoRes = await axios.get(`${GHOST_SERVER_URL}/api/info/${job.fileId}`);
    fileMeta = infoRes.data;
  } catch (err) {
    console.error('[WORKER] Cannot fetch file metadata. Marking failed.');
    await reportStatus(job.id, 'FAILED', 'Cannot locate file physical metadata.');
    return;
  }

  const inputPath = path.join(UPLOADS_DIR, fileMeta.filename);
  const outputPath = path.join(UPLOADS_DIR, `processed_${fileMeta.filename}`);

  let command = '';
  if (job.type === 'VIDEO_CONVERT') {
    // Basic FFmpeg command to compress
    command = `ffmpeg -y -i "${inputPath}" -c:v libx264 -crf 28 -preset ultrafast "${outputPath}"`;
  } else if (job.type === 'AUDIO_CONVERT') {
    command = `ffmpeg -y -i "${inputPath}" -b:a 128k "${outputPath}"`;
  } else {
    await reportStatus(job.id, 'FAILED', `Unsupported type: ${job.type}`);
    return;
  }

  try {
    console.log(`[WORKER] Executing: ${command}`);
    // EXECUTING ACTUAL BINARY (FFMPEG)
    const { stdout, stderr } = await execPromise(command, { timeout: 10 * 60 * 1000 }); // 10 mins max
    
    // In Omni architecture, the UI checks the info endpoint which returns remaining TTL. 
    // Usually, the processed file overwrites or adds to DB. Here we overwrite physical for simplicity.
    const mvCommand = `mv "${outputPath}" "${inputPath}"`;
    await execPromise(mvCommand);

    console.log(`[WORKER] Job ${job.id} SUCCESS. Stdout: ${stdout.substring(0, 100)}`);
    await reportStatus(job.id, 'SUCCESS');
  } catch (err) {
    console.error(`[WORKER] Job ${job.id} FAILED. Error: ${err.message}`);
    await reportStatus(job.id, 'FAILED', err.message || err.stderr);
  }
}

async function pollForJobs() {
  try {
    const res = await axios.post(`${GHOST_SERVER_URL}/internal/jobs/pop`, {
      workerId: WORKER_ID,
      supportedTypes: SUPPORTED_TYPES
    });

    if (res.data.job) {
      await processJob(res.data.job);
      // Immediately poll again after finishing
      setTimeout(pollForJobs, 0); 
    } else {
      // No jobs, sleep and poll
      setTimeout(pollForJobs, POLLING_INTERVAL);
    }
  } catch (error) {
    console.error(`[WORKER POLL ERROR] Cannot reach Ghost Server... retrying in ${POLLING_INTERVAL}ms`);
    setTimeout(pollForJobs, POLLING_INTERVAL);
  }
}

console.log(`[OMNI WORKER] Started. ID: ${WORKER_ID}`);
console.log(`[OMNI WORKER] Waiting for jobs targeting: ${SUPPORTED_TYPES.join(', ')}`);
pollForJobs();
