import { z } from 'zod';

// Fase 1: Task 04 - Custom Manifest Parser
export const PluginManifestSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "ID hanya boleh mengandung huruf kecil, angka, dan strip"),
  name: z.string().min(3).max(50),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Versi harus format semver (contoh: 1.0.0)"),
  description: z.string().max(200).optional(),
  author: z.string().min(2),
  main: z.string().default("index.js"),
  permissions: z.array(z.string()).default([]),
  price: z.number().min(0).optional().default(0), // Free is 0
});

export type PluginManifest = z.infer<typeof PluginManifestSchema>;

export const validateManifest = (jsonString: string): PluginManifest => {
  try {
    const data = JSON.parse(jsonString);
    return PluginManifestSchema.parse(data);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const zodErr = error as z.ZodError;
      throw new Error(`Manifest tidak valid: ${zodErr.issues.map((e: any) => e.message).join(', ')}`);
    }
    throw new Error('Manifest JSON corrupt atau tidak bisa diparsing');
  }
};
