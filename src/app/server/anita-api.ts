import express from 'express';
import { spawn } from 'child_process';
import path from 'path';

const router = express.Router();

// Get the root directory of the project
const rootDir = process.cwd();
const anitaDir = path.join(rootDir, 'anita');

// Endpoint to interact with Anita Chat/Core
// Note: anita.py is interactive, so we might need to wrap anita_core for simple text-in text-out API.
router.post('/chat', (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Valid message string is required' });
    return;
  }

  // Create a temporary python script to call anita_core that reads from stdin
  const runCode = `
import sys
import os
sys.path.append(r'${anitaDir}')
from anita_core import ANITAAssistant

input_msg = sys.stdin.read()
anita = ANITAAssistant()
response = anita.chat(input_msg, stream=False)
print(response)
  `;

  // Inject user specific key
  const env = Object.assign({}, process.env, {
    ANTHROPIC_API_KEY: "AQ.Ab8RN6IcjBXv7QN0-mKrhbRpn-qrLvJ25H4qWIJf2FJ1YtqBkg"
  });

  const pythonProcess = spawn('python3', ['-c', runCode], {
    cwd: rootDir,
    env
  });

  let output = '';
  let errorOutput = '';

  // Write the user message safely to stdin
  pythonProcess.stdin.write(message);
  pythonProcess.stdin.end();

  pythonProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      res.status(500).json({ error: 'Process failed', details: errorOutput, code });
    } else {
      res.json({ response: output });
    }
  });
});

export const anitaApiRouter = router;
