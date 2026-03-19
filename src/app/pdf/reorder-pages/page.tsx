'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/ReorderPagesOptions'), { ssr: false });

export default function ReorderPagesPage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('reorder-pages'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="Reorder Pages"
      description="Susun ulang halaman drag-and-drop"
      gradient="from-fuchsia-500 to-pink-500"
      acceptMultiple={false}
    >
      <Options />
    </PdfToolInterface>
  );
}
