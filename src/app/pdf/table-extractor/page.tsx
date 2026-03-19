'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/TableExtractorOptions'), { ssr: false });

export default function TableExtractorPage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('table-extract'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="Table Extractor"
      description="Ekstrak tabel terstruktur"
      gradient="from-emerald-600 to-emerald-800"
      acceptMultiple={false}
    >
      <Options />
    </PdfToolInterface>
  );
}
