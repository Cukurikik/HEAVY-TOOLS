'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/CropPagesOptions'), { ssr: false });

export default function CropPagesPage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('crop-pages'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="Crop Pages"
      description="Potong area halaman PDF"
      gradient="from-violet-500 to-purple-500"
      acceptMultiple={false}
    >
      <Options />
    </PdfToolInterface>
  );
}
