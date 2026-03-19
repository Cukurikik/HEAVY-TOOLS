'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/CompareOptions'), { ssr: false });

export default function ComparePage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('compare'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="PDF Compare"
      description="Bandingkan dua PDF"
      gradient="from-cyan-600 to-cyan-800"
      acceptMultiple={true}
    >
      <Options />
    </PdfToolInterface>
  );
}
