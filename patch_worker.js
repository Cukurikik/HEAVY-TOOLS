const fs = require('fs');
let content = fs.readFileSync('src/app/modules/audio/31-music-generator/music-generator.worker.ts', 'utf8');

content = content.replace(
    /for \(let i = 0; i < outBuf\.length; i\+\+\) {\n      const s = Math\.max\(-1, Math\.min\(1, outBuf\[i\]\)\);\n      view\.setInt16\(offset, s < 0 \? s \* 0x8000 : s \* 0x7FFF, true\);\n      offset \+= 2;\n  }/,
    `for (const bufValue of outBuf) {
      const s = Math.max(-1, Math.min(1, bufValue));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      offset += 2;
  }`
);

fs.writeFileSync('src/app/modules/audio/31-music-generator/music-generator.worker.ts', content);
