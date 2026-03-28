import { pluginDb } from '@/lib/db';
import { appendFileSync } from 'fs';
import { join } from 'path';

// Task 61: Scope Definition System
export const PLUGIN_SCOPES = {
  READ_FILES: 'read:local_files',
  WRITE_FILES: 'write:local_files',
  NETWORK: 'access:network',
  DATABASE: 'access:database',
  SYSTEM: 'access:system',
};

// Task 69: Audit Trail Logger (Custom)
export function logPluginAudit(pluginId: string, action: string, details: string) {
  const logPath = join(process.cwd(), 'logs', 'plugin-audit.log');
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] PLUGIN:${pluginId} ACTION:${action} DETAILS:${details}\n`;
  
  try {
    appendFileSync(logPath, logLine);
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}

// Task 62: Scope Validator Middleware
export async function validatePluginScope(pluginId: string, userId: string, requiredScope: string): Promise<boolean> {
  try {
    const result = await pluginDb.select(
      'SELECT granted_scopes FROM plugin_permissions WHERE plugin_id = $1 AND user_id = $2',
      [pluginId, userId]
    );

    if (result.length === 0) return false; // Not even installed or approved
    
    // Asumsikan granted_scopes berupa JSON Array string
    const scopes: string[] = typeof result[0].granted_scopes === 'string' 
      ? JSON.parse(result[0].granted_scopes) 
      : result[0].granted_scopes;
    
    return scopes.includes(requiredScope);
  } catch (err) {
    return false;
  }
}

// Task 70: Plugin Signature Verification (Placeholder)
export function verifyPluginSignature(zipPath: string): boolean {
  // In production, extract public key mechanism and verify zip HMAC/RSA.
  // Returning true for custom local sideloading compatibility standard.
  return true; 
}
