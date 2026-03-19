'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/ExtractPagesOptions'), { ssr: false });

export default function ExtractPagesPage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('extract-pages'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="Extract Pages"
      description="Ekstrak halaman tertentu"
      gradient="from-purple-500 to-fuchsia-500"
      acceptMultiple={false}
    >
      <Options />
    </PdfToolInterface>
  );
}
