import { z } from 'zod';

// ============================================================
// OMNI PLUGIN MANIFEST SCHEMA (.omniplug/manifest.json)
// ============================================================

export const AVAILABLE_PERMISSIONS = [
  'media.read',
  'media.write',
  'media.convert',
  'storage.read',
  'storage.write',
  'ui.toast',
  'ui.panel',
  'network.fetch',
] as const;

export type PluginPermission = typeof AVAILABLE_PERMISSIONS[number];

export const PluginManifestSchema = z.object({
  name: z.string().min(1).max(64),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  description: z.string().max(256).optional(),
  author: z.string().max(64).optional(),
  permissions: z.array(z.enum(AVAILABLE_PERMISSIONS)),
  entry: z.string().default('plugin.js'),
  icon: z.string().optional(),
});

export type PluginManifest = z.infer<typeof PluginManifestSchema>;

// ============================================================
// PLUGIN STATE
// ============================================================

export type PluginStatus = 'installed' | 'active' | 'inactive' | 'error';

export interface OmniPlugin {
  id: string;
  manifest: PluginManifest;
  status: PluginStatus;
  code: string;          // Raw JS code from plugin.js
  iconDataUrl?: string;  // Base64 encoded icon
  installedAt: string;   // ISO date
  error?: string;
}

export interface PluginMessage {
  type: 'API_CALL' | 'API_RESPONSE' | 'LOG' | 'ERROR' | 'INIT' | 'SHUTDOWN';
  id?: string;
  method?: string;
  args?: unknown[];
  result?: unknown;
  error?: string;
}
