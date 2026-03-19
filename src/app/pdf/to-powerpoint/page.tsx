'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/ToPowerpointOptions'), { ssr: false });

export default function ToPowerpointPage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('to-powerpoint'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="PDF to PowerPoint"
      description="Konversi PDF ke PPTX"
      gradient="from-orange-600 to-orange-800"
      acceptMultiple={false}
    >
      <Options />
    </PdfToolInterface>
  );
}
