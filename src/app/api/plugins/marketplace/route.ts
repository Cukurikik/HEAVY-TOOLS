import { NextRequest, NextResponse } from 'next/server';
import { pluginDb } from '@/lib/db';

// Fase 3: Task 21 (List), Task 22 (Search), Task 25 (Pagination), Task 26 (Filter), Task 27 (Sorting), Task 30 (Error Handling)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'newest'; // newest, popular, rating
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;

    let sqlQuery = `
      SELECT p.id, p.name, p.description, p.author, p.price, p.downloads, p.category, p.is_official, p.created_at,
      COALESCE(AVG(r.rating), 0) as average_rating
      FROM plugins p
      LEFT JOIN plugin_reviews r ON p.id = r.plugin_id
      WHERE 1=1
    `;
    const values: any[] = [];
    let paramIndex = 1;

    if (query) {
      sqlQuery += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex} OR p.author ILIKE $${paramIndex})`;
      values.push(`%${query}%`);
      paramIndex++;
    }

    if (category) {
      sqlQuery += ` AND p.category = $${paramIndex}`;
      values.push(category);
      paramIndex++;
    }

    sqlQuery += ` GROUP BY p.id `;

    if (sort === 'popular') {
      sqlQuery += ` ORDER BY p.downloads DESC `;
    } else if (sort === 'rating') {
      sqlQuery += ` ORDER BY average_rating DESC `;
    } else {
      sqlQuery += ` ORDER BY p.created_at DESC `;
    }

    sqlQuery += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    const results = await pluginDb.select(sqlQuery, values);

    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM plugins p WHERE 1=1`;
    const countValues: any[] = [];
    let countParamIndex = 1;

    if (query) {
      countQuery += ` AND (p.name ILIKE $${countParamIndex} OR p.description ILIKE $${countParamIndex} OR p.author ILIKE $${countParamIndex})`;
      countValues.push(`%${query}%`);
      countParamIndex++;
    }
    if (category) {
      countQuery += ` AND p.category = $${countParamIndex}`;
      countValues.push(category);
      countParamIndex++;
    }

    const countResult = await pluginDb.select(countQuery, countValues);
    const total = parseInt(countResult[0]?.total || '0', 10);

    return NextResponse.json({
      data: results,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
