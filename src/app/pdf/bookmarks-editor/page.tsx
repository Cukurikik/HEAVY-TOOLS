'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/BookmarksEditorOptions'), { ssr: false });

export default function BookmarksEditorPage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('bookmarks-edit'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="Bookmarks Editor"
      description="Edit outline/bookmarks PDF"
      gradient="from-red-600 to-red-800"
      acceptMultiple={false}
    >
      <Options />
    </PdfToolInterface>
  );
}
