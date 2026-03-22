import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

// Tools that exclusively require server-side intervention
const SERVER_TOOLS = ['svg-converter', 'raw-converter', 'screenshot-to-code'];

export async function POST(req: NextRequest, { params }: { params: { tool: string } }) {
  const { tool } = params;

  if (!SERVER_TOOLS.includes(tool)) {
    return NextResponse.json({ error: 'This tool is processed client-side.' }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (tool === 'svg-converter') {
      // Convert SVG to PNG
      const pngBuffer = await sharp(buffer)
        .png()
        .toBuffer();
        
      return new NextResponse(pngBuffer as any, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="converted.png"`,
        },
      });
    }

    if (tool === 'raw-converter') {
      // Process RAW image formats (CR2, NEF) using sharp/libvips
      // Note: Requires sharp to be compiled with raw support/libraw
      const jpegBuffer = await sharp(buffer)
        .jpeg({ quality: 90 })
        .toBuffer();
        
      return new NextResponse(jpegBuffer as any, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Content-Disposition': `attachment; filename="converted.jpg"`,
        },
      });
    }

    if (tool === 'screenshot-to-code') {
      // Mock LLM Vision endpoint connection
      // In production, this would send `buffer` (base64) to OpenAI / Claude API
      const mockHtml = `
<!DOCTYPE html>
<html lang="en">
<head><script src="https://cdn.tailwindcss.com"></script></head>
<body class="bg-gray-100 p-8 flex justify-center items-center h-screen">
  <div class="bg-white p-6 rounded-xl shadow-lg">Generated UI Component</div>
</body>
</html>
      `;
      return NextResponse.json({ code: mockHtml });
    }

    return NextResponse.json({ error: 'Unsupported operation' }, { status: 400 });

  } catch (error) {
    console.error(`[IMAGE_API Error] ${tool}:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
