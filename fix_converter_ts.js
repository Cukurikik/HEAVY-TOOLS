const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'app', 'modules', 'converter');

// Store fields to add
const storeFields = {
  '03-audio-converter/audio-converter.store.ts': { fields: 'bitrate: string;', default: "bitrate: '192k'," },
  '04-document-converter/document-converter.store.ts': { fields: 'options: any;', default: "options: {}," },
  '05-image-resizer/image-resizer.store.ts': { fields: 'width: number;\n  height: number;\n  maintainAspectRatio: boolean;', default: "width: 800,\n  height: 600,\n  maintainAspectRatio: true," },
  '06-image-compressor/image-compressor.store.ts': { fields: 'quality: number;\n  maxSizeMB: number;', default: "quality: 80,\n  maxSizeMB: 1," },
  '07-svg-converter/svg-converter.store.ts': { fields: 'scale: number;', default: "scale: 1," },
  '08-base64-encoder/base64-encoder.store.ts': { fields: 'wrapLines: boolean;', default: "wrapLines: true," },
  '09-json-converter/json-converter.store.ts': { fields: 'beautify: boolean;\n  indent: number;', default: "beautify: true,\n  indent: 2," },
  '10-csv-converter/csv-converter.store.ts': { fields: 'delimiter: string;\n  hasHeaders: boolean;', default: "delimiter: ',',\n  hasHeaders: true," },
  '11-markdown-converter/markdown-converter.store.ts': { fields: 'flavor: string;\n  sanitize: boolean;', default: "flavor: 'github',\n  sanitize: true," },
  '12-html-converter/html-converter.store.ts': { fields: 'minify: boolean;\n  removeComments: boolean;', default: "minify: false,\n  removeComments: false," },
  '14-unit-converter/unit-converter.store.ts': { fields: 'fromUnit: string;\n  toUnit: string;', default: "fromUnit: '',\n  toUnit: ''," },
  '15-currency-converter/currency-converter.store.ts': { fields: 'fromCurrency: string;\n  toCurrency: string;', default: "fromCurrency: 'USD',\n  toCurrency: 'EUR'," },
  '16-timezone-converter/timezone-converter.store.ts': { fields: 'fromZone: string;\n  toZone: string;', default: "fromZone: 'UTC',\n  toZone: 'UTC'," },
  '17-number-base-converter/number-base-converter.store.ts': { fields: 'fromBase: number;\n  toBase: number;', default: "fromBase: 10,\n  toBase: 16," },
  '18-encoding-converter/encoding-converter.store.ts': { fields: 'fromEncoding: string;\n  toEncoding: string;', default: "fromEncoding: 'utf-8',\n  toEncoding: 'utf-8'," },
  '21-archive-converter/archive-converter.store.ts': { fields: 'compressionLevel: number;', default: "compressionLevel: 5," },
  '25-qr-generator/qr-generator.store.ts': { fields: 'size: number;\n  eccLevel: string;\n  color: string;\n  bgColor: string;', default: "size: 256,\n  eccLevel: 'M',\n  color: '#000000',\n  bgColor: '#ffffff'," },
  '26-barcode-generator/barcode-generator.store.ts': { fields: 'height: number;\n  displayValue: boolean;', default: "height: 100,\n  displayValue: true," },
  '27-ico-converter/ico-converter.store.ts': { fields: 'sizes: number[];', default: "sizes: [16, 32, 48]," },
  '28-gif-converter/gif-converter.store.ts': { fields: 'fps: number;\n  scale: number;', default: "fps: 10,\n  scale: 1," },
  '29-raw-image-converter/raw-image-converter.store.ts': { fields: 'exposure: number;\n  contrast: number;', default: "exposure: 0,\n  contrast: 1," }
};

// 1. Process all .store.ts and .component.ts files
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walkDir(p, callback);
    } else {
      callback(p);
    }
  });
}

walkDir(srcDir, (p) => {
  if (p.endsWith('.store.ts')) {
    let content = fs.readFileSync(p, 'utf8');
    
    // Add missing fields to state interfaces
    const relPath = path.relative(srcDir, p).replace(/\\/g, '/');
    if (storeFields[relPath]) {
      const { fields, default: def } = storeFields[relPath];
      
      // Add to interface
      if (content.includes('export interface') && !content.includes(fields.split(':')[0])) {
        content = content.replace(/(export interface \w+State \{)/, `$1\n  ${fields}`);
      }
      
      // Add to initialState
      if (content.includes('const initialState') && !content.includes(def.split(':')[0])) {
        content = content.replace(/(const initialState: \w+State = \{)/, `$1\n  ${def}`);
      }
    }
    
    // Make payload fields optional in actions
    content = content.replace(/'Processing Success': props<\{ outputBlob: Blob \| null; outputText: string; outputSizeMB: number \}>\(\),/g, 
        `'Processing Success': props<{ outputBlob?: Blob | null; outputText?: string; outputSizeMB?: number | null }>(),`);
    content = content.replace(/'Processing Success': props<\{ outputBlob: Blob; outputSizeMB: number \}>\(\),/g, 
        `'Processing Success': props<{ outputBlob?: Blob | null; outputText?: string; outputSizeMB?: number | null }>(),`);
    
    // Update reducer destructuring if needed
    content = content.replace(/processingSuccess, \(state, \{ outputBlob, outputText, outputSizeMB \}\) => \(\{\s*\.\.\.state, status: 'done' as const, progress: 100, outputBlob, outputText, outputSizeMB \}\)/g,
        `processingSuccess, (state, { outputBlob, outputText, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob: outputBlob || null, outputText: outputText || '', outputSizeMB: outputSizeMB || null })`);
        
    content = content.replace(/processingSuccess, \(state, \{ outputBlob, outputSizeMB \}\) => \(\{\s*\.\.\.state, status: 'done' as const, progress: 100, outputBlob, outputSizeMB \}\)/g,
        `processingSuccess, (state, { outputBlob, outputSizeMB }) => ({
      ...state, status: 'done' as const, progress: 100, outputBlob: outputBlob || null, outputSizeMB: outputSizeMB || null })`);

    fs.writeFileSync(p, content);
  }
  
  if (p.endsWith('.component.ts')) {
    let content = fs.readFileSync(p, 'utf8');
    
    // Replace updateInputText with setInputText
    content = content.replace(/\.updateInputText/g, '.setInputText');
    
    // Special fix for 02-video-converter
    if (p.includes('02-video-converter')) {
      content = content.replace(/ffmpegOptions: state\.ffmpegOptions/g, 'crf: state.crf, encodingSpeed: state.encodingSpeed, resolution: state.resolution');
    }
    
    fs.writeFileSync(p, content);
  }
});

console.log("Converter store/component script completed");
