const fs = require('fs');
const path = require('path');

const updates = [
    {
        file: 'src/app/modules/converter/24-spreadsheet-converter/spreadsheet-converter.store.ts',
        replacements: [
            {
                from: /export interface SpreadsheetConverterState {/,
                to: "export interface SpreadsheetConverterState {\n  sheetName: string;"
            },
            {
                from: /const initialState: SpreadsheetConverterState = {/,
                to: "const initialState: SpreadsheetConverterState = {\n  sheetName: 'Sheet1',"
            }
        ]
    },
    {
        file: 'src/app/modules/converter/25-qr-generator/qr-generator.store.ts',
        replacements: [
            {
                from: /const initialState: QrGeneratorState = {/,
                to: "const initialState: QrGeneratorState = {\n  size: 256,\n  eccLevel: 'M',\n  color: '#000000',\n  bgColor: '#ffffff',"
            }
        ]
    },
    {
        file: 'src/app/modules/converter/26-barcode-generator/barcode-generator.store.ts',
        replacements: [
            {
                from: /const initialState: BarcodeGeneratorState = {/,
                to: "const initialState: BarcodeGeneratorState = {\n  height: 100,\n  displayValue: true,"
            }
        ]
    },
    {
        file: 'src/app/modules/converter/27-ico-converter/ico-converter.store.ts',
        replacements: [
            {
                from: /const initialState: IcoConverterState = {/,
                to: "const initialState: IcoConverterState = {\n  sizes: [16, 32, 48],"
            }
        ]
    },
    {
        file: 'src/app/modules/converter/28-gif-converter/gif-converter.store.ts',
        replacements: [
            {
                from: /const initialState: GifConverterState = {/,
                to: "const initialState: GifConverterState = {\n  fps: 15,\n  scale: -1,"
            }
        ]
    },
    {
        file: 'src/app/modules/converter/29-raw-image-converter/raw-image-converter.store.ts',
        replacements: [
            {
                from: /const initialState: RawImageConverterState = {/,
                to: "const initialState: RawImageConverterState = {\n  exposure: 0,\n  contrast: 1,"
            }
        ]
    },
    {
        file: 'src/app/modules/converter/30-batch-converter/batch-converter.store.ts',
        replacements: [
            {
                from: /export interface BatchConverterState {/,
                to: "export interface BatchConverterState {\n  concurrentTasks: number;"
            },
            {
                from: /const initialState: BatchConverterState = {/,
                to: "const initialState: BatchConverterState = {\n  concurrentTasks: 3,"
            }
        ]
    },
    {
        file: 'src/app/modules/video/13-thumbnail-generator/thumbnailGenerator.component.ts',
        replacements: [
            {
                from: /\[availableFormats\]=/g,
                to: "[formats]="
            }
        ]
    },
    {
        file: 'src/app/modules/video/15-audio-extractor/audioExtractor.component.ts',
        replacements: [
            {
                from: /\[availableFormats\]=/g,
                to: "[formats]="
            },
            {
                from: /onFormatChange\(fmt\.value\)/g,
                to: "onFormatChange(fmt.value as any)"
            }
        ]
    },
    {
        file: 'src/app/modules/video/22-video-to-gif/videoToGif.component.ts',
        replacements: [
            {
                from: /\[availableFormats\]=/g,
                to: "[formats]="
            }
        ]
    }
];

updates.forEach(({ file, replacements }) => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        replacements.forEach(({ from, to }) => {
            content = content.replace(from, to);
        });
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${file}`);
    } else {
        console.error(`File not found: ${file}`);
    }
});
