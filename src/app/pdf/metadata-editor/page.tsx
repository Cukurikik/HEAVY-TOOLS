'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/MetadataEditorOptions'), { ssr: false });

export default function MetadataEditorPage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('metadata-edit'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="Metadata Editor"
      description="Edit title, author, subject"
      gradient="from-gray-500 to-gray-700"
      acceptMultiple={false}
    >
      <Options />
    </PdfToolInterface>
  );
}
