import { appendFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Task 81, 83, 89: Telemetry Logger
export interface TelemetryPayload {
  pluginId: string;
  action: string;
  executionTimeMs?: number; // Task 83
  error?: string;
  userAgent?: string; // Task 89
}

// Task 90: Privacy Compliance Filter
function filterPII(data: string): string {
  // Removes potential IP addresses, emails, or tokens via simple regex
  // This is a basic privacy compliance filter to prevent storing identifiable data in JSONL.
  return data
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_REDACTED]')
    .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[IP_REDACTED]')
    .replace(/(Bearer\s)[\w-]+\.[\w-]+\.[\w-]+/g, '$1[TOKEN_REDACTED]');
}

export function logTelemetry(payload: TelemetryPayload) {
  const logDir = join(process.cwd(), 'logs', 'plugins');
  if (!existsSync(logDir)) {
    mkdirSync(logDir, { recursive: true });
  }

  const date = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  const logPath = join(logDir, `telemetry-${date}.jsonl`);
  
  const rawLogLine = JSON.stringify({
    timestamp: new Date().toISOString(),
    ...payload
  });

  const compliantLogLine = filterPII(rawLogLine) + '\\n';

  try {
    appendFileSync(logPath, compliantLogLine);
  } catch (err) {
    console.error('Gagal menulis log telemetri:', err);
  }
}
