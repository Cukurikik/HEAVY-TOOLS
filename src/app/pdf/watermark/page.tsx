'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/WatermarkOptions'), { ssr: false });

export default function WatermarkPage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('watermark'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="Watermark Tool"
      description="Tambah watermark teks/gambar"
      gradient="from-teal-500 to-cyan-500"
      acceptMultiple={false}
    >
      <Options />
    </PdfToolInterface>
  );
}
