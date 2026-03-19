'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/EncryptOptions'), { ssr: false });

export default function EncryptPage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('encrypt'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="PDF Encrypt"
      description="Enkripsi PDF dengan AES-256"
      gradient="from-sky-500 to-blue-500"
      acceptMultiple={false}
    >
      <Options />
    </PdfToolInterface>
  );
}
