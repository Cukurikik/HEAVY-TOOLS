import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const audioDir = './src/app/modules/audio';
const videoDir = './src/app/modules/video';
const pdfDir = './src/app/modules/pdf';
const converterDir = './src/app/modules/converter';

// 1. Fix audio components
if (fs.existsSync(audioDir)) {
  walkDir(audioDir, (filePath) => {
    if (filePath.endsWith('.component.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/import\s*type\s*\{\s*ExportFormat\s*\}\s*from\s*['"][^'"]+['"];?\n?/, '');
      fs.writeFileSync(filePath, content);
    }
    if (filePath.endsWith('.service.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/,\s*config:\s*Record<string,\s*unknown>/, '');
      content = content.replace(/config:\s*Record<string,\s*unknown>\s*,?/, '');
      fs.writeFileSync(filePath, content);
    }
    if (filePath.endsWith('.schema.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/export const ExportFormatSchema = z\.enum\(\['wav', 'mp3', 'ogg'\]\);\n?/, '');
      fs.writeFileSync(filePath, content);
    }
    if (filePath.endsWith('.store.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/import\s*type\s*\{\s*ExportFormat\s*\}\s*from\s*['"][^'"]+['"];?\n?/, '');
      fs.writeFileSync(filePath, content);
    }
    if (filePath.endsWith('.worker.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/const targetFormat = [^;]+;\n?/, '');
      content = content.replace(/const event = [^;]+;\n?/, '');
      fs.writeFileSync(filePath, content);
    }
  });
}

// Fix specific audio files
const onnxServicePath = path.join(audioDir, 'shared/engine/onnx-audio.service.ts');
if (fs.existsSync(onnxServicePath)) {
  let content = fs.readFileSync(onnxServicePath, 'utf8');
  content = content.replace(/private _cacheKey = [^;]+;\n?/, '');
  fs.writeFileSync(onnxServicePath, content);
}

// 2. Fix converter files
if (fs.existsSync(converterDir)) {
  const videoWorkerPath = path.join(converterDir, '02-video-converter/video-converter.worker.ts');
  if (fs.existsSync(videoWorkerPath)) {
    let content = fs.readFileSync(videoWorkerPath, 'utf8');
    content = content.replace(/const crf = [^;]+;\n?/, '');
    content = content.replace(/const encodingSpeed = [^;]+;\n?/, '');
    content = content.replace(/const \{ file, outputFormat, crf, encodingSpeed \} = event\.data;/, 'const { file, outputFormat } = event.data;');
    fs.writeFileSync(videoWorkerPath, content);
  }
  const libreofficePath = path.join(converterDir, 'shared/engine/libreoffice.service.ts');
  if (fs.existsSync(libreofficePath)) {
    let content = fs.readFileSync(libreofficePath, 'utf8');
    content = content.replace(/private _buffer: ArrayBuffer \| null = null;\n?/, '');
    content = content.replace(/private _targetFormat = '';\n?/, '');
    content = content.replace(/_buffer:\s*ArrayBuffer,/, '_buffer: ArrayBuffer, /* unused */');
    content = content.replace(/_targetFormat:\s*string/, '_targetFormat: string /* unused */');
    if (!content.includes('void _buffer;')) {
      content = content.replace(/return new Uint8Array\(0\);/, 'void _buffer; void _targetFormat; return new Uint8Array(0);');
    }
    fs.writeFileSync(libreofficePath, content);
  }
  const pandocPath = path.join(converterDir, 'shared/engine/pandoc.service.ts');
  if (fs.existsSync(pandocPath)) {
    let content = fs.readFileSync(pandocPath, 'utf8');
    content = content.replace(/private _options: Record<string, unknown> = \{\};\n?/, '');
    if (!content.includes('void _options;')) {
      content = content.replace(/return `Converted/, 'void _options; return `Converted');
    }
    fs.writeFileSync(pandocPath, content);
  }
}

// 3. Fix pdf files
if (fs.existsSync(pdfDir)) {
  walkDir(pdfDir, (filePath) => {
    if (filePath.endsWith('.component.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/selector:\s*'app-pdf-([a-zA-Z0-9]+)'/, (match, p1) => {
        const kebab = p1.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
        return `selector: 'app-pdf-${kebab}'`;
      });
      fs.writeFileSync(filePath, content);
    }
  });
  const dropZonePath = path.join(pdfDir, 'shared/components/pdf-drop-zone/pdf-drop-zone.component.ts');
  if (fs.existsSync(dropZonePath)) {
    let content = fs.readFileSync(dropZonePath, 'utf8');
    content = content.replace(/onFileSelected\(e: any\)/, 'onFileSelected(e: Event)');
    fs.writeFileSync(dropZonePath, content);
  }
  const opfsPath = path.join(pdfDir, 'shared/engine/opfs.service.ts');
  if (fs.existsSync(opfsPath)) {
    let content = fs.readFileSync(opfsPath, 'utf8');
    if (!content.includes('void path;')) {
      content = content.replace(/async deleteFile\(path: string\): Promise<void> \{ \/\* noop \*\/ \}/, 'async deleteFile(path: string): Promise<void> { void path; /* noop */ }');
      content = content.replace(/async readFile\(path: string\): Promise<ArrayBuffer> \{ return new ArrayBuffer\(0\); \}/, 'async readFile(path: string): Promise<ArrayBuffer> { void path; return new ArrayBuffer(0); }');
    }
    fs.writeFileSync(opfsPath, content);
  }
}

// 4. Fix video files
if (fs.existsSync(videoDir)) {
  walkDir(videoDir, (filePath) => {
    if (filePath.endsWith('.service.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/,\s*config:\s*Record<string,\s*unknown>/, '');
      content = content.replace(/config:\s*Record<string,\s*unknown>\s*,?/, '');
      fs.writeFileSync(filePath, content);
    }
    if (filePath.endsWith('.worker.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/\(\{ progress: p \}: any\)/g, '({ progress: p }: { progress: number })');
      content = content.replace(/catch\s*\{\s*\}/g, 'catch { /* ignore */ }');
      content = content.replace(/const \{ file, numParts = 2 \} = config;/, 'const { file } = config;');
      content = content.replace(/const \{ file, task \} = config;/, 'const { file } = config;');
      fs.writeFileSync(filePath, content);
    }
  });
}
