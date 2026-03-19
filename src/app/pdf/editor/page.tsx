'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/EditorOptions'), { ssr: false });

export default function EditorPage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('edit'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="PDF Editor"
      description="Edit teks dan elemen PDF"
      gradient="from-green-500 to-emerald-500"
      acceptMultiple={false}
    >
      <Options />
    </PdfToolInterface>
  );
}
