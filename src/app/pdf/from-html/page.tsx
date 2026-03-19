'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/FromHtmlOptions'), { ssr: false });

export default function FromHtmlPage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('from-html'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="HTML to PDF"
      description="Konversi HTML/URL ke PDF"
      gradient="from-slate-600 to-slate-800"
      acceptMultiple={false}
    >
      <Options />
    </PdfToolInterface>
  );
}
