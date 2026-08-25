import fs from 'fs';

const mapPath = 'localization/RU-UI-MAP.json';
const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

const byFile = new Map();

for (const [key, entry] of Object.entries(map)) {
  if (!entry.ru || entry.ru === entry.source) continue;

  const m = key.match(/^(.*):(\d+):(.+)$/);
  if (!m) continue;

  const [, file, line, type] = m;
  if (!byFile.has(file)) byFile.set(file, []);
  byFile.get(file).push({
    line: Number(line),
    type,
    source: entry.source,
    ru: entry.ru
  });
}

let changed = 0;

for (const [file, entries] of byFile) {
  let text = fs.readFileSync(file, 'utf8');
  const lines = text.split('\n');

  // Обрабатываем снизу вверх, чтобы номера строк не сдвигались.
  entries.sort((a, b) => b.line - a.line);

  for (const e of entries) {
    const idx = e.line - 1;
    if (idx < 0 || idx >= lines.length) continue;

    const oldLine = lines[idx];

    // Переводим только строковый литерал/шаблон, не трогая код вокруг него.
    const escaped = e.source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const patterns = [
      new RegExp(`(['"\`])${escaped}\\1`),
      new RegExp(`(['"\`])${escaped.replace(/\\\$\{/g, '\\$\\{')}\\1`)
    ];

    let replaced = false;

    for (const re of patterns) {
      if (re.test(oldLine)) {
        const quote = oldLine.match(re)?.[1];
        if (quote) {
          const replacement = `${quote}${e.ru}${quote}`;
          lines[idx] = oldLine.replace(re, replacement);
          replaced = true;
          break;
        }
      }
    }

    if (replaced) changed++;
  }

  fs.writeFileSync(file, lines.join('\n'));
}

console.log('==========================================');
console.log(' APPLY RUSSIAN UI MAP');
console.log('==========================================');
console.log(`Files touched: ${byFile.size}`);
console.log(`Translations applied: ${changed}`);
console.log('==========================================');
