import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const audioDir = '/app/applet/src/app/modules/audio';
const videoDir = '/app/applet/src/app/modules/video';
const pdfDir = '/app/applet/src/app/modules/pdf';
const converterDir = '/app/applet/src/app/modules/converter';

// 1. Fix audio components
if (fs.existsSync(audioDir)) {
  walkDir(audioDir, (filePath) => {
    if (filePath.endsWith('.component.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/import\s*\{\s*[^}]*signal[^}]*\}\s*from\s*['"]@angular\/core['"];?\n?/, (match) => {
        let newMatch = match.replace(/\s*signal\s*,?/, '');
        if (newMatch.match(/import\s*\{\s*\}\s*from/)) return '';
        return newMatch;
      });
      content = content.replace(/import\s*\{\s*[^}]*State[^}]*\}\s*from\s*['"]\.\/[^'"]+['"];?\n?/, (match) => {
        let newMatch = match.replace(/\s*[A-Za-z]+State\s*,?/, '');
        if (newMatch.match(/import\s*\{\s*\}\s*from/)) return '';
        return newMatch;
      });
      content = content.replace(/import\s*\{\s*ExportFormat\s*\}\s*from\s*['"][^'"]+['"];?\n?/, '');
      fs.writeFileSync(filePath, content);
    }
    if (filePath.endsWith('.service.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/,\s*config: any/, '');
      content = content.replace(/config: any\s*,?/, '');
      content = content.replace(/,\s*config: unknown/, '');
      content = content.replace(/config: unknown\s*,?/, '');
      fs.writeFileSync(filePath, content);
    }
    if (filePath.endsWith('.schema.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/export const ExportFormatSchema = z\.enum\(\['wav', 'mp3', 'ogg'\]\);\n?/, '');
      fs.writeFileSync(filePath, content);
    }
    if (filePath.endsWith('.store.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/import\s*\{\s*ExportFormat\s*\}\s*from\s*['"][^'"]+['"];?\n?/, '');
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
    fs.writeFileSync(videoWorkerPath, content);
  }
  const libreofficePath = path.join(converterDir, 'shared/engine/libreoffice.service.ts');
  if (fs.existsSync(libreofficePath)) {
    let content = fs.readFileSync(libreofficePath, 'utf8');
    content = content.replace(/private _buffer: ArrayBuffer \| null = null;\n?/, '');
    content = content.replace(/private _targetFormat = '';\n?/, '');
    fs.writeFileSync(libreofficePath, content);
  }
  const pandocPath = path.join(converterDir, 'shared/engine/pandoc.service.ts');
  if (fs.existsSync(pandocPath)) {
    let content = fs.readFileSync(pandocPath, 'utf8');
    content = content.replace(/private _options: Record<string, unknown> = \{\};\n?/, '');
    fs.writeFileSync(pandocPath, content);
  }
}

// 3. Fix pdf files
if (fs.existsSync(pdfDir)) {
  walkDir(pdfDir, (filePath) => {
    if (filePath.endsWith('.component.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/selector:\s*'app-([a-zA-Z0-9]+)'/, (match, p1) => {
        const kebab = p1.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
        return `selector: 'app-${kebab}'`;
      });
      fs.writeFileSync(filePath, content);
    }
  });
  const dropZonePath = path.join(pdfDir, 'shared/components/pdf-drop-zone/pdf-drop-zone.component.ts');
  if (fs.existsSync(dropZonePath)) {
    let content = fs.readFileSync(dropZonePath, 'utf8');
    content = content.replace(/const file = \(e\.target as any\)\.files\[0\];/, 'const file = (e.target as HTMLInputElement).files?.[0];');
    fs.writeFileSync(dropZonePath, content);
  }
  const opfsPath = path.join(pdfDir, 'shared/engine/opfs.service.ts');
  if (fs.existsSync(opfsPath)) {
    let content = fs.readFileSync(opfsPath, 'utf8');
    content = content.replace(/async deleteFile\(path: string\): Promise<void> \{\s*\}/, 'async deleteFile(): Promise<void> { /* noop */ }');
    content = content.replace(/async readFile\(path: string\): Promise<ArrayBuffer> \{\s*return new ArrayBuffer\(0\);\s*\}/, 'async readFile(): Promise<ArrayBuffer> { return new ArrayBuffer(0); }');
    fs.writeFileSync(opfsPath, content);
  }
}

// 4. Fix video files
if (fs.existsSync(videoDir)) {
  walkDir(videoDir, (filePath) => {
    if (filePath.endsWith('.service.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/,\s*config: any/, '');
      content = content.replace(/config: any\s*,?/, '');
      content = content.replace(/,\s*config: unknown/, '');
      content = content.replace(/config: unknown\s*,?/, '');
      fs.writeFileSync(filePath, content);
    }
    if (filePath.endsWith('.worker.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/postMessage\(\{ type: 'error', error: \(e as any\)\.message \}\);/g, 'postMessage({ type: \'error\', error: e instanceof Error ? e.message : String(e) });');
      content = content.replace(/catch \(e\) \{\s*\}/g, 'catch (e) { /* ignore */ }');
      content = content.replace(/const numParts = [^;]+;\n?/, '');
      content = content.replace(/const task = [^;]+;\n?/, '');
      fs.writeFileSync(filePath, content);
    }
  });
  const speedStorePath = path.join(videoDir, '07-speed-controller/speed-controller.store.ts');
  if (fs.existsSync(speedStorePath)) {
    let content = fs.readFileSync(speedStorePath, 'utf8');
    content = content.replace(/import\s*\{\s*[^}]*createSelector[^}]*\}\s*from\s*['"]@ngrx\/store['"];?\n?/, (match) => {
      let newMatch = match.replace(/\s*createSelector\s*,?/, '');
      if (newMatch.match(/import\s*\{\s*\}\s*from/)) return '';
      return newMatch;
    });
    fs.writeFileSync(speedStorePath, content);
  }
}
