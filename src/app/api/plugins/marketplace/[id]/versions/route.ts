import { NextRequest, NextResponse } from 'next/server';
import { pluginDb } from '@/lib/db';

// Fase 3: Task 24 - Get Plugin Versions
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: pluginId } = await params;
    
    if (!pluginId) {
      return NextResponse.json({ error: 'Plugin ID is required' }, { status: 400 });
    }

    const sqlQuery = `
      SELECT id, version, changelog, released_at, file_hash, zip_url
      FROM plugin_versions
      WHERE plugin_id = $1
      ORDER BY released_at DESC
    `;
    
    const results = await pluginDb.select(sqlQuery, [pluginId]);

    return NextResponse.json({ data: results }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
