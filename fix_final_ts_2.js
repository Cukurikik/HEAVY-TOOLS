const fs = require('fs');
const path = require('path');

const updates = [
    {
        file: 'src/app/modules/converter/21-archive-converter/archive-converter.store.ts',
        replacements: [
            {
                from: /const initialState: ArchiveConverterState = {/,
                to: "const initialState: ArchiveConverterState = {\n  compressionLevel: 5,"
            }
        ]
    },
    {
        file: 'src/app/modules/converter/22-cad-converter/cad-converter.store.ts',
        replacements: [
            {
                from: /export interface CadConverterState {/,
                to: "export interface CadConverterState {\n  unit: string;"
            },
            {
                from: /const initialState: CadConverterState = {/,
                to: "const initialState: CadConverterState = {\n  unit: 'mm',"
            }
        ]
    },
    {
        file: 'src/app/modules/converter/23-subtitle-converter/subtitle-converter.store.ts',
        replacements: [
            {
                from: /export interface SubtitleConverterState {/,
                to: "export interface SubtitleConverterState {\n  fps: number;"
            },
            {
                from: /const initialState: SubtitleConverterState = {/,
                to: "const initialState: SubtitleConverterState = {\n  fps: 24,"
            }
        ]
    },
    {
        file: 'src/app/modules/video/15-audio-extractor/audioExtractor.component.ts',
        replacements: [
            {
                from: /onFormatChange\(fmt\.value as any\)/g,
                to: "onFormatChange($any(fmt.value))"
            },
            {
                from: /onFormatChange\(format: 'wav' \| 'mp3' \| 'aac'\)/g,
                to: "onFormatChange(format: string)"
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
