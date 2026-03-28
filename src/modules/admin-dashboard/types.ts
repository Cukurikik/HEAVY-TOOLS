/**
 * Phase 28: Admin Dashboard Types & Interfaces
 * 
 * Central type definitions for all admin monitoring metrics,
 * SSE events, quota status, and security telemetry.
 */

// ═══════════════════════════════════════════════════
// ENGINE & QUOTA TYPES
// ═══════════════════════════════════════════════════
export type EngineType = 'video' | 'image' | 'pdf' | 'llm' | 'converter';
export type QuotaTier = 'free' | 'pro' | 'enterprise';
export type TaskStatus = 'processing' | 'success' | 'error';

export interface QuotaLimits {
  video_ops: number;
  image_ops: number;
  pdf_ops: number;
  llm_tokens: number;
  bandwidth_bytes: number;
}

export interface QuotaStatus {
  identifier: string;
  tier: QuotaTier;
  usage: QuotaLimits;
  limits: QuotaLimits;
  remaining: QuotaLimits;
  percentages: QuotaLimits;
  resetAt: string; // ISO string
  isExhausted: boolean;
}

// ═══════════════════════════════════════════════════
// ADMIN STATS TYPES
// ═══════════════════════════════════════════════════
export interface EngineStats {
  engineType: EngineType;
  totalTasks: number;
  successCount: number;
  errorCount: number;
  successRate: number; // 0-100
  totalBytesProcessed: number;
}

export interface ActiveSession {
  ipHash: string;
  requestCount: number;
  lastRequestAt: number;
  isBanned: boolean;
  bannedUntil: number | null;
  violationCount: number;
}

export interface SecurityEvent {
  type: 'bot_block' | 'rate_limit' | 'circuit_breaker' | 'quota_exhausted' | 'ban_activated';
  ipHash: string;
  path: string;
  timestamp: number;
  details: string;
}

export interface ErrorLogEntry {
  id: string;
  engineType: EngineType;
  toolSlug: string;
  errorMessage: string;
  timestamp: string;
  userId: string;
}

export interface AdminDashboardData {
  quotaOverview: QuotaStatus;
  engineStats: EngineStats[];
  activeSessions: ActiveSession[];
  recentErrors: ErrorLogEntry[];
  securityEvents: SecurityEvent[];
  bandwidth: {
    totalBytesToday: number;
    limitBytes: number;
    percentUsed: number;
  };
  systemHealth: {
    uptime: number;
    activeWorkers: number;
    memoryUsage: number;
    totalRequestsToday: number;
  };
}

// ═══════════════════════════════════════════════════
// SSE EVENT TYPES
// ═══════════════════════════════════════════════════
export type SSEEventType = 
  | 'metrics_update' 
  | 'security_alert' 
  | 'quota_warning' 
  | 'error_spike'
  | 'heartbeat';

export interface SSEMetricsPayload {
  type: SSEEventType;
  timestamp: number;
  data: {
    activeWorkers: number;
    bandwidthDelta: number;
    totalBandwidthToday: number;
    requestsPerSecond: number;
    errorRate: number;
    engineLoad: Record<EngineType, number>;
  };
}

export interface SSESecurityAlert {
  type: 'security_alert';
  timestamp: number;
  data: SecurityEvent;
}

export interface SSEQuotaWarning {
  type: 'quota_warning';
  timestamp: number;
  data: {
    identifier: string;
    operationType: string;
    remaining: number;
    limit: number;
    percentUsed: number;
  };
}

// ═══════════════════════════════════════════════════
// QUOTA CHECK API TYPES
// ═══════════════════════════════════════════════════
export interface QuotaCheckRequest {
  identifier: string;
  engineType: EngineType;
  costAmount?: number;
}

export interface QuotaCheckResponse {
  allowed: boolean;
  remaining: number;
  resetAt: string;
  tier: QuotaTier;
  exhaustedOps: string[];
}

export interface QuotaConsumeRequest {
  identifier: string;
  engineType: EngineType;
  costAmount: number;
  bandwidthBytes?: number;
}
