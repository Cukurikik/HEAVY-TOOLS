'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/DecryptOptions'), { ssr: false });

export default function DecryptPage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('decrypt'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="PDF Decrypt"
      description="Buka PDF terenkripsi"
      gradient="from-blue-500 to-indigo-500"
      acceptMultiple={false}
    >
      <Options />
    </PdfToolInterface>
  );
}
