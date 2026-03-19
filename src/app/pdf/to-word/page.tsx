'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/ToWordOptions'), { ssr: false });

export default function ToWordPage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('to-word'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="PDF to Word"
      description="Konversi PDF ke DOCX"
      gradient="from-blue-600 to-blue-800"
      acceptMultiple={false}
    >
      <Options />
    </PdfToolInterface>
  );
}
