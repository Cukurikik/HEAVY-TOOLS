import { NextRequest, NextResponse } from 'next/server';
import { pluginDb } from '@/lib/db';

// Fase 3: Task 23 - Get Plugin Details
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: pluginId } = await params;
    
    // Validate param
    if (!pluginId) {
      return NextResponse.json({ error: 'Plugin ID is required' }, { status: 400 });
    }

    const sqlQuery = `
      SELECT p.*, COALESCE(AVG(r.rating), 0) as average_rating, COUNT(r.id) as review_count
      FROM plugins p
      LEFT JOIN plugin_reviews r ON p.id = r.plugin_id
      WHERE p.id = $1
      GROUP BY p.id
    `;
    
    const results = await pluginDb.select(sqlQuery, [pluginId]);

    if (results.length === 0) {
      return NextResponse.json({ error: 'Plugin not found' }, { status: 404 });
    }

    // Attach latest version info
    const versionQuery = `
      SELECT version, released_at, changelog
      FROM plugin_versions
      WHERE plugin_id = $1
      ORDER BY released_at DESC LIMIT 1
    `;
    const versionResult = await pluginDb.select(versionQuery, [pluginId]);

    const pluginData = {
      ...results[0],
      latest_version: versionResult.length > 0 ? versionResult[0].version : null,
      last_updated: versionResult.length > 0 ? versionResult[0].released_at : results[0].created_at,
    };

    return NextResponse.json({ data: pluginData }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
