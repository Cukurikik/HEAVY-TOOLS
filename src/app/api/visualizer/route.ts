// ============================================================
// app/api/visualizer/route.ts — Next.js Route Handler
// Serves preset save/load + community preset listing
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const PRESETS_DIR = path.join(process.cwd(), 'tmp', 'visualizer-presets')

async function ensurePresetsDir() {
  try {
    await fs.mkdir(PRESETS_DIR, { recursive: true })
  } catch {
    // Directory already exists
  }
}

/**
 * GET /api/visualizer
 * List all saved visualizer presets
 */
export async function GET() {
  try {
    await ensurePresetsDir()
    const files = await fs.readdir(PRESETS_DIR)
    const presets = []

    for (const file of files) {
      if (!file.endsWith('.json')) continue
      try {
        const content = await fs.readFile(path.join(PRESETS_DIR, file), 'utf-8')
        const data = JSON.parse(content)
        presets.push({
          id: file.replace('.json', ''),
          name: data.name || file.replace('.json', ''),
          elementCount: Array.isArray(data.elements) ? data.elements.length : 0,
          createdAt: data.createdAt || null,
        })
      } catch {
        // Skip malformed files
      }
    }

    return NextResponse.json({ presets }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to list presets' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/visualizer
 * Save a visualizer preset (scene JSON)
 * Body: { name: string, elements: VisualizerElement[] }
 */
export async function POST(request: NextRequest) {
  try {
    await ensurePresetsDir()
    const body = await request.json()

    if (!body.name || !Array.isArray(body.elements)) {
      return NextResponse.json(
        { error: 'Invalid payload. Required: { name: string, elements: [] }' },
        { status: 400 }
      )
    }

    const id = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const preset = {
      name: body.name,
      elements: body.elements,
      createdAt: new Date().toISOString(),
    }

    await fs.writeFile(
      path.join(PRESETS_DIR, `${id}.json`),
      JSON.stringify(preset, null, 2),
      'utf-8'
    )

    return NextResponse.json(
      { id, message: 'Preset saved successfully' },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save preset' },
      { status: 500 }
    )
  }
}
