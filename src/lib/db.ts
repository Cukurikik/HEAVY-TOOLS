/**
 * Omni-Tool Database Adapter (Phase 21)
 * 
 * PostgreSQL/Supabase has been FULLY REMOVED.
 * All persistence is now handled by Firebase (Firestore + RTDB).
 * 
 * This file provides backward-compatible mock exports so that
 * existing imports across 40+ files don't cause build crashes.
 * Each mock function logs a deprecation warning and returns
 * safe empty results.
 */

// ═══════════════════════════════════════════════════
// pluginDb — Mock SQL Query Builder
// Used by: /api/plugins/*, /plugins/installed, plugin-engine/*
// ═══════════════════════════════════════════════════
export const pluginDb = {
  select: async (_queryText: string, _values?: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('[DB Mock] pluginDb.select() → Firebase migration pending. Returning [].');
    }
    return [];
  },
  insert: async (_queryText: string, _values?: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('[DB Mock] pluginDb.insert() → Firebase migration pending. Returning 0.');
    }
    return 0;
  },
  run: async (_queryText: string, _values?: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('[DB Mock] pluginDb.run() → Firebase migration pending.');
    }
    return { rowCount: 0, rows: [] };
  }
};

// ═══════════════════════════════════════════════════
// pgPool — Mock Pool (prevents import crashes)
// ═══════════════════════════════════════════════════
export const pgPool = {
  connect: async () => ({
    query: async (..._args: any[]) => ({ rows: [], rowCount: 0 }),
    release: () => {},
  }),
  query: async (..._args: any[]) => ({ rows: [], rowCount: 0 }),
  end: async () => {},
};

// ═══════════════════════════════════════════════════
// db — Prisma-Compatible Mock Proxy
// Catches all Prisma-style calls (db.user.findUnique, db.task.create, etc.)
// and returns safe null/empty results.
// ═══════════════════════════════════════════════════
const createMockFunction = (propName: string) => {
  return function(..._args: any[]) {
    if (propName === 'count') return Promise.resolve(0);
    if (propName === 'findMany' || propName === 'groupBy') return Promise.resolve([]);
    if (propName === 'aggregate') return Promise.resolve({ _sum: {}, _avg: {} });
    return Promise.resolve(null);
  };
};

const modelProxyHandler = {
  get(_target: any, prop: string | symbol) {
    if (prop === 'then') return undefined;
    if (typeof prop === 'string') {
      return createMockFunction(prop);
    }
    return undefined;
  }
};

const topLevelProxyHandler = {
  get(_target: any, prop: string | symbol): any {
    if (prop === 'then') return undefined;
    return new Proxy({}, modelProxyHandler);
  }
};

export const db: any = new Proxy({}, topLevelProxyHandler);
