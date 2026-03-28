const fs = require('fs');
const path = require('path');

const featuresDir = path.join(__dirname, '..', 'src', 'modules', 'settings-engine', 'features');

function getHeuristics(label, slug) {
  const lcLabel = label.toLowerCase();
  const lcSlug = slug.toLowerCase();
  
  // COLOR
  if (lcLabel.includes('warna') || lcLabel.includes('color') || lcLabel.includes('theme accent')) {
    return {
      inputType: 'color',
      defaultValue: "'#3B82F6'"
    };
  }

  // TEXT
  if (lcLabel.includes('api key') || lcLabel.includes('prompt') || lcLabel.includes('path') || lcLabel.includes('url') || lcLabel.includes('token') || lcLabel.match(/\bcss\b/)) {
    return {
      inputType: 'text',
      defaultValue: "''"
    };
  }

  // SLIDER (numbers)
  if (lcLabel.includes('kualitas') || lcLabel.includes('level') || lcLabel.includes('ukuran') && lcSlug.includes('font') || lcLabel.includes('batas') || lcLabel.includes('interval') || lcLabel.includes('timeout') || lcLabel.includes('maksimum') || lcLabel.includes('jumlah') || lcLabel.includes('radius') || lcLabel.includes('transparansi') || lcLabel.includes('zoom')) {
    let min = 0, max = 100, step = 1;
    let def = "50";
    if (lcLabel.includes('kualitas')) { def = "80"; }
    if (lcLabel.includes('batas ram') || lcLabel.includes('memory')) { min = 1024; max = 8192; step = 512; def = "4096"; }
    if (lcLabel.includes('timeout')) { min = 1000; max = 60000; step = 1000; def = "30000"; }
    
    return {
      inputType: 'slider',
      defaultValue: def,
      optionsField: `\n  options: { min: ${min}, max: ${max}, step: ${step} },`
    };
  }

  // DROPDOWN (enums)
  if (lcLabel.includes('mode') || lcLabel.includes('jenis') || lcLabel.includes('ukuran output') || lcLabel.includes('format') || lcLabel.includes('lokasi') || lcLabel.includes('prioritas') || lcLabel.includes('resolusi') || lcLabel.includes('bahasa')) {
    let def = "'Auto'";
    let options = `[ { label: 'Auto', value: 'Auto' }, { label: 'High', value: 'High' }, { label: 'Medium', value: 'Medium' }, { label: 'Low', value: 'Low' } ]`;
    
    if (lcLabel.includes('format')) {
      def = "'MP4'";
      options = `[ { label: 'MP4', value: 'MP4' }, { label: 'MKV', value: 'MKV' }, { label: 'WebM', value: 'WebM' } ]`;
    } else if (lcLabel.includes('bahasa')) {
      def = "'Indonesia'";
      options = `[ { label: 'Indonesia', value: 'Indonesia' }, { label: 'English', value: 'English' } ]`;
    } else if (lcLabel.includes('prioritas') || lcLabel.includes('ukuran')) {
      def = "'Medium'";
    } else if (lcLabel.includes('mode sst')) {
      def = "'Online'";
      options = `[ { label: 'Online', value: 'Online' }, { label: 'Offline (Whisper WASM)', value: 'Offline (Whisper WASM)' } ]`;
    } else if (lcLabel.includes('jenis llm') || lcLabel.includes('model default')) {
       def = "'GPT-4o'";
       options = `[ { label: 'GPT-4o', value: 'GPT-4o' }, { label: 'Claude 3.5 Sonnet', value: 'Claude 3.5 Sonnet' }, { label: 'Gemini 1.5 Pro', value: 'Gemini 1.5 Pro' }, { label: 'Llama 3 Local', value: 'Llama 3 Local' } ]`;
    }

    return {
      inputType: 'dropdown',
      defaultValue: def,
      optionsField: `\n  options: ${options},`
    };
  }

  // DEFAULT (Toggle)
  return {
    inputType: 'toggle',
    defaultValue: "false"
  };
}

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') && !fullPath.endsWith('index.ts') && entry.name.match(/^\d{3}-feat/)) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      
      // Extract label and slug
      const labelMatch = content.match(/label:\s*(['"`])(.*?)\1/);
      const slugMatch = content.match(/slug:\s*(['"`])(.*?)\1/);
      
      if (!labelMatch || !slugMatch) continue;
      
      const label = labelMatch[2];
      const slug = slugMatch[2];
      
      // Check if already modified manually
      if (content.includes("inputType: 'dropdown'") || content.includes("inputType: 'slider'") || content.includes("inputType: 'color'") || content.includes("inputType: 'text'")) {
        continue;
      }
      
      const h = getHeuristics(label, slug);
      if (h.inputType !== 'toggle') {
        // Replace inputType
        content = content.replace(/inputType:\s*['"`]toggle['"`],/, `inputType: '${h.inputType}',${h.optionsField || ''}`);
        // Replace defaultValue
        content = content.replace(/defaultValue:\s*(false|true),/, `defaultValue: ${h.defaultValue},`);
        
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated ${entry.name}: changed to ${h.inputType}`);
      }
    }
  }
}

console.log('Starting mass setting feature refactoring...');
processDirectory(featuresDir);
console.log('Complete!');
