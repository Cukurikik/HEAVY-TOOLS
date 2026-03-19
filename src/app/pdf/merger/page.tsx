'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/MergerOptions'), { ssr: false });

export default function MergerPage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('merge'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="PDF Merger"
      description="Gabungkan beberapa file PDF"
      gradient="from-red-500 to-orange-500"
      acceptMultiple={true}
    >
      <Options />
    </PdfToolInterface>
  );
}
