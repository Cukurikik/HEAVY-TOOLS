"use client";
import dynamic from 'next/dynamic';

const PdfToolInterface = dynamic(() => import('@/modules/pdf-forge/components/PdfToolInterface'), { ssr: false });

export default function ClientInterface(props: any) {
  return <PdfToolInterface {...props} />;
}
