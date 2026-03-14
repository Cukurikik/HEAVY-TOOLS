import { readFileSync, writeFileSync } from 'fs';

let content = readFileSync('src/app/layout/sidebar/sidebar.component.ts', 'utf8');

const pdfChildrenStr = \
/** 30 PDF sub-links matching pdf.routes.ts paths */
export const PDF_CHILDREN: NavChild[] = [
  // Basic
  { label: 'Merger',          emoji: '',  route: '/pdf/merger',          category: 'basic' },
  { label: 'Splitter',        emoji: '',  route: '/pdf/splitter',        category: 'basic' },
  { label: 'Compressor',      emoji: '',  route: '/pdf/compressor',      category: 'basic' },
  { label: 'Converter',       emoji: '',  route: '/pdf/converter',       category: 'basic' },
  { label: 'Page Rotator',    emoji: '',  route: '/pdf/rotator',         category: 'basic' },
  { label: 'Crop / Resize',   emoji: '',  route: '/pdf/crop-resize',     category: 'basic' },
  
  // Advanced
  { label: 'Metadata Editor', emoji: '',  route: '/pdf/metadata-editor', category: 'advanced' },
  { label: 'Digital Signer',  emoji: '',  route: '/pdf/digital-signer',  category: 'advanced' },
  { label: 'Redactor',        emoji: '',  route: '/pdf/redactor',        category: 'advanced' },
  { label: 'Annotator',       emoji: '',  route: '/pdf/annotator',       category: 'advanced' },
  { label: 'Form Filler',     emoji: '',  route: '/pdf/form-filler',     category: 'advanced' },
  { label: 'Page Reorderer',  emoji: '',  route: '/pdf/page-reorderer',  category: 'advanced' },
  { label: 'Thumbnails',      emoji: '',  route: '/pdf/thumbnail-generator', category: 'advanced' },
  { label: 'Compare',         emoji: '',  route: '/pdf/compare',         category: 'advanced' },
  { label: 'Bookmark Editor', emoji: '',  route: '/pdf/bookmark-editor', category: 'advanced' },
  { label: 'Batch Processor', emoji: '',  route: '/pdf/batch-processor', category: 'advanced' },
  { label: 'Flattener',       emoji: '',  route: '/pdf/flattener',       category: 'advanced' },
  { label: 'Optimizer',       emoji: '',  route: '/pdf/optimizer',       category: 'advanced' },
  { label: 'Repair',          emoji: '',  route: '/pdf/repair',          category: 'advanced' },

  // Pro 
  { label: 'Text Extractor',  emoji: '',  route: '/pdf/text-extractor',  category: 'pro' },
  { label: 'Image Extractor', emoji: '',  route: '/pdf/image-extractor', category: 'pro' },
  { label: 'Password Protect',emoji: '',  route: '/pdf/password-protector', category: 'pro' },
  { label: 'Unlocker',        emoji: '',  route: '/pdf/unlocker',        category: 'pro' },
  { label: 'Watermark',       emoji: '',  route: '/pdf/watermark',       category: 'pro' },
  { label: 'To Word',         emoji: '',  route: '/pdf/to-word',         category: 'pro' },
  { label: 'To Excel',        emoji: '',  route: '/pdf/to-excel',        category: 'pro' },
  { label: 'To PPT',          emoji: '',  route: '/pdf/to-powerpoint',   category: 'pro' },
  { label: 'To HTML',         emoji: '',  route: '/pdf/to-html',         category: 'pro' },
  { label: 'To Image Batch',  emoji: '',  route: '/pdf/to-image-batch',  category: 'pro' },

  // AI
  { label: 'OCR',             emoji: '',  route: '/pdf/ocr',             category: 'ai' },
];
\;

// Insert before NAV_ITEMS
content = content.replace('export const NAV_ITEMS: NavItem[] = [', pdfChildrenStr + '\\nexport const NAV_ITEMS: NavItem[] = [');

// Insert into NAV_ITEMS array
const navItemsRegex = /(export const NAV_ITEMS: NavItem\\[\\] = \\[[\\s\\S]*?)(\\];)/;
content = content.replace(navItemsRegex, \\  { label: 'PDF Tools', icon: 'picture_as_pdf', route: '/pdf', badge: '30', children: PDF_CHILDREN },\\n\\);

writeFileSync('src/app/layout/sidebar/sidebar.component.ts', content, 'utf8');
console.log('Sidebar updated');
