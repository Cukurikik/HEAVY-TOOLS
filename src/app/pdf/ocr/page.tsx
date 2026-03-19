'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/OcrOptions'), { ssr: false });

export default function OcrPage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('ocr'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="PDF OCR"
      description="Ekstrak teks via Tesseract WASM"
      gradient="from-lime-500 to-green-500"
      acceptMultiple={false}
    >
      <Options />
    </PdfToolInterface>
  );
}
