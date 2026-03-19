'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/AnnotatorOptions'), { ssr: false });

export default function AnnotatorPage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('annotate'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="PDF Annotator"
      description="Tambah highlight dan catatan"
      gradient="from-emerald-500 to-teal-500"
      acceptMultiple={false}
    >
      <Options />
    </PdfToolInterface>
  );
}
