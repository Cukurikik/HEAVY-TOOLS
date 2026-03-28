import { NextRequest, NextResponse } from 'next/server';
import { executePluginTask } from '@/modules/plugin-engine/backend/execution-engine';

// Fase 5: Task 43 - API triggerPluginTask
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pluginId, action, payload } = body;

    if (!pluginId || !action) {
      return NextResponse.json({ error: 'pluginId dan action diperlukan' }, { status: 400 });
    }

    // Eksekusi kode secara sandboxed
    // Task 44, 45, 46, 47, 48, 49 dilakukan di layer service ini
    const result = await executePluginTask(pluginId, action, payload, (progress) => {
      // Logic for stream/progress would be sent via SSE typically, 
      // but for a standard REST POST, it waits for final.
      // Progress event is captured in execution-engine and can be written to a redis/db 
      // or broadcasted via WebSockets (Phase 6 OmniEventBus).
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error, executionTimeMs: result.executionTimeMs }, { status: 500 });
    }

    return NextResponse.json({ 
      data: result.data, 
      executionTimeMs: result.executionTimeMs 
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
