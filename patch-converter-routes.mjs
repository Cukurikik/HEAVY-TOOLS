import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const routesFile = join(process.cwd(), 'src/app/modules/converter/converter.routes.ts');
let content = readFileSync(routesFile, 'utf8');

// If already patched, skip
if (content.includes('provideState')) {
  console.log('Already patched.');
  process.exit(0);
}

// Map of paths to their feature exports
const featuresInfo = [
  { path: 'image-converter', storePath: './01-image-converter/image-converter.store', featureExport: 'imageConverterFeature' },
  { path: 'video-converter', storePath: './02-video-converter/video-converter.store', featureExport: 'videoConverterFeature' },
  { path: 'audio-converter', storePath: './03-audio-converter/audio-converter.store', featureExport: 'audioConverterFeature' },
  { path: 'document-converter', storePath: './04-document-converter/document-converter.store', featureExport: 'documentConverterFeature' },
  { path: 'image-resizer', storePath: './05-image-resizer/image-resizer.store', featureExport: 'imageResizerFeature' },
  { path: 'image-compressor', storePath: './06-image-compressor/image-compressor.store', featureExport: 'imageCompressorFeature' },
  { path: 'svg-converter', storePath: './07-svg-converter/svg-converter.store', featureExport: 'svgConverterFeature' },
  { path: 'base64-encoder', storePath: './08-base64-encoder/base64-encoder.store', featureExport: 'base64EncoderFeature' },
  { path: 'json-converter', storePath: './09-json-converter/json-converter.store', featureExport: 'jsonConverterFeature' },
  { path: 'csv-converter', storePath: './10-csv-converter/csv-converter.store', featureExport: 'csvConverterFeature' },
  { path: 'markdown-converter', storePath: './11-markdown-converter/markdown-converter.store', featureExport: 'markdownConverterFeature' },
  { path: 'html-converter', storePath: './12-html-converter/html-converter.store', featureExport: 'htmlConverterFeature' },
  { path: 'color-converter', storePath: './13-color-converter/color-converter.store', featureExport: 'colorConverterFeature' },
  { path: 'unit-converter', storePath: './14-unit-converter/unit-converter.store', featureExport: 'unitConverterFeature' },
  { path: 'currency-converter', storePath: './15-currency-converter/currency-converter.store', featureExport: 'currencyConverterFeature' },
  { path: 'timezone-converter', storePath: './16-timezone-converter/timezone-converter.store', featureExport: 'timezoneConverterFeature' },
  { path: 'number-base-converter', storePath: './17-number-base-converter/number-base-converter.store', featureExport: 'numberBaseConverterFeature' },
  { path: 'encoding-converter', storePath: './18-encoding-converter/encoding-converter.store', featureExport: 'encodingConverterFeature' },
  { path: 'font-converter', storePath: './19-font-converter/font-converter.store', featureExport: 'fontConverterFeature' },
  { path: 'ebook-converter', storePath: './20-ebook-converter/ebook-converter.store', featureExport: 'ebookConverterFeature' },
  { path: 'archive-converter', storePath: './21-archive-converter/archive-converter.store', featureExport: 'archiveConverterFeature' },
  { path: 'cad-converter', storePath: './22-cad-converter/cad-converter.store', featureExport: 'cadConverterFeature' },
  { path: 'subtitle-converter', storePath: './23-subtitle-converter/subtitle-converter.store', featureExport: 'subtitleConverterFeature' },
  { path: 'spreadsheet-converter', storePath: './24-spreadsheet-converter/spreadsheet-converter.store', featureExport: 'spreadsheetConverterFeature' },
  { path: 'qr-generator', storePath: './25-qr-generator/qr-generator.store', featureExport: 'qrGeneratorFeature' },
  { path: 'barcode-generator', storePath: './26-barcode-generator/barcode-generator.store', featureExport: 'barcodeGeneratorFeature' },
  { path: 'ico-converter', storePath: './27-ico-converter/ico-converter.store', featureExport: 'icoConverterFeature' },
  { path: 'gif-converter', storePath: './28-gif-converter/gif-converter.store', featureExport: 'gifConverterFeature' },
  { path: 'raw-image-converter', storePath: './29-raw-image-converter/raw-image-converter.store', featureExport: 'rawImageConverterFeature' },
  { path: 'batch-converter', storePath: './30-batch-converter/batch-converter.store', featureExport: 'batchConverterFeature' }
];

// Add imports
let imports = "import { provideState } from '@ngrx/store';\n";
for (const info of featuresInfo) {
  imports += `import { ${info.featureExport} } from '${info.storePath}';\n`;
}

content = content.replace(/(import { Routes } from '@angular\/router';)/, `$1\n${imports}`);

// Inject providers
for (const info of featuresInfo) {
  const regex = new RegExp(`(path: '${info.path}',\\s+loadComponent: [^,]+,)`);
  content = content.replace(regex, `$1\n    providers: [provideState(${info.featureExport})],`);
}

writeFileSync(routesFile, content, 'utf8');
console.log('Patched converter.routes.ts to include provideState!');
