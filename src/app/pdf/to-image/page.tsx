'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/ToImageOptions'), { ssr: false });

export default function ToImagePage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('to-image'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="PDF to Image"
      description="Render halaman ke PNG/JPEG"
      gradient="from-purple-600 to-purple-800"
      acceptMultiple={false}
    >
      <Options />
    </PdfToolInterface>
  );
}
