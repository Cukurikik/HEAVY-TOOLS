import { NextResponse } from 'next/server';
import { pluginDb } from '@/lib/db';

// Fase 3: Task 29 - Featured Plugins API
export async function GET() {
  try {
    const sqlQuery = `
      SELECT p.id, p.name, p.description, p.author, p.price, p.downloads, p.category, p.is_official,
      COALESCE(AVG(r.rating), 0) as average_rating
      FROM plugins p
      LEFT JOIN plugin_reviews r ON p.id = r.plugin_id
      WHERE p.is_official = TRUE OR p.downloads > 100
      GROUP BY p.id
      ORDER BY p.downloads DESC, average_rating DESC
      LIMIT 6
    `;

    const results = await pluginDb.select(sqlQuery);
    return NextResponse.json({ data: results }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
