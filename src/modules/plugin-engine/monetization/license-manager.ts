import { pluginDb } from '@/lib/db';
import crypto from 'crypto';

// Fase 8: Monetization Utilities
// Task 73: Premium Guard
export async function verifyPremiumAccess(pluginId: string, userId: string): Promise<boolean> {
  const pluginQuery = await pluginDb.select('SELECT price FROM plugins WHERE id = $1', [pluginId]);
  if (pluginQuery.length === 0) return false;
  
  const price = pluginQuery[0].price || 0;
  if (price === 0) return true; // Plugin is FREE

  // Task 76: verifyPluginLicense
  const licenseQuery = await pluginDb.select(
    "SELECT status, trial_expiration FROM plugin_licenses WHERE plugin_id = $1 AND user_id = $2 AND status != 'REVOKED'",
    [pluginId, userId]
  );

  if (licenseQuery.length === 0) return false;

  const license = licenseQuery[0];
  
  // Task 77: Free Trial Manager
  if (license.trial_expiration) {
    const isExpired = new Date() > new Date(license.trial_expiration);
    if (isExpired) {
      await pluginDb.run("UPDATE plugin_licenses SET status = 'EXPIRED' WHERE plugin_id = $1 AND user_id = $2", [pluginId, userId]);
      return false;
    }
  }

  // Task 75: Manual Payment Verification Wait Status
  if (license.status === 'PENDING_PAYMENT') return false;

  return license.status === 'ACTIVE';
}

// Task 74: Custom Credit Deduction
export async function deductOmniCredits(userId: string, cost: number): Promise<boolean> {
  const account = await pluginDb.select('SELECT balance FROM user_wallets WHERE user_id = $1', [userId]);
  if (account.length === 0 || account[0].balance < cost) {
    return false;
  }

  await pluginDb.run('UPDATE user_wallets SET balance = balance - $1 WHERE user_id = $2', [cost, userId]);
  return true;
}

// Task 79: License Key Generator
export function generateLicenseKey(pluginId: string): string {
  const hash = crypto.createHash('sha256').update(pluginId + Date.now().toString()).digest('hex').substring(0, 8);
  return `OMNI-PLG-${hash.toUpperCase()}`;
}

// Task 80: Feature Flagging (Returns true if UI should display premium plugins to user)
export async function canViewPremiumPlugins(userId: string): Promise<boolean> {
  // Mock logic: everyone can view them, but maybe they have a 'pro' tier flag
  return true;
}

// Task 78: Quota Override System
export async function getQuotaBonus(userId: string, resourceType: string): Promise<number> {
  const query = await pluginDb.select(
    'SELECT SUM(bonus_value) as total_bonus FROM quota_overrides WHERE user_id = $1 AND resource = $2',
    [userId, resourceType]
  );
  return parseInt(query[0]?.total_bonus || '0', 10);
}
