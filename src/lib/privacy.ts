import crypto from 'crypto'

/**
 * 90. Privacy Compliance Filter
 * Protects user privacy by ensuring PII (Personally Identifiable Information)
 * like IP addresses, exact file names, and user IDs are hashed or stripped
 * before entering telemetry datasets.
 */

export function anonymizeIp(ip: string): string {
  // Hash the IP address rather than storing it raw
  return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16)
}

export function anonymizeFilename(filename: string): string {
  // Only keep the extension for analytics, strip the actual name
  const ext = filename.split('.').pop()
  return `anonymized_file.${ext}`
}

export function anonymizeUserId(userId: string): string {
  // Store a daily rotation salt if perfect untrackability is needed,
  // otherwise standard hash
  return crypto.createHash('sha256').update(userId).digest('hex').substring(0, 12)
}
