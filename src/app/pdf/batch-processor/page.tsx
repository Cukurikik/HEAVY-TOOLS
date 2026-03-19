'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/BatchProcessorOptions'), { ssr: false });

export default function BatchProcessorPage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('batch-process'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="Batch Processor"
      description="Proses multiple PDF sekaligus"
      gradient="from-violet-600 to-violet-800"
      acceptMultiple={true}
    >
      <Options />
    </PdfToolInterface>
  );
}
