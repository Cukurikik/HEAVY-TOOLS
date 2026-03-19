'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/FromImageOptions'), { ssr: false });

export default function FromImagePage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('from-image'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="Image to PDF"
      description="Gabung gambar menjadi PDF"
      gradient="from-teal-600 to-teal-800"
      acceptMultiple={true}
    >
      <Options />
    </PdfToolInterface>
  );
}
