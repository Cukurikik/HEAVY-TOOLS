'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/RotatePagesOptions'), { ssr: false });

export default function RotatePagesPage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('rotate-pages'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="Rotate Pages"
      description="Rotasi halaman 90°/180°/270°"
      gradient="from-indigo-500 to-violet-500"
      acceptMultiple={false}
    >
      <Options />
    </PdfToolInterface>
  );
}
