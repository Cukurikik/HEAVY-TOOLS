'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/CompressorOptions'), { ssr: false });

export default function CompressorPage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('compress'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="PDF Compressor"
      description="Kompres ukuran PDF"
      gradient="from-amber-500 to-yellow-500"
      acceptMultiple={false}
    >
      <Options />
    </PdfToolInterface>
  );
}
