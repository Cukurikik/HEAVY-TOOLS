'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/SplitterOptions'), { ssr: false });

export default function SplitterPage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('split'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="PDF Splitter"
      description="Pecah PDF berdasarkan halaman"
      gradient="from-orange-500 to-amber-500"
      acceptMultiple={false}
    >
      <Options />
    </PdfToolInterface>
  );
}
