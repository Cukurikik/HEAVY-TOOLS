import { NextRequest, NextResponse } from 'next/server';
import { logTelemetry } from '@/modules/plugin-engine/telemetry/logger';

// Fase 9: Task 84 - API plugin crash logger
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pluginId, action, error } = body;
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    if (!pluginId || !error) {
      return NextResponse.json({ error: 'pluginId dan error diperlukan' }, { status: 400 });
    }

    logTelemetry({
      pluginId,
      action: action || 'CRASH_REPORT_CLIENT',
      error,
      userAgent
    });

    return NextResponse.json({ message: 'Error logged success' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
