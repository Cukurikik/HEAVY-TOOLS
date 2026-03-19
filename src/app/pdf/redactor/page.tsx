'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/RedactorOptions'), { ssr: false });

export default function RedactorPage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('redact'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="PDF Redactor"
      description="Sensor informasi sensitif"
      gradient="from-pink-500 to-rose-500"
      acceptMultiple={false}
    >
      <Options />
    </PdfToolInterface>
  );
}
