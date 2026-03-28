import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import { ImageToolInterface } from '@/modules/image-engine/components/ImageToolInterface';

const validImageTools = [
  'converter', 'compressor', 'cropper', 'resizer', 'watermark', 'background-remover',
  'upscaler', 'filters', 'metadata', 'color-picker', 'blur', 'sharpen', 'noise-reduction',
  'black-and-white', 'collage', 'spritesheet', 'gif-maker', 'ico-converter', 'b64-encoder',
  'svg-optimizer', 'pdf-to-image', 'image-to-pdf', 'color-replace', 'meme-generator',
  'split', 'rotate-flip', 'hdr', 'glitch', 'pixelate', 'batch-rename'
];

interface Props {
  params: Promise<{
    tool: string;
  }>;
}

// Generate static metadata based on the tool requested
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const unwrappedParams = await params;
  const tool = unwrappedParams.tool;
  if (!validImageTools.includes(tool)) return {};

  const titleFormat = tool.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    title: `${titleFormat} - Image Matrix | Omni-Tool`,
    description: `Professional browser-based ${titleFormat} powered by WASM without server-side memory limits.`,
  };
}

export default async function ImageToolPage({ params }: Props) {
  const unwrappedParams = await params;
  const tool = unwrappedParams.tool;

  if (!validImageTools.includes(tool)) {
    notFound();
  }

  const title = tool.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const isMultiFile = tool === 'collage' || tool === 'spritesheet' || tool === 'image-to-pdf' || tool === 'gif-maker';

  return (
    <div className="p-4 md:p-8">
      <ImageToolInterface
        toolId={tool}
        title={title}
        description={`Execute ${title} purely in-browser using WASM isolates.`}
        isMultiFile={isMultiFile}
      />
    </div>
  );
}
