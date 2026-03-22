'use client';

import { ConverterDashboard } from '@/modules/converter/components/ConverterDashboard';

export default function Base64Page() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white">Base64</h1>
      <p className="text-slate-400">
        This specialized converter tool is currently routing to the unified Converter Dashboard pending engine refactoring.
      </p>
      <ConverterDashboard />
    </div>
  );
}
