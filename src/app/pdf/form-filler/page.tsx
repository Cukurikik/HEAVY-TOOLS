'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/FormFillerOptions'), { ssr: false });

export default function FormFillerPage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('form-fill'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="Form Filler"
      description="Isi formulir AcroForm PDF"
      gradient="from-rose-500 to-red-600"
      acceptMultiple={false}
    >
      <Options />
    </PdfToolInterface>
  );
}
