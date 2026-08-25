import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.join(__dirname, 'src');
const out = new Map();

function add(file, line, value, kind) {
  value = String(value)
    .replace(/\\n/g, ' ')
    .replace(/\\t/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (value.length < 3 || value.length > 300) return;
  if (!/[A-Za-z]{2,}/.test(value)) return;

  // Технические значения
  if (/^(https?:\/\/|data:|blob:|javascript:)/i.test(value)) return;
  if (/^[A-Za-z_$][A-Za-z0-9_$./:-]*$/.test(value)) return;
  if (/^[A-Z0-9_.:/-]+$/.test(value)) return;

  if (/^(true|false|null|undefined|function|Promise|Array|Object|String|Number|Boolean|Error)$/i.test(value)) {
    return;
  }

  if (/^(Math|Cesium|window|document|console|JSON)\./.test(value)) return;

  if (/^[\d\s.,:+\-*/=<>{}()[\]$%]+$/.test(value)) return;

  const key = `${file}:${line}:${kind}:${value}`;

  if (!out.has(key)) {
    out.set(key, { file, line, kind, value });
  }
}

function scan(file) {
  const text = fs.readFileSync(file, 'utf8');

  const patterns = [
    {
      kind: 'html-text',
      re: />\s*([^<>{}\n]*[A-Za-z][^<>{}\n]*)\s*</g,
      value: m => m[1]
    },
    {
      kind: 'aria-label',
      re: /\baria-label\s*=\s*(['"`])([\s\S]*?)\1/g,
      value: m => m[2]
    },
    {
      kind: 'title',
      re: /\btitle\s*=\s*(['"`])([\s\S]*?)\1/g,
      value: m => m[2]
    },
    {
      kind: 'placeholder',
      re: /\bplaceholder\s*=\s*(['"`])([\s\S]*?)\1/g,
      value: m => m[2]
    },
    {
      kind: 'label',
      re: /\blabel\s*:\s*(['"`])([\s\S]*?)\1/g,
      value: m => m[2]
    },
    {
      kind: 'text',
      re: /\btext\s*:\s*(['"`])([\s\S]*?)\1/g,
      value: m => m[2]
    },
    {
      kind: 'description',
      re: /\bdescription\s*:\s*(['"`])([\s\S]*?)\1/g,
      value: m => m[2]
    },
    {
      kind: 'tooltip',
      re: /\btooltip\s*:\s*(['"`])([\s\S]*?)\1/g,
      value: m => m[2]
    },
    {
      kind: 'message',
      re: /\bmessage\s*:\s*(['"`])([\s\S]*?)\1/g,
      value: m => m[2]
    },
    {
      kind: 'textContent',
      re: /\btextContent\s*=\s*(['"`])([\s\S]*?)\1/g,
      value: m => m[2]
    },
    {
      kind: 'innerText',
      re: /\binnerText\s*=\s*(['"`])([\s\S]*?)\1/g,
      value: m => m[2]
    }
  ];

  for (const pattern of patterns) {
    let match;

    while ((match = pattern.re.exec(text)) !== null) {
      const value = pattern.value(match);
      const line = text.slice(0, match.index).split('\n').length;

      add(
        path.relative(__dirname, file),
        line,
        value,
        pattern.kind
      );
    }
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(p);
      continue;
    }

    if (!/\.(js|mjs|html)$/.test(entry.name)) continue;
    if (/\.test\.mjs$/.test(entry.name)) continue;

    scan(p);
  }
}

console.log('==========================================');
console.log(' GOD’S EYE VIEW — REAL UI EXTRACTION');
console.log('==========================================');
console.log(`Source: ${root}`);

walk(root);

const rows = [...out.values()].sort((a, b) =>
  a.file.localeCompare(b.file) ||
  a.line - b.line ||
  a.value.localeCompare(b.value)
);

fs.mkdirSync(path.join(__dirname, 'localization'), { recursive: true });

fs.writeFileSync(
  path.join(__dirname, 'localization/REAL-UI-STRINGS.json'),
  JSON.stringify(rows, null, 2) + '\n'
);

fs.writeFileSync(
  path.join(__dirname, 'localization/REAL-UI-STRINGS.txt'),
  rows
    .map(x => `${x.file}:${x.line} [${x.kind}] ${x.value}`)
    .join('\n') + '\n'
);

console.log(`Files scanned: ${rows.length ? new Set(rows.map(x => x.file)).size : 0}`);
console.log(`Real UI candidates: ${rows.length}`);
console.log('Created: localization/REAL-UI-STRINGS.json');
console.log('Created: localization/REAL-UI-STRINGS.txt');
console.log('==========================================');
