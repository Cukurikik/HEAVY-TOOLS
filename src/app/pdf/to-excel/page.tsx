'use client';
import dynamic from 'next/dynamic';
import { usePdfStore } from '@/modules/pdf-forge/store/usePdfStore';
import { useEffect } from 'react';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });
const Options = dynamic(() => import('@/modules/pdf-forge/components/tools/ToExcelOptions'), { ssr: false });

export default function ToExcelPage() {
  const { setOperation } = usePdfStore();
  useEffect(() => { setOperation('to-excel'); }, [setOperation]);

  return (
    <PdfToolInterface
      title="PDF to Excel"
      description="Konversi tabel PDF ke XLSX"
      gradient="from-green-600 to-green-800"
      acceptMultiple={false}
    >
      <Options />
    </PdfToolInterface>
  );
}
