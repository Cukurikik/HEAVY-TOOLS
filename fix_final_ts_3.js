const fs = require('fs');
const path = require('path');

const updates = [
    {
        file: 'src/app/modules/converter/12-html-converter/html-converter.store.ts',
        replacements: [
            {
                from: /const initialState: HtmlConverterState = {/,
                to: "const initialState: HtmlConverterState = {\n  minify: false,\n  removeComments: false,"
            }
        ]
    },
    {
        file: 'src/app/modules/converter/14-unit-converter/unit-converter.store.ts',
        replacements: [
            {
                from: /const initialState: UnitConverterState = {/,
                to: "const initialState: UnitConverterState = {\n  fromUnit: 'm',\n  toUnit: 'ft',"
            }
        ]
    },
    {
        file: 'src/app/modules/converter/15-currency-converter/currency-converter.store.ts',
        replacements: [
            {
                from: /const initialState: CurrencyConverterState = {/,
                to: "const initialState: CurrencyConverterState = {\n  fromCurrency: 'USD',\n  toCurrency: 'EUR',"
            }
        ]
    },
    {
        file: 'src/app/modules/converter/16-timezone-converter/timezone-converter.store.ts',
        replacements: [
            {
                from: /const initialState: TimezoneConverterState = {/,
                to: "const initialState: TimezoneConverterState = {\n  fromZone: 'UTC',\n  toZone: 'America/New_York',"
            }
        ]
    },
    {
        file: 'src/app/modules/converter/17-number-base-converter/number-base-converter.store.ts',
        replacements: [
            {
                from: /const initialState: NumberBaseConverterState = {/,
                to: "const initialState: NumberBaseConverterState = {\n  fromBase: 10,\n  toBase: 16,"
            }
        ]
    },
    {
        file: 'src/app/modules/converter/18-encoding-converter/encoding-converter.store.ts',
        replacements: [
            {
                from: /const initialState: EncodingConverterState = {/,
                to: "const initialState: EncodingConverterState = {\n  fromEncoding: 'UTF-8',\n  toEncoding: 'Base64',"
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
