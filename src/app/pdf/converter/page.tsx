'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/ConverterOptions'), { ssr: false });

export default function ConverterPage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('convert'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="PDF Converter"
      description="Konversi format Office"
      gradient="from-yellow-500 to-lime-500"
      acceptMultiple={false}
    >
      <Options />
    </PdfToolInterface>
  );
}
