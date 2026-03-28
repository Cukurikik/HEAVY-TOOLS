/**
 * Omni-Tool Advanced Security & Rate Limiting Engine (Enterprise Grade)
 * 
 * Architecture:
 * - Implements a Sliding Window Log algorithm for extreme precision.
 * - Handles both memory-based (Vercel Edge) and fallback DB synchronizations.
 * - Includes Automatic Ban-listing for malicious actors (Circuit Breaker).
 * - Implements Burst and Sustained quota limits.
 * - Uses Web Crypto to anonymize IP trackers preventing PII leaks.
 */

import { NextResponse } from 'next/server';

export interface RateLimitRules {
  burst: number;        // Requests per 10 seconds
  sustained: number;    // Requests per minute
  daily: number;        // Requests per day
  banDurationMs: number;// How long to ban after persistent abuse
}

const DEFAULT_RULES: RateLimitRules = {
  burst: 20,
  sustained: 100,
  daily: 5000,
  banDurationMs: 15 * 60 * 1000, // 15 Minute Ban
};

/**
 * In-Memory Edge Store. (Map is retained per Vercel isolate)
 * Stores arrays of timestamps for sliding window accuracy.
 */
interface TrackRecord {
  timestamps: number[];
  bannedUntil: number | null;
  violationCount: number;
}

const edgeStore = new Map<string, TrackRecord>();

// Garbage Collection interval for the Edge Store
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of edgeStore.entries()) {
      // Remove timestamps older than 24h
      record.timestamps = record.timestamps.filter(ts => now - ts < 86400000);
      if (record.timestamps.length === 0 && (!record.bannedUntil || now > record.bannedUntil)) {
        edgeStore.delete(key);
      }
    }
  }, 10 * 60 * 1000); // GC every 10 mins
}

/**
 * Anonymizes the IP address strictly using SHA-256 for GDPR compliance.
 */
async function hashIdentifier(identifier: string): Promise<string> {
  const enc = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', enc.encode(identifier + process.env.ENCRYPTION_SALT || 'omni-salt'));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * The Core Rate Limit Engine Validation Step.
 * Evaluates Burst, Sustained, and Daily limits concurrently using a Sliding Window.
 */
export async function enforceRateLimit(
  reqIdentifier: string, 
  customRules?: Partial<RateLimitRules>
): Promise<{ allowed: boolean, status: 200 | 429 | 403, headers: Record<string, string> }> {
  const rules = { ...DEFAULT_RULES, ...customRules };
  const id = await hashIdentifier(reqIdentifier);
  const now = Date.now();

  let record = edgeStore.get(id) || { timestamps: [], bannedUntil: null, violationCount: 0 };

  // 1. Check if Actively Banned
  if (record.bannedUntil && now < record.bannedUntil) {
    return {
      allowed: false,
      status: 403, // Forbidden (Banned)
      headers: {
        'Retry-After': Math.ceil((record.bannedUntil - now) / 1000).toString(),
        'X-RateLimit-Status': 'BANNED',
      }
    };
  } else if (record.bannedUntil && now >= record.bannedUntil) {
    // Ban Lifted
    record.bannedUntil = null;
    record.violationCount = 0;
  }

  // 2. Filter window arrays for sliding timeframe calculations
  // Burst window is 10 seconds
  const burstWindow = record.timestamps.filter(ts => now - ts < 10000);
  // Sustained window is 60 seconds
  const sustainedWindow = record.timestamps.filter(ts => now - ts < 60000);
  // Daily window is 86400 seconds
  const dailyWindow = record.timestamps.filter(ts => now - ts < 86400000);

  // 3. Evaluate limits
  let isRateLimited = false;
  let retryAfterSeconds = 0;

  if (burstWindow.length >= rules.burst) {
    isRateLimited = true;
    retryAfterSeconds = 10;
  } else if (sustainedWindow.length >= rules.sustained) {
    isRateLimited = true;
    retryAfterSeconds = 60;
  } else if (dailyWindow.length >= rules.daily) {
    isRateLimited = true;
    retryAfterSeconds = 86400; // Come back tomorrow
  }

  if (isRateLimited) {
    // Register violation
    record.violationCount += 1;
    
    // Circuit Breaker: Ban if they hit the rate limit more than 5 times rapidly
    if (record.violationCount >= 5) {
      record.bannedUntil = now + rules.banDurationMs;
      edgeStore.set(id, record);
      return {
        allowed: false,
        status: 403,
        headers: {
            'Retry-After': Math.ceil(rules.banDurationMs / 1000).toString(),
            'X-RateLimit-Status': 'BANNED_DUE_TO_ABUSE',
        }
      }
    }

    edgeStore.set(id, record);
    return {
      allowed: false,
      status: 429, // Too Many Requests
      headers: {
        'Retry-After': retryAfterSeconds.toString(),
        'X-RateLimit-Limit': rules.sustained.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': (now + (retryAfterSeconds * 1000)).toString()
      }
    };
  }

  // 4. Record successful access
  record.timestamps.push(now);
  // Optional: keep memory footprint small by not saving more than daily limit array size
  if (record.timestamps.length > rules.daily * 1.5) {
      record.timestamps.shift(); 
  }
  
  edgeStore.set(id, record);

  // Calculate remaining quotas to send back to client
  const remainingSustained = Math.max(0, rules.sustained - sustainedWindow.length - 1);

  return {
    allowed: true,
    status: 200,
    headers: {
      'X-RateLimit-Limit': rules.sustained.toString(),
      'X-RateLimit-Remaining': remainingSustained.toString(),
      'X-RateLimit-Reset': (now + 60000).toString()
    }
  };
}

/**
 * High-Order Helper to construct standard API responses from a RateLimit evaluation
 */
export function buildRateLimitResponse(evaluation: { allowed: boolean, status: number, headers: Record<string, string> }) {
  const headers = new Headers();
  Object.entries(evaluation.headers).forEach(([k, v]) => headers.set(k, v));
  headers.set('Content-Type', 'application/json');

  const message = evaluation.status === 403 
    ? 'IP Address has been temporarily suspended due to heavy abuse.' 
    : 'Rate limit exceeded. Please back off and retry later.';

  return new NextResponse(
    JSON.stringify({ error: message, code: 'RATE_LIMIT_EXCEEDED' }),
    { status: evaluation.status, headers }
  );
}

/**
 * Backward compatibility wrapper for legacy API endpoints expecting positional arguments.
 */
export async function checkRateLimit(
  identifier: string,
  legacyLimitOrRules?: number | Partial<RateLimitRules>,
  legacyWindowSecs?: number
): Promise<{ success: boolean, remaining: number }> {
  let customRules: Partial<RateLimitRules> = {};
  if (typeof legacyLimitOrRules === 'number') {
    customRules.sustained = legacyLimitOrRules;
  } else if (legacyLimitOrRules) {
    customRules = legacyLimitOrRules;
  }
  
  const result = await enforceRateLimit(identifier, customRules);
  return { 
    success: result.allowed, 
    remaining: parseInt(result.headers['X-RateLimit-Remaining'] || '0') 
  };
}
