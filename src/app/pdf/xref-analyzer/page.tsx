'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/XrefAnalyzerOptions'), { ssr: false });

export default function XrefAnalyzerPage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('xref-analyze'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="XREF Analyzer"
      description="Analisis struktur internal PDF"
      gradient="from-zinc-500 to-zinc-700"
      acceptMultiple={false}
    >
      <Options />
    </PdfToolInterface>
  );
}
