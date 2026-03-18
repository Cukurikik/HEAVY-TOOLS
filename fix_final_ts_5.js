const fs = require('fs');
const path = require('path');

const updates = [
    {
        file: 'src/app/modules/converter/03-audio-converter/audio-converter.store.ts',
        replacements: [
            {
                from: /const initialState: AudioConverterState = {/,
                to: "const initialState: AudioConverterState = {\n  bitrate: '192k',"
            }
        ]
    },
    {
        file: 'src/app/modules/converter/04-document-converter/document-converter.store.ts',
        replacements: [
            {
                from: /export interface DocumentConverterState {/,
                to: "export interface DocumentConverterState {\n  extractImages: boolean;"
            }
        ]
    },
    {
        file: 'src/app/modules/converter/05-image-resizer/image-resizer.store.ts',
        replacements: [
            {
                from: /const initialState: ImageResizerState = {/,
                to: "const initialState: ImageResizerState = {\n  width: 1920,\n  height: 1080,"
            }
        ]
    },
    {
        file: 'src/app/modules/converter/06-image-compressor/image-compressor.store.ts',
        replacements: [
            {
                from: /const initialState: ImageCompressorState = {/,
                to: "const initialState: ImageCompressorState = {\n  quality: 80,"
            }
        ]
    },
    {
        file: 'src/app/modules/converter/13-color-converter/color-converter.store.ts',
        replacements: [
            {
                from: /export interface ColorConverterState {/,
                to: "export interface ColorConverterState {\n  format: string;"
            }
        ]
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
