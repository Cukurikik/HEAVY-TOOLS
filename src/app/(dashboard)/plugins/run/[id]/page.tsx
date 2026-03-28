'use client'

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function RunPluginPage() {
  const params = useParams();
  const pluginId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/plugins/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pluginId,
          action: 'run',
          payload: { uiTrigger: true, timestamp: Date.now() }
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Execution failed');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Execute Sandbox: {pluginId}</CardTitle>
          <CardDescription>
            Temicu backend Node.js worker_threads dan V8 vm sandbox.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Plugin dijalankan secara background tanpa mengganggu UI thread. RAM dilimitasi di 256MB dan dibatasi maksimal 10 detik.
            </p>

            {error && (
              <div className="p-4 bg-red-500/10 text-red-500 rounded-md text-sm border border-red-500/20">
                <strong>Error Eksekusi:</strong> {error}
              </div>
            )}

            {result && (
              <div className="p-4 bg-green-500/10 text-green-500 rounded-md text-sm border border-green-500/20">
                <strong>Sukses ({result.executionTimeMs}ms):</strong>
                <pre className="mt-2 overflow-x-auto text-xs opacity-80">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleRun} disabled={loading} className="w-full">
            {loading ? 'Executing Worker...' : '🚀 Trigger Execute API'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
