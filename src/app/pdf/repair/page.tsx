'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/RepairOptions'), { ssr: false });

export default function RepairPage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('repair'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="PDF Repair"
      description="Perbaiki PDF rusak via XREF"
      gradient="from-amber-600 to-amber-800"
      acceptMultiple={false}
    >
      <Options />
    </PdfToolInterface>
  );
}
