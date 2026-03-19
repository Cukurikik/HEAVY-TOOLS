'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/DigitalSignatureOptions'), { ssr: false });

export default function DigitalSignaturePage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('digital-signature'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="Digital Signature"
      description="Tanda tangan digital PAdES"
      gradient="from-cyan-500 to-sky-500"
      acceptMultiple={false}
    >
      <Options />
    </PdfToolInterface>
  );
}
