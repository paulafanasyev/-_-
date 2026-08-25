import fs from 'node:fs';

const input = 'localization/UI-TO-TRANSLATE.txt';
const output = 'localization/RU-UI-MAP.json';

const lines = fs.readFileSync(input, 'utf8')
  .split('\n')
  .map(x => x.trim())
  .filter(Boolean);

const result = {};

for (const line of lines) {
  const m = line.match(/^(.+?):(\d+)\s+\[([^\]]+)\]\s+(.+)$/);
  if (!m) continue;

  const [, file, lineNo, type, text] = m;

  result[`${file}:${lineNo}:${type}`] = {
    source: text,
    ru: null
  };
}

fs.writeFileSync(
  output,
  JSON.stringify(result, null, 2) + '\n'
);

console.log('==========================================');
console.log(' RU UI TRANSLATION MAP');
console.log('==========================================');
console.log(`Entries: ${Object.keys(result).length}`);
console.log(`Created: ${output}`);
