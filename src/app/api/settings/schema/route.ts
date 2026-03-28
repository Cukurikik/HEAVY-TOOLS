import { NextResponse } from 'next/server';
import { SettingsRegistry } from '@/modules/settings-engine/registry';

/**
 * GET /api/settings/schema
 * Returns the full 300-feature schema for the Dynamic UI Renderer.
 * The frontend calls this once on mount and renders controls dynamically.
 */
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (category) {
      const features = SettingsRegistry.getByCategory(category).map(f => ({
        id: f.id, category: f.category, slug: f.slug,
        label: f.label, description: f.description,
        inputType: f.inputType, options: f.options, defaultValue: f.defaultValue,
      }));
      return NextResponse.json({ category, count: features.length, features });
    }

    const schema = SettingsRegistry.getSchema();
    const categories = SettingsRegistry.getCategories();

    return NextResponse.json({
      totalFeatures: schema.length,
      categories,
      schema,
    });
  } catch (error) {
    console.error('Settings Schema Error:', error);
    return NextResponse.json({ error: 'Failed to load schema' }, { status: 500 });
  }
}
