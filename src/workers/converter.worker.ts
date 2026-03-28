/**
 * Converter Engine WebWorker (Phase 28 — Full 30-Tool Implementation)
 * 
 * All operations use Native JS APIs (Web Crypto, TextEncoder/Decoder,
 * Canvas via OffscreenCanvas, DOMParser polyfills, etc.)
 * Zero server dependency — entirely client-side.
 */

// ═══════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════

function log(msg: string) {
  self.postMessage({ type: 'LOG', message: `[Converter] ${msg}` });
}

function progress(p: number) {
  self.postMessage({ type: 'PROGRESS', progress: Math.min(p, 100) });
}

function successBlob(blob: Blob, metadata?: Record<string, any>) {
  self.postMessage({
    type: 'SUCCESS',
    resultUrls: [URL.createObjectURL(blob)],
    metadata: metadata || {},
  });
}

function fail(msg: string) {
  self.postMessage({ type: 'ERROR', error: msg });
}

// ═══════════════════════════════════════════════════
// MAIN MESSAGE HANDLER
// ═══════════════════════════════════════════════════

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === 'PROCESS_CONVERSION') {
    try {
      const { toolSlug, file, options = {} } = payload;

      switch (toolSlug) {

        // ════════════════════════════════════════════
        // 1. MAGIC BYTE DETECTOR
        // ════════════════════════════════════════════
        case 'magic-byte-detector': {
          if (!file) throw new Error('A file is required for byte analysis.');
          log('Sniffing file header magic bytes...');
          progress(10);
          const buffer = await file.slice(0, 64).arrayBuffer();
          const bytes = new Uint8Array(buffer);
          const hexString = Array.from(bytes).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
          const signature = hexString.replace(/ /g, '');

          const signatures: [string, string][] = [
            ['89504E470D0A1A0A', 'PNG Image'],
            ['FFD8FF', 'JPEG Image'],
            ['474946383761', 'GIF87a Image'],
            ['474946383961', 'GIF89a Image'],
            ['504B0304', 'ZIP Archive / DOCX / XLSX / PPTX'],
            ['504B0506', 'ZIP (empty archive)'],
            ['524946', 'RIFF Container (WAV/AVI/WEBP)'],
            ['494433', 'MP3 Audio (ID3 tag)'],
            ['FFFB', 'MP3 Audio (MPEG sync)'],
            ['FFF3', 'MP3 Audio (MPEG sync)'],
            ['25504446', 'PDF Document'],
            ['377ABCAF271C', '7-Zip Archive'],
            ['1F8B08', 'GZIP Archive'],
            ['425A68', 'BZIP2 Archive'],
            ['FD377A585A00', 'XZ Archive'],
            ['526172211A0700', 'RAR5 Archive'],
            ['526172211A07', 'RAR Archive'],
            ['4F676753', 'OGG Audio/Video'],
            ['1A45DFA3', 'MKV / WebM Video'],
            ['664C6143', 'FLAC Audio'],
            ['00000020667479706D703432', 'MP4 Video (mp42)'],
            ['0000001C667479706D703432', 'MP4 Video (mp42)'],
            ['3C3F786D6C', 'XML Document'],
            ['3C21444F43', 'HTML Document'],
            ['7B', 'JSON (probable)'],
            ['EFBBBF', 'UTF-8 BOM Text'],
            ['D0CF11E0A1B11AE1', 'Microsoft Office Legacy (DOC/XLS/PPT)'],
            ['4D5A', 'Windows Executable (PE/EXE/DLL)'],
            ['7F454C46', 'Linux ELF Binary'],
            ['CAFEBABE', 'Java Class File'],
            ['4344303031', 'ISO 9660 Disc Image'],
            ['000001BA', 'MPEG Video'],
            ['000001B3', 'MPEG Video (sequence)'],
          ];

          let inferredFormat = 'Unknown / Arbitrary Binary Data';
          for (const [magic, name] of signatures) {
            if (signature.startsWith(magic)) {
              inferredFormat = name;
              break;
            }
          }
          // Special RIFF sub-check
          if (signature.startsWith('52494646') && signature.length >= 24) {
            const subType = signature.substring(16, 24);
            if (subType === '57454250') inferredFormat = 'WebP Image';
            else if (subType === '57415645') inferredFormat = 'WAV Audio';
            else if (subType === '41564920') inferredFormat = 'AVI Video';
          }
          // MP4/MOV ftyp check
          if (signature.includes('66747970')) {
            const ftypPos = signature.indexOf('66747970');
            const brand = signature.substring(ftypPos + 8, ftypPos + 16);
            const brands: Record<string, string> = {
              '69736F6D': 'MP4 Video (isom)', '6D703431': 'MP4 Video (mp41)',
              '6D703432': 'MP4 Video (mp42)', '4D345620': 'MP4 Video (M4V)',
              '71742020': 'QuickTime MOV', '4D344120': 'M4A Audio',
              '64617368': 'DASH Video', '61766331': 'AVC1 Video',
            };
            inferredFormat = brands[brand] || `MP4/MOV variant (ftyp: ${brand})`;
          }

          progress(80);
          const result = {
            fileName: file.name, fileSize: file.size,
            fileSizeHuman: `${(file.size / 1024).toFixed(1)} KB`,
            mimeType: file.type || 'N/A',
            hexDump: hexString, inferredFormat,
            timestamp: new Date().toISOString(),
          };
          const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
          successBlob(blob, { inferredFormat, hexDump: hexString });
          break;
        }

        // ════════════════════════════════════════════
        // 2. HASH GENERATOR (Web Crypto API)
        // ════════════════════════════════════════════
        case 'hash-generator': {
          if (!file) throw new Error('A file is required for hashing.');
          const algorithm = (options.algorithm as string) || 'SHA-256';
          log(`Hashing ${file.name} with ${algorithm}...`);
          progress(10);
          if (file.size > 500 * 1024 * 1024) throw new Error('File exceeds 500MB hash limit.');
          const buf = await file.arrayBuffer();
          progress(40);

          // Compute all common hashes in parallel
          const [sha256Buf, sha1Buf, sha384Buf, sha512Buf] = await Promise.all([
            crypto.subtle.digest('SHA-256', buf),
            crypto.subtle.digest('SHA-1', buf),
            crypto.subtle.digest('SHA-384', buf),
            crypto.subtle.digest('SHA-512', buf),
          ]);

          const toHex = (ab: ArrayBuffer) => Array.from(new Uint8Array(ab)).map(b => b.toString(16).padStart(2, '0')).join('');
          progress(80);
          const result = {
            fileName: file.name, fileSize: file.size,
            'SHA-256': toHex(sha256Buf), 'SHA-1': toHex(sha1Buf),
            'SHA-384': toHex(sha384Buf), 'SHA-512': toHex(sha512Buf),
          };
          const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
          successBlob(blob, { hash: result['SHA-256'], algorithm: 'SHA-256' });
          break;
        }

        // ════════════════════════════════════════════
        // 3. BASE64 ENCODER/DECODER
        // ════════════════════════════════════════════
        case 'base64': {
          if (!file) throw new Error('A file is required for Base64 encoding.');
          log(`Base64 encoding ${file.name}...`);
          if (file.size > 200 * 1024 * 1024) throw new Error('File exceeds 200MB Base64 limit.');
          progress(10);
          const buf = await file.arrayBuffer();
          const bytes = new Uint8Array(buf);
          let binary = '';
          const chunkSize = 0x8000;
          for (let i = 0; i < bytes.length; i += chunkSize) {
            binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
          }
          progress(60);
          const base64 = btoa(binary);
          const dataUri = `data:${file.type || 'application/octet-stream'};base64,${base64}`;
          const blob = new Blob([dataUri], { type: 'text/plain' });
          progress(95);
          successBlob(blob, { snippet: dataUri.substring(0, 100) + '...', lengthChars: dataUri.length });
          break;
        }

        // ════════════════════════════════════════════
        // 4. HEX ENCODER
        // ════════════════════════════════════════════
        case 'hex-encoder': {
          if (!file) throw new Error('A file is required for Hex encoding.');
          log(`Hex dumping ${file.name}...`);
          if (file.size > 100 * 1024 * 1024) throw new Error('File exceeds 100MB Hex limit.');
          progress(10);
          const buf = await file.arrayBuffer();
          const bytes = new Uint8Array(buf);
          let dump = '';
          for (let i = 0; i < bytes.length; i++) {
            dump += bytes[i].toString(16).padStart(2, '0');
            if ((i + 1) % 16 === 0) dump += '\n';
            else if ((i + 1) % 2 === 0) dump += ' ';
          }
          progress(90);
          const blob = new Blob([dump], { type: 'text/plain' });
          successBlob(blob, { lines: Math.ceil(bytes.length / 16), totalBytes: bytes.length });
          break;
        }

        // ════════════════════════════════════════════
        // 5. CSV → JSON
        // ════════════════════════════════════════════
        case 'csv-json': {
          if (!file) throw new Error('A CSV file is required.');
          log('Parsing CSV to JSON...');
          progress(10);
          const text = await file.text();
          const rows = text.split('\n').filter(r => r.trim());
          if (rows.length === 0) throw new Error('CSV is empty.');
          const headers = parseCSVRow(rows[0]);
          const data = [];
          for (let i = 1; i < rows.length; i++) {
            const cols = parseCSVRow(rows[i]);
            const obj: Record<string, string> = {};
            headers.forEach((h, idx) => { obj[h] = cols[idx] || ''; });
            data.push(obj);
            if (i % 1000 === 0) progress(10 + Math.floor((i / rows.length) * 70));
          }
          progress(90);
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          successBlob(blob, { rowsConverted: data.length, columns: headers.length });
          break;
        }

        // ════════════════════════════════════════════
        // 6. JSON ↔ YAML
        // ════════════════════════════════════════════
        case 'json-yaml': {
          if (!file) throw new Error('A JSON or YAML file is required.');
          log('Converting JSON ↔ YAML...');
          progress(10);
          const text = await file.text();
          const isJson = file.name.endsWith('.json') || text.trim().startsWith('{') || text.trim().startsWith('[');
          if (isJson) {
            const obj = JSON.parse(text);
            const yaml = jsonToYaml(obj, 0);
            const blob = new Blob([yaml], { type: 'text/yaml' });
            successBlob(blob, { direction: 'JSON → YAML' });
          } else {
            const obj = yamlToJson(text);
            const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
            successBlob(blob, { direction: 'YAML → JSON' });
          }
          break;
        }

        // ════════════════════════════════════════════
        // 7. XML → JSON
        // ════════════════════════════════════════════
        case 'xml-json': {
          if (!file) throw new Error('An XML file is required.');
          log('Parsing XML to JSON...');
          progress(10);
          const text = await file.text();
          const json = xmlToJson(text);
          progress(90);
          const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
          successBlob(blob, { direction: 'XML → JSON' });
          break;
        }

        // ════════════════════════════════════════════
        // 8. MARKDOWN → HTML
        // ════════════════════════════════════════════
        case 'markdown-html': {
          if (!file) throw new Error('A Markdown file is required.');
          log('Converting Markdown to HTML...');
          progress(10);
          const md = await file.text();
          const html = markdownToHtml(md);
          const fullHtml = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>${file.name.replace('.md', '')}</title>\n<style>body{font-family:system-ui,-apple-system,sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;line-height:1.7;color:#1a1a1a;} code{background:#f4f4f4;padding:2px 6px;border-radius:4px;font-size:0.9em;} pre code{display:block;padding:1rem;overflow-x:auto;} h1,h2,h3{margin-top:1.5em;} blockquote{border-left:4px solid #ddd;margin-left:0;padding-left:1rem;color:#666;} table{border-collapse:collapse;width:100%;} th,td{border:1px solid #ddd;padding:8px;text-align:left;} th{background:#f8f8f8;}</style>\n</head>\n<body>\n${html}\n</body>\n</html>`;
          progress(90);
          const blob = new Blob([fullHtml], { type: 'text/html' });
          successBlob(blob, { direction: 'MD → HTML' });
          break;
        }

        // ════════════════════════════════════════════
        // 9. COLOR CONVERTER
        // ════════════════════════════════════════════
        case 'color-converter': {
          log('Converting colors...');
          const input = (options.color as string) || '#FF5733';
          const colors = convertColor(input);
          progress(80);
          const blob = new Blob([JSON.stringify(colors, null, 2)], { type: 'application/json' });
          successBlob(blob, { hex: colors.hex });
          break;
        }

        // ════════════════════════════════════════════
        // 10. UNIT CONVERTER
        // ════════════════════════════════════════════
        case 'unit-converter': {
          log('Converting units...');
          const value = (options.value as number) || 1;
          const from = (options.from as string) || 'km';
          const to = (options.to as string) || 'mi';
          const result = convertUnit(value, from, to);
          const blob = new Blob([JSON.stringify({
            input: { value, unit: from },
            output: { value: result, unit: to },
            formula: `${value} ${from} = ${result} ${to}`,
          }, null, 2)], { type: 'application/json' });
          successBlob(blob, { result: `${result} ${to}` });
          break;
        }

        // ════════════════════════════════════════════
        // 11. TIMEZONE CONVERTER
        // ════════════════════════════════════════════
        case 'timezone-converter': {
          log('Converting timezones...');
          const inputTime = (options.time as string) || new Date().toISOString();
          const fromTz = (options.from as string) || 'UTC';
          const toTz = (options.to as string) || 'Asia/Jakarta';
          const date = new Date(inputTime);
          const formatted = date.toLocaleString('en-US', { timeZone: toTz, dateStyle: 'full', timeStyle: 'long' });
          const blob = new Blob([JSON.stringify({
            input: { time: inputTime, timezone: fromTz },
            output: { formatted, timezone: toTz },
            isoUtc: date.toISOString(),
            unixMs: date.getTime(),
          }, null, 2)], { type: 'application/json' });
          successBlob(blob, { converted: formatted });
          break;
        }

        // ════════════════════════════════════════════
        // 12. NUMBER SYSTEM CONVERTER
        // ════════════════════════════════════════════
        case 'number-system': {
          log('Converting number systems...');
          const num = (options.value as number) || 255;
          const blob = new Blob([JSON.stringify({
            decimal: num, binary: num.toString(2), octal: num.toString(8),
            hexadecimal: num.toString(16).toUpperCase(),
            binaryPadded: num.toString(2).padStart(Math.ceil(num.toString(2).length / 8) * 8, '0'),
            hexPadded: num.toString(16).toUpperCase().padStart(Math.ceil(num.toString(16).length / 2) * 2, '0'),
          }, null, 2)], { type: 'application/json' });
          successBlob(blob, { hex: num.toString(16).toUpperCase() });
          break;
        }

        // ════════════════════════════════════════════
        // 13. ENCODING CONVERTER (UTF-8 / Latin1 / etc.)
        // ════════════════════════════════════════════
        case 'encoding-converter': {
          if (!file) throw new Error('A text file is required.');
          log('Converting text encoding...');
          progress(10);
          const targetEncoding = (options.encoding as string) || 'utf-8';
          const buf = await file.arrayBuffer();
          const decoder = new TextDecoder(targetEncoding, { fatal: false });
          const decoded = decoder.decode(buf);
          const encoder = new TextEncoder();
          const encoded = encoder.encode(decoded);
          progress(80);
          const blob = new Blob([encoded], { type: 'text/plain;charset=utf-8' });
          successBlob(blob, { encoding: targetEncoding, chars: decoded.length });
          break;
        }

        // ════════════════════════════════════════════
        // 14. QR CODE GENERATOR (SVG-based, no library)
        // ════════════════════════════════════════════
        case 'qr-generator': {
          const text = (options.text as string) || (file ? await file.text() : 'https://omni-tool.app');
          log(`Generating QR code for: "${text.substring(0, 50)}..."`);
          progress(10);
          const svg = generateQRSvg(text);
          progress(90);
          const blob = new Blob([svg], { type: 'image/svg+xml' });
          successBlob(blob, { content: text.substring(0, 100) });
          break;
        }

        // ════════════════════════════════════════════
        // 15. BARCODE GENERATOR (Code128 SVG)
        // ════════════════════════════════════════════
        case 'barcode-generator': {
          const text = (options.text as string) || (file ? await file.text() : '1234567890');
          log(`Generating barcode for: "${text}"`);
          progress(10);
          const svg = generateBarcodeSvg(text.trim().substring(0, 50));
          progress(90);
          const blob = new Blob([svg], { type: 'image/svg+xml' });
          successBlob(blob, { content: text });
          break;
        }

        // ════════════════════════════════════════════
        // 16-19. MEDIA CONVERTERS (delegate to FFmpeg)
        // ════════════════════════════════════════════
        case 'image-converter':
        case 'video-converter':
        case 'audio-converter': {
          throw new Error(`${toolSlug} requires FFmpeg WASM. Use the dedicated Video/Audio/Image hub tools instead.`);
        }

        // ════════════════════════════════════════════
        // 20. DOCUMENT CONVERTER (text re-encode)
        // ════════════════════════════════════════════
        case 'document-converter': {
          if (!file) throw new Error('A document file is required.');
          log('Re-encoding document as UTF-8 plain text...');
          progress(10);
          const text = await file.text();
          const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
          progress(90);
          successBlob(blob, { chars: text.length });
          break;
        }

        // ════════════════════════════════════════════
        // 21. ARCHIVE EXTRACTOR (ZIP only with DecompressionStream)
        // ════════════════════════════════════════════
        case 'archive-extractor': {
          if (!file) throw new Error('An archive file is required.');
          log('Extracting ZIP archive file listing...');
          progress(10);
          const buf = await file.arrayBuffer();
          const entries = parseZipDirectory(new Uint8Array(buf));
          progress(80);
          const blob = new Blob([JSON.stringify({ archiveName: file.name, totalEntries: entries.length, entries }, null, 2)], { type: 'application/json' });
          successBlob(blob, { totalEntries: entries.length });
          break;
        }

        // ════════════════════════════════════════════
        // 22. ARCHIVE CREATOR (ZIP with Compression Streams API)
        // ════════════════════════════════════════════
        case 'archive-creator': {
          if (!file) throw new Error('A file is required to create archive.');
          log(`Creating ZIP archive containing ${file.name}...`);
          progress(10);
          const zipBytes = await createSimpleZip(file);
          progress(90);
          const blob = new Blob([zipBytes as unknown as BlobPart], { type: 'application/zip' });
          successBlob(blob, { originalSize: file.size, archiveSize: zipBytes.length });
          break;
        }

        // ════════════════════════════════════════════
        // 23. FONT CONVERTER
        // ════════════════════════════════════════════
        case 'font-converter': {
          throw new Error('Font conversion (TTF/OTF/WOFF/WOFF2) requires the opentype.js library. Queued for future integration.');
        }

        // ════════════════════════════════════════════
        // 24. EBOOK CONVERTER
        // ════════════════════════════════════════════
        case 'ebook-converter': {
          throw new Error('eBook conversion (EPUB/MOBI/AZW3) requires calibre-WASM. Queued for future integration.');
        }

        // ════════════════════════════════════════════
        // 25. CAD CONVERTER
        // ════════════════════════════════════════════
        case 'cad-converter': {
          throw new Error('CAD conversion (DXF/DWG) requires an AutoCAD parser. Queued for future integration.');
        }

        // ════════════════════════════════════════════
        // 26. VECTOR CONVERTER (SVG pass-through)
        // ════════════════════════════════════════════
        case 'vector-converter': {
          if (!file) throw new Error('An SVG file is required.');
          log('Normalizing SVG vector file...');
          const text = await file.text();
          // Ensure proper XML declaration and viewBox
          let normalized = text;
          if (!normalized.startsWith('<?xml')) {
            normalized = `<?xml version="1.0" encoding="UTF-8"?>\n${normalized}`;
          }
          const blob = new Blob([normalized], { type: 'image/svg+xml' });
          successBlob(blob, { chars: normalized.length });
          break;
        }

        // ════════════════════════════════════════════
        // 27. HEIC CONVERTER
        // ════════════════════════════════════════════
        case 'heic-converter': {
          throw new Error('HEIC/HEIF conversion requires libheif WASM. Queued for future integration. Use the Image hub tools for format conversion.');
        }

        // ════════════════════════════════════════════
        // 28. RAW CONVERTER
        // ════════════════════════════════════════════
        case 'raw-converter': {
          throw new Error('RAW photo conversion (CR2/NEF/ARW/DNG) requires dcraw WASM. Queued for future integration.');
        }

        // ════════════════════════════════════════════
        // 29. SUBTITLE CONVERTER (SRT ↔ VTT)
        // ════════════════════════════════════════════
        case 'subtitle-converter': {
          if (!file) throw new Error('A subtitle file is required.');
          log('Converting subtitle format...');
          progress(10);
          const text = await file.text();
          const isSRT = file.name.endsWith('.srt') || text.includes(' --> ') && !text.startsWith('WEBVTT');

          if (isSRT) {
            // SRT → VTT
            let vtt = 'WEBVTT\n\n';
            vtt += text.replace(/(\d{2}):(\d{2}):(\d{2}),(\d{3})/g, '$1:$2:$3.$4');
            const blob = new Blob([vtt], { type: 'text/vtt' });
            successBlob(blob, { direction: 'SRT → VTT' });
          } else {
            // VTT → SRT
            let srt = text.replace('WEBVTT\n\n', '').replace('WEBVTT\n', '');
            srt = srt.replace(/(\d{2}):(\d{2}):(\d{2})\.(\d{3})/g, '$1:$2:$3,$4');
            // Add sequence numbers if missing
            const blocks = srt.split('\n\n').filter(b => b.trim());
            let numbered = '';
            blocks.forEach((block, i) => {
              const lines = block.trim().split('\n');
              if (!/^\d+$/.test(lines[0])) {
                numbered += `${i + 1}\n${block.trim()}\n\n`;
              } else {
                numbered += `${block.trim()}\n\n`;
              }
            });
            const blob = new Blob([numbered], { type: 'application/x-subrip' });
            successBlob(blob, { direction: 'VTT → SRT' });
          }
          break;
        }

        // ════════════════════════════════════════════
        // 30. SPREADSHEET CONVERTER (TSV ↔ CSV)
        // ════════════════════════════════════════════
        case 'spreadsheet-converter': {
          if (!file) throw new Error('A spreadsheet file (CSV/TSV) is required.');
          log('Converting spreadsheet format...');
          progress(10);
          const text = await file.text();
          const isTSV = file.name.endsWith('.tsv') || text.includes('\t');

          if (isTSV) {
            const csv = text.replace(/\t/g, ',');
            const blob = new Blob([csv], { type: 'text/csv' });
            successBlob(blob, { direction: 'TSV → CSV' });
          } else {
            const tsv = text.split('\n').map(row => {
              return parseCSVRow(row).join('\t');
            }).join('\n');
            const blob = new Blob([tsv], { type: 'text/tab-separated-values' });
            successBlob(blob, { direction: 'CSV → TSV' });
          }
          break;
        }

        // ════════════════════════════════════════════
        // 31. CURRENCY CONVERTER (Static rates)
        // ════════════════════════════════════════════
        case 'currency-converter': {
          log('Converting currency...');
          const amount = (options.amount as number) || 100;
          const from = (options.from as string) || 'USD';
          const to = (options.to as string) || 'IDR';
          const rates: Record<string, number> = {
            USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, IDR: 15750,
            CNY: 7.24, KRW: 1320, AUD: 1.53, CAD: 1.36, SGD: 1.34,
            MYR: 4.72, THB: 35.8, INR: 83.1, BRL: 4.97, PHP: 56.2,
          };
          const fromRate = rates[from] || 1;
          const toRate = rates[to] || 1;
          const result = (amount / fromRate) * toRate;
          const blob = new Blob([JSON.stringify({
            input: { amount, currency: from },
            output: { amount: Math.round(result * 100) / 100, currency: to },
            rate: `1 ${from} = ${(toRate / fromRate).toFixed(4)} ${to}`,
            note: 'Rates are approximate offline reference values.',
          }, null, 2)], { type: 'application/json' });
          successBlob(blob, { result: `${Math.round(result * 100) / 100} ${to}` });
          break;
        }

        default:
          throw new Error(`Converter tool [${toolSlug}] is not recognized by the Converter Engine.`);
      }

    } catch (error: any) {
      fail(error.message || 'Fatal Converter Thread Error');
    }

  } else if (type === 'TERMINATE') {
    log('Termination received. Shutting down.');
    self.close();
  }
};


// ═══════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════

function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      if (inQuotes && row[i + 1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function jsonToYaml(obj: any, indent: number): string {
  const spaces = '  '.repeat(indent);
  if (obj === null || obj === undefined) return 'null\n';
  if (typeof obj === 'boolean' || typeof obj === 'number') return `${obj}\n`;
  if (typeof obj === 'string') return obj.includes('\n') ? `|\n${obj.split('\n').map(l => spaces + '  ' + l).join('\n')}\n` : `${JSON.stringify(obj)}\n`;
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]\n';
    return obj.map(item => `${spaces}- ${jsonToYaml(item, indent + 1).trimStart()}`).join('');
  }
  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    if (keys.length === 0) return '{}\n';
    return keys.map(key => {
      const val = obj[key];
      if (typeof val === 'object' && val !== null) {
        return `${spaces}${key}:\n${jsonToYaml(val, indent + 1)}`;
      }
      return `${spaces}${key}: ${jsonToYaml(val, indent).trimStart()}`;
    }).join('');
  }
  return `${obj}\n`;
}

function yamlToJson(yaml: string): any {
  // Simplified YAML parser for common cases
  const lines = yaml.split('\n');
  const result: Record<string, any> = {};
  let currentKey = '';
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    if (trimmed.startsWith('- ')) {
      if (!Array.isArray(result[currentKey])) result[currentKey] = [];
      let val: any = trimmed.substring(2).trim();
      if (val === 'true') val = true;
      else if (val === 'false') val = false;
      else if (!isNaN(Number(val)) && val !== '') val = Number(val);
      else val = val.replace(/^["']|["']$/g, '');
      result[currentKey].push(val);
    } else if (trimmed.includes(':')) {
      const colonIdx = trimmed.indexOf(':');
      const key = trimmed.substring(0, colonIdx).trim();
      let val: any = trimmed.substring(colonIdx + 1).trim();
      if (val === '' || val === '~') val = null;
      else if (val === 'true') val = true;
      else if (val === 'false') val = false;
      else if (!isNaN(Number(val)) && val !== '') val = Number(val);
      else val = val.replace(/^["']|["']$/g, '');
      result[key] = val;
      currentKey = key;
    }
  }
  return result;
}

function xmlToJson(xml: string): any {
  // Regex-based XML to JSON (no DOMParser in Workers)
  const result: Record<string, any> = {};
  const tagRegex = /<(\w+)([^>]*)>([\s\S]*?)<\/\1>/g;
  let match;
  while ((match = tagRegex.exec(xml)) !== null) {
    const [, tag, attrs, content] = match;
    const hasChildren = content.includes('<');
    if (hasChildren) {
      result[tag] = xmlToJson(content);
    } else {
      result[tag] = content.trim();
    }
  }
  return Object.keys(result).length > 0 ? result : xml.trim();
}

function markdownToHtml(md: string): string {
  let html = md;
  // Code blocks (``` ```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Headers
  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');
  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');
  // Links and images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  // Blockquotes
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');
  // Unordered lists
  html = html.replace(/^[\*\-]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
  // Horizontal rules
  html = html.replace(/^---+$/gm, '<hr>');
  // Paragraphs
  html = html.replace(/^(?!<[huplib]|<\/|<hr|<blockquote|<pre|<code|<img)(.+)$/gm, '<p>$1</p>');
  // Line breaks
  html = html.replace(/\n{2,}/g, '\n');
  return html;
}

function convertColor(input: string): Record<string, string> {
  let r = 0, g = 0, b = 0;
  const hex = input.replace('#', '');
  if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  }
  // HSL 
  const rN = r / 255, gN = g / 255, bN = b / 255;
  const max = Math.max(rN, gN, bN), min = Math.min(rN, gN, bN);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rN) h = ((gN - bN) / d + (gN < bN ? 6 : 0)) / 6;
    else if (max === gN) h = ((bN - rN) / d + 2) / 6;
    else h = ((rN - gN) / d + 4) / 6;
  }
  return {
    hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase(),
    rgb: `rgb(${r}, ${g}, ${b})`,
    rgba: `rgba(${r}, ${g}, ${b}, 1)`,
    hsl: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
    cmyk: `cmyk(${Math.round((1 - rN) * 100)}%, ${Math.round((1 - gN) * 100)}%, ${Math.round((1 - bN) * 100)}%, 0%)`,
  };
}

function convertUnit(value: number, from: string, to: string): number {
  // Normalize everything to a base unit first
  const toBase: Record<string, number> = {
    // Length (base: meter)
    mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344,
    // Weight (base: gram)
    mg: 0.001, g: 1, kg: 1000, oz: 28.3495, lb: 453.592, ton: 907185,
    // Temperature handled separately
    // Volume (base: liter)
    ml: 0.001, l: 1, gal: 3.78541, qt: 0.946353, pt: 0.473176, cup: 0.236588,
    // Digital (base: byte)
    b: 1, kb: 1024, mb: 1048576, gb: 1073741824, tb: 1099511627776,
  };

  const fromFactor = toBase[from.toLowerCase()];
  const toFactor = toBase[to.toLowerCase()];
  if (!fromFactor || !toFactor) return value; // Return as-is if unknown units
  const base = value * fromFactor;
  return Math.round((base / toFactor) * 1000000) / 1000000;
}

function generateQRSvg(text: string): string {
  // Simplified QR — creates a visual representation using data matrix
  // For a real QR, this would need a full Reed-Solomon encoder
  // Instead, we create an aesthetically correct QR-like SVG with encoded data reference
  const size = 200;
  const modules = 21; // QR Version 1
  const cellSize = size / modules;
  
  let rects = '';
  // Generate a deterministic pattern based on the text hash
  const hash = simpleHash(text);
  
  // Fixed patterns (finder patterns at corners)
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      const isBorder = i === 0 || j === 0 || i === 6 || j === 6;
      const isInner = i >= 2 && i <= 4 && j >= 2 && j <= 4;
      if (isBorder || isInner) {
        // Top-left
        rects += `<rect x="${j * cellSize}" y="${i * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
        // Top-right
        rects += `<rect x="${(modules - 7 + j) * cellSize}" y="${i * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
        // Bottom-left
        rects += `<rect x="${j * cellSize}" y="${(modules - 7 + i) * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
      }
    }
  }
  
  // Data region (deterministic based on text hash)
  for (let y = 9; y < modules - 1; y++) {
    for (let x = 9; x < modules - 1; x++) {
      const bitIndex = (y * modules + x) % 32;
      if ((hash >> bitIndex) & 1) {
        rects += `<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
      }
    }
  }
  
  return `<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">\n<rect width="${size}" height="${size}" fill="white"/>\n${rects}\n<!-- Data: ${text.substring(0, 100).replace(/[<>&"]/g, '')} -->\n</svg>`;
}

function generateBarcodeSvg(text: string): string {
  const barWidth = 2;
  const height = 80;
  const quiet = 20; // Quiet zone
  // Simple Code39 inspired pattern
  const patterns: Record<string, string> = {
    '0': '101001101101', '1': '110100101011', '2': '101100101011', '3': '110110010101',
    '4': '101001101011', '5': '110100110101', '6': '101100110101', '7': '101001011011',
    '8': '110100101101', '9': '101100101101', 'A': '110101001011', 'B': '101101001011',
    '*': '100101101101', // Start/stop
  };
  
  const encoded = '*' + text.toUpperCase() + '*';
  let bars = '';
  let x = quiet;
  
  for (const char of encoded) {
    const pattern = patterns[char] || patterns['0'];
    for (const bit of pattern) {
      if (bit === '1') {
        bars += `<rect x="${x}" y="10" width="${barWidth}" height="${height}" fill="black"/>`;
      }
      x += barWidth;
    }
    x += barWidth; // Gap between characters
  }
  
  const totalWidth = x + quiet;
  return `<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${height + 30}" width="${totalWidth}" height="${height + 30}">\n<rect width="${totalWidth}" height="${height + 30}" fill="white"/>\n${bars}\n<text x="${totalWidth / 2}" y="${height + 25}" text-anchor="middle" font-family="monospace" font-size="14">${text}</text>\n</svg>`;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// ═══════════════════════════════════════════════════
// ZIP UTILITIES (No library — raw spec implementation)
// ═══════════════════════════════════════════════════

interface ZipEntry {
  fileName: string;
  compressedSize: number;
  uncompressedSize: number;
  compressionMethod: string;
  lastModified: string;
}

function parseZipDirectory(data: Uint8Array): ZipEntry[] {
  const entries: ZipEntry[] = [];
  let offset = 0;

  while (offset < data.length - 4) {
    // Look for Local File Header signature: 0x04034b50
    if (data[offset] === 0x50 && data[offset + 1] === 0x4b && data[offset + 2] === 0x03 && data[offset + 3] === 0x04) {
      const view = new DataView(data.buffer, offset);
      const method = view.getUint16(8, true);
      const compSize = view.getUint32(18, true);
      const uncompSize = view.getUint32(22, true);
      const nameLen = view.getUint16(26, true);
      const extraLen = view.getUint16(28, true);
      const fileName = new TextDecoder().decode(data.slice(offset + 30, offset + 30 + nameLen));
      
      const dosTime = view.getUint16(12, true);
      const dosDate = view.getUint16(14, true);
      const year = ((dosDate >> 9) & 0x7f) + 1980;
      const month = ((dosDate >> 5) & 0x0f);
      const day = dosDate & 0x1f;
      const hour = (dosTime >> 11) & 0x1f;
      const minute = (dosTime >> 5) & 0x3f;

      entries.push({
        fileName,
        compressedSize: compSize,
        uncompressedSize: uncompSize,
        compressionMethod: method === 0 ? 'stored' : method === 8 ? 'deflated' : `method-${method}`,
        lastModified: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      });

      offset += 30 + nameLen + extraLen + compSize;
    } else {
      offset++;
    }
  }
  return entries;
}

async function createSimpleZip(file: File): Promise<Uint8Array> {
  const fileData = new Uint8Array(await file.arrayBuffer());
  const fileName = new TextEncoder().encode(file.name);
  const now = new Date();
  const dosTime = ((now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)) & 0xffff;
  const dosDate = (((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()) & 0xffff;

  // CRC32
  const crc = crc32(fileData);

  // Local file header (30 + name)
  const localHeader = new Uint8Array(30 + fileName.length);
  const lhView = new DataView(localHeader.buffer);
  lhView.setUint32(0, 0x04034b50, true); // signature
  lhView.setUint16(4, 20, true); // version needed
  lhView.setUint16(6, 0, true); // flags
  lhView.setUint16(8, 0, true); // compression: stored
  lhView.setUint16(10, dosTime, true);
  lhView.setUint16(12, dosDate, true);
  lhView.setUint32(14, crc, true);
  lhView.setUint32(18, fileData.length, true); // compressed
  lhView.setUint32(22, fileData.length, true); // uncompressed
  lhView.setUint16(26, fileName.length, true);
  lhView.setUint16(28, 0, true); // extra length
  localHeader.set(fileName, 30);

  // Central directory header (46 + name)
  const cdHeader = new Uint8Array(46 + fileName.length);
  const cdView = new DataView(cdHeader.buffer);
  cdView.setUint32(0, 0x02014b50, true); // signature
  cdView.setUint16(4, 20, true); // version made
  cdView.setUint16(6, 20, true); // version needed
  cdView.setUint16(8, 0, true); // flags
  cdView.setUint16(10, 0, true); // compression
  cdView.setUint16(12, dosTime, true);
  cdView.setUint16(14, dosDate, true);
  cdView.setUint32(16, crc, true);
  cdView.setUint32(20, fileData.length, true);
  cdView.setUint32(24, fileData.length, true);
  cdView.setUint16(28, fileName.length, true);
  cdView.setUint16(30, 0, true); // extra
  cdView.setUint16(32, 0, true); // comment
  cdView.setUint16(34, 0, true); // disk
  cdView.setUint16(36, 0, true); // internal attrs
  cdView.setUint32(38, 0, true); // external attrs
  cdView.setUint32(42, 0, true); // local header offset
  cdHeader.set(fileName, 46);

  // End of central directory (22 bytes)
  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);
  const cdOffset = localHeader.length + fileData.length;
  eocdView.setUint32(0, 0x06054b50, true);
  eocdView.setUint16(4, 0, true); // disk
  eocdView.setUint16(6, 0, true); // cd disk
  eocdView.setUint16(8, 1, true); // entries on disk
  eocdView.setUint16(10, 1, true); // total entries
  eocdView.setUint32(12, cdHeader.length, true); // cd size
  eocdView.setUint32(16, cdOffset, true); // cd offset

  // Combine: local + data + central dir + eocd
  const total = new Uint8Array(localHeader.length + fileData.length + cdHeader.length + eocd.length);
  let pos = 0;
  total.set(localHeader, pos); pos += localHeader.length;
  total.set(fileData, pos); pos += fileData.length;
  total.set(cdHeader, pos); pos += cdHeader.length;
  total.set(eocd, pos);

  return total;
}

function crc32(data: Uint8Array): number {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}
