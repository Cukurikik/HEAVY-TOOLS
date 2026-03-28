import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FEATURES_DIR = path.join(__dirname, '..', 'src', 'modules', 'settings-engine', 'features');
const BLUEPRINT_PATH = path.join(__dirname, '..', '100 TUGAS PENGATURAN OMNI-TOOL.md');

// 13 Domains as heavily used by the frontend
const domains = [
  'tampilan', 'keamanan', 'akun', 'storage', 'notifikasi', 
  'video', 'audio', 'pdf', 'llm', 'plugin', 'performa', 'developer', 'converter'
];

function cleanSlug(label) {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 45)
    .replace(/-$/, '');
}

const pad = (n) => String(n).padStart(3, '0');

function extractBlueprintLabels() {
  const file = fs.readFileSync(BLUEPRINT_PATH, 'utf-8');
  const lines = file.split('\n');
  const labels = [];
  
  for (const line of lines) {
    const match = line.match(/^\-\s*\[\s*\]\s*(\d{3})\.\s+(.*)$/);
    if (match) {
      let num = parseInt(match[1]);
      let text = match[2];
      text = text.replace(/\.$/, '').trim();
      labels[num] = text;
    }
  }
  return labels;
}

// ============================================================================
// SMART inputType DETECTION — based on actual feature intent from blueprint
// ============================================================================
function detectInputType(num, label) {
  const lower = label.toLowerCase();

  // ─── SPECIFIC OVERRIDES (highest priority) ───────────────────────────
  // Feature 001: Dark/Light is a dropdown, NOT a color or toggle
  if (num === 1) return { type: 'dropdown', def: "'Dark'", opts: "['Dark', 'Light', 'System', 'AMOLED']" };
  // Feature 002: Custom CSS Injection = text area
  if (num === 2) return { type: 'text', def: "''" };
  // Feature 003: Primary color picker
  if (num === 3) return { type: 'color', def: "'#6366f1'" };
  // Feature 004: Sidebar layout
  if (num === 4) return { type: 'dropdown', def: "'Expanded'", opts: "['Expanded', 'Collapsed', 'Auto-hide', 'Floating']" };
  // Feature 006: Font size
  if (num === 6) return { type: 'dropdown', def: "'Medium'", opts: "['Small', 'Medium', 'Large', 'Extra Large']" };
  // Feature 007: Font family
  if (num === 7) return { type: 'dropdown', def: "'Inter'", opts: "['Inter', 'Roboto', 'Fira Code', 'Open Dyslexic']" };
  // Feature 014: Timestamp format
  if (num === 14) return { type: 'dropdown', def: "'24h'", opts: "['12h', '24h', 'DD/MM/YYYY', 'MM/DD/YYYY']" };
  // Feature 015: Language i18n
  if (num === 15) return { type: 'dropdown', def: "'ID'", opts: "['ID', 'EN', 'ES', 'FR', 'JP', 'DE']" };
  // Feature 016: Toast position
  if (num === 16) return { type: 'dropdown', def: "'Top-Right'", opts: "['Top-Right', 'Top-Left', 'Bottom-Right', 'Bottom-Center']" };
  // Feature 019: Modal style
  if (num === 19) return { type: 'dropdown', def: "'Popup'", opts: "['Popup', 'Full-Screen Drawer']" };
  // Feature 021: Tooltip delay
  if (num === 21) return { type: 'dropdown', def: "'500ms'", opts: "['Instan', '500ms', '1s', 'Disable']" };
  // Feature 022: Scrollbar style
  if (num === 22) return { type: 'dropdown', def: "'Minimalist'", opts: "['Minimalist', 'Native']" };
  // Feature 024: Dashboard layout
  if (num === 24) return { type: 'dropdown', def: "'Grid Cards'", opts: "['Grid Cards', 'List Detail']" };
  // Feature 025: Skeleton style
  if (num === 25) return { type: 'dropdown', def: "'Pulse'", opts: "['Pulse', 'Wave']" };
  // Feature 042: Auto-logout timer
  if (num === 42) return { type: 'dropdown', def: "'1h'", opts: "['15m', '1h', '24h', 'Never']" };

  // ─── API Key / Token / Secret / BYOK (FASE 3: 061-110) ──────────────
  // These MUST be text inputs so users can paste their API keys!
  if (lower.match(/integrasi\s|api key|api\)|token|secret|anon key|admin key|access key|pat\)|webhook url|smtp|bot token|chat id|endpoint|credentials|dsn/)) {
    return { type: 'text', def: "''" };
  }
  // Specific slug patterns for remaining BYOK entries
  if (lower.match(/masukkan|sk-|\.com|oauth|service json|server key|client id/)) {
    return { type: 'text', def: "''" };
  }
  if (lower.match(/url$|url\s|url\)|endpoint|webhook|proxy/)) {
    return { type: 'text', def: "''" };
  }

  // ─── COLOR ───────────────────────────────────────────────────────────
  if (lower.match(/warna|color|tema warna|hex\)/)) {
    return { type: 'color', def: "'#6366f1'" };
  }

  // ─── SLIDER ──────────────────────────────────────────────────────────
  if (lower.match(/slider|batas|ukuran|tingkat|sensitivitas|frame rate|volume|threshold|limit|max(\s|$)|kapasitas|durasi|delay|level|chunk|pool|allocation|count|rate\b|item display/)) {
    return { type: 'slider', def: '50', opts: '{min: 0, max: 100, step: 1}' };
  }

  // ─── DROPDOWN ────────────────────────────────────────────────────────
  if (lower.match(/pilih|format|tipe|mode |preferensi|level\s?\(|vs\s|layout|style|precision|encoder|preset/)) {
    return { type: 'dropdown', def: "'Auto'", opts: "['Auto', 'Manual', 'Strict']" };
  }

  // ─── TEXT (custom names, emails, paths, namespaces) ──────────────────
  if (lower.match(/text|kustom|custom|nama|email|pass|watermark|folder|direktori|path|prompt|pesan|banner|template/)) {
    return { type: 'text', def: "''" };
  }

  // ─── DEFAULT: TOGGLE ─────────────────────────────────────────────────
  return { type: 'toggle', def: 'false' };
}

// ============================================================================
// SMART DOM Hook generation — wires into real Tailwind CSS / localStorage
// ============================================================================
function generateDomHook(num, type, slug, label) {
  const id = pad(num);
  const escapedLabel = label.replace(/'/g, "\\'");

  // ── COLOR: Override Tailwind's --primary and --accent ──────────────────
  if (type === 'color') {
    // Feature 003 specifically controls the primary accent color
    if (num === 3) {
      return `    if (typeof window !== 'undefined') {
      const hex = String(value);
      document.documentElement.style.setProperty('--primary', hex);
      document.documentElement.style.setProperty('--accent', hex);
      document.documentElement.style.setProperty('--ring', hex);
      document.documentElement.style.setProperty('--sidebar-primary', hex);
      document.documentElement.style.setProperty('--omni-theme-primary', hex);
      localStorage.setItem('omni-theme-primary', hex);
    }`;
    }
    return `    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--omni-theme-${id}', String(value));
      localStorage.setItem('omni-color-${id}', String(value));
    }`;
  }

  // ── DROPDOWN: Dark/Light Theme Toggle (Feature 001) ───────────────────
  if (num === 1) {
    return `    if (typeof window !== 'undefined') {
      const theme = String(value).toLowerCase();
      document.documentElement.classList.remove('dark', 'light', 'amoled');
      if (theme === 'dark' || theme === 'amoled') {
        document.documentElement.classList.add('dark');
      }
      if (theme === 'amoled') {
        document.documentElement.style.setProperty('--background', '#000000');
      }
      localStorage.setItem('omni-theme-mode', theme);
    }`;
  }

  // ── TEXT: Custom CSS Injection (Feature 002) ──────────────────────────
  if (num === 2) {
    return `    if (typeof window !== 'undefined') {
      let styleEl = document.getElementById('omni-custom-css');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'omni-custom-css';
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = String(value);
      localStorage.setItem('omni-custom-css', String(value));
    }`;
  }

  // ── TEXT for API Keys / Tokens / Secrets ───────────────────────────────
  if (type === 'text') {
    return `    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-${id}-config', String(value));
    }`;
  }

  // ── SLIDER ────────────────────────────────────────────────────────────
  if (type === 'slider') {
    // Font size slider (Feature 006 if it were slider, but it's dropdown now)
    return `    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--omni-${id}-level', String(value));
      localStorage.setItem('omni-slider-${id}', String(value));
    }`;
  }

  // ── DROPDOWN (generic) ────────────────────────────────────────────────
  if (type === 'dropdown') {
    // Font family dropdown (Feature 007)
    if (num === 7) {
      return `    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--font-sans', String(value));
      localStorage.setItem('omni-font-family', String(value));
    }`;
    }
    // Font size dropdown (Feature 006)
    if (num === 6) {
      return `    if (typeof window !== 'undefined') {
      const sizeMap = { 'Small': '14px', 'Medium': '16px', 'Large': '18px', 'Extra Large': '20px' };
      document.documentElement.style.setProperty('--omni-font-size', sizeMap[String(value)] || '16px');
      localStorage.setItem('omni-font-size', String(value));
    }`;
    }
    return `    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-omni-${id}', String(value));
      localStorage.setItem('omni-dropdown-${id}', String(value));
    }`;
  }

  // ── TOGGLE (default) ──────────────────────────────────────────────────
  return `    if (typeof window !== 'undefined') {
      if (value) {
        document.body.classList.add('omni-engine-active-${id}');
      } else {
        document.body.classList.remove('omni-engine-active-${id}');
      }
      localStorage.setItem('omni-toggle-${id}', String(!!value));
    }`;
}

function generateFeatures() {
  const realLabels = extractBlueprintLabels();
  let counter = 1;

  // Kita bagi 300 menjadi 13 kategori
  const mapBlueprint = [
    { cat: 'tampilan', count: 25 },
    { cat: 'keamanan', count: 25 },
    { cat: 'akun', count: 25 },
    { cat: 'storage', count: 25 },
    { cat: 'notifikasi', count: 25 },
    { cat: 'video', count: 25 },
    { cat: 'audio', count: 25 },
    { cat: 'pdf', count: 25 },
    { cat: 'llm', count: 25 },
    { cat: 'plugin', count: 25 },
    { cat: 'performa', count: 25 },
    { cat: 'developer', count: 15 },
    { cat: 'converter', count: 10 }
  ];

  let allExports = [];

  // Wipe old dir entirely
  if (fs.existsSync(FEATURES_DIR)) {
    fs.rmSync(FEATURES_DIR, { recursive: true, force: true });
  }

  // Re-create domains
  domains.forEach(cat => {
    const dir = path.join(FEATURES_DIR, cat);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  for (const group of mapBlueprint) {
    for (let i = 0; i < group.count; i++) {
       let label = realLabels[counter] || `Settings Engine Parameter ${counter}`;
       let escapedLabel = label.replace(/'/g, "\\'");
       
       // ─── SMART TYPE DETECTION ─────────────────────────────────────
       const detected = detectInputType(counter, label);
       const t = detected.type;
       const def = detected.def;
       const opts = detected.opts || null;

       // ─── DOM HOOK GENERATION ──────────────────────────────────────
       const slug = cleanSlug(label) || `setting-${counter}`;
       const domHook = generateDomHook(counter, t, slug, label);
       const id = pad(counter);
       const fileName = `${id}-${slug}.ts`; 

       let validateBody = `return typeof value === 'boolean';`;
       if (t === 'slider') {
         validateBody = `return typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string';`;
       } else if (['dropdown', 'text', 'color'].includes(t)) {
         validateBody = `return typeof value === 'string' || typeof value === 'boolean';`;
       }

       const tsContent = [
         "import type { SettingFeatureDefinition } from '../../types';",
         "",
         `export const feature${id}: SettingFeatureDefinition = {`,
         `  id: '${id}',`,
         `  category: '${group.cat}',`,
         `  slug: '${slug}',`,
         `  label: '${escapedLabel}',`,
         `  description: 'Konfigurasi mendalam untuk ${escapedLabel}',`,
         `  inputType: '${t}',`,
         (opts ? `  options: ${opts},` : ``),
         `  defaultValue: ${def},`,
         `  `,
         `  validate: async (value) => {`,
         `    ${validateBody}`,
         `    return true; // Fallback safe`,
         `  },`,
         `  `,
         `  onAfterChange: async (value) => {`,
         domHook,
         `  }`,
         `};`
       ].filter(line => line !== '').join('\n') + '\n';

       const targetDir = path.join(FEATURES_DIR, group.cat);
       fs.writeFileSync(path.join(targetDir, fileName), tsContent, 'utf-8');
       
       allExports.push({ id, slug, fileName, cat: group.cat });
       counter++;
    }
  }

  // Generate index.ts nicely
  let indexContent = '';
  let arrFields = [];
  
  allExports.forEach(exp => {
    indexContent += `import { feature${exp.id} } from './${exp.cat}/${exp.fileName.replace('.ts', '')}';\n`;
    arrFields.push(`feature${exp.id}`);
  });

  indexContent += `\nexport const rawFeatures = [\n  ${arrFields.join(',\n  ')}\n];\n`;

  fs.writeFileSync(path.join(FEATURES_DIR, 'index.ts'), indexContent, 'utf-8');
  
  // Print summary
  const typeCounts = {};
  allExports.forEach((_, i) => {
    const label = realLabels[i + 1] || '';
    const det = detectInputType(i + 1, label);
    typeCounts[det.type] = (typeCounts[det.type] || 0) + 1;
  });
  
  console.log(`✅ Successfully regenerated 300 enterprise features!`);
  console.log(`   Type distribution:`, typeCounts);
}

generateFeatures();
