import { notFound } from 'next/navigation';
import { PDF_TOOLS } from '@/modules/pdf-forge/constants/tools';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';

import ClientInterface from './ClientInterface';

interface Props {
  params: Promise<{ tool: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool } = await params;
  const toolDef = PDF_TOOLS.find((t) => t.route.split('/').pop() === tool);
  
  if (!toolDef) return { title: 'Tool Not Found' };
  
  return {
    title: `${toolDef.name} - Omni-Tool App`,
    description: toolDef.description,
  };
}

export default async function PdfToolPage({ params }: Props) {
  const { tool } = await params;
  
  const toolDef = PDF_TOOLS.find((t) => t.route.split('/').pop() === tool);
  if (!toolDef) notFound();

  return <ClientInterface title={toolDef!.name} description={toolDef!.description} gradient="from-red-600 to-orange-600" />;
}
