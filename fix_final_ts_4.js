const fs = require('fs');
const path = require('path');

const updates = [
    {
        file: 'src/app/modules/converter/04-document-converter/document-converter.store.ts',
        replacements: [{ from: /const initialState: DocumentConverterState = {/, to: "const initialState: DocumentConverterState = {\n  extractImages: false," }]
    },
    {
        file: 'src/app/modules/converter/05-image-resizer/image-resizer.store.ts',
        replacements: [{ from: /const initialState: ImageResizerState = {/, to: "const initialState: ImageResizerState = {\n  maintainAspectRatio: true," }]
    },
    {
        file: 'src/app/modules/converter/06-image-compressor/image-compressor.store.ts',
        replacements: [{ from: /const initialState: ImageCompressorState = {/, to: "const initialState: ImageCompressorState = {\n  maxSizeMB: 5," }]
    },
    {
        file: 'src/app/modules/converter/07-svg-converter/svg-converter.store.ts',
        replacements: [{ from: /const initialState: SvgConverterState = {/, to: "const initialState: SvgConverterState = {\n  scale: 1," }]
    },
    {
        file: 'src/app/modules/converter/08-base64-encoder/base64-encoder.store.ts',
        replacements: [{ from: /const initialState: Base64EncoderState = {/, to: "const initialState: Base64EncoderState = {\n  wrapLines: false," }]
    },
    {
        file: 'src/app/modules/converter/09-json-converter/json-converter.store.ts',
        replacements: [{ from: /const initialState: JsonConverterState = {/, to: "const initialState: JsonConverterState = {\n  beautify: true,\n  indent: 2," }]
    },
    {
        file: 'src/app/modules/converter/10-csv-converter/csv-converter.store.ts',
        replacements: [{ from: /const initialState: CsvConverterState = {/, to: "const initialState: CsvConverterState = {\n  delimiter: ',',\n  hasHeaders: true," }]
    },
    {
        file: 'src/app/modules/converter/11-markdown-converter/markdown-converter.store.ts',
        replacements: [{ from: /const initialState: MarkdownConverterState = {/, to: "const initialState: MarkdownConverterState = {\n  flavor: 'gfm',\n  sanitize: true," }]
    },
    {
        file: 'src/app/modules/converter/13-color-converter/color-converter.store.ts',
        replacements: [{ from: /const initialState: ColorConverterState = {/, to: "const initialState: ColorConverterState = {\n  format: 'hex'," }]
    },
    {
        file: 'src/app/modules/converter/19-font-converter/font-converter.store.ts',
        replacements: [{ from: /const initialState: FontConverterState = {/, to: "const initialState: FontConverterState = {\n  outputText: ''," }]
    },
    {
        file: 'src/app/modules/converter/20-ebook-converter/ebook-converter.store.ts',
        replacements: [{ from: /const initialState: EbookConverterState = {/, to: "const initialState: EbookConverterState = {\n  outputText: ''," }]
    }
];

updates.forEach(({ file, replacements }) => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        replacements.forEach(({ from, to }) => {
            if (!content.includes(to.split('\n')[1].trim())) {
                content = content.replace(from, to);
            }
        });
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${file}`);
    } else {
        console.error(`File not found: ${file}`);
    }
});
