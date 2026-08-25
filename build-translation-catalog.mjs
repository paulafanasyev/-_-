import fs from 'node:fs';

const input = 'localization/REAL-UI-STRINGS.json';
const rows = JSON.parse(fs.readFileSync(input, 'utf8'));

const technical = [
  /Math\./,
  /Cesium\./,
  /Promise/,
  /Array/,
  /Set/,
  /Number\./,
  /String\(/,
  /\bundefined\b/,
  /\bnull\b/,
  /&&/,
  /\|\|/,
  /===/,
  /!==/,
  /\?=/,
  /=>/,
  /^\s*[\d.,+\-*/=<>()[\]{}]+/
];

const brands = [
  'Google',
  'OpenStreetMap',
  'NASA',
  'AISStream',
  'GDELT',
  'Natural Earth',
  'Radio Browser',
  'TfL',
  'Launch Library',
  'Re:Earth',
  'TomTom'
];

function classify(x) {
  const v = x.value;

  if (technical.some(r => r.test(v))) {
    return 'TECHNICAL';
  }

  if (brands.some(b => v.includes(b))) {
    return 'PROPER_NAME';
  }

  if (
    x.kind === 'label' ||
    x.kind === 'title' ||
    x.kind === 'aria-label' ||
    x.kind === 'placeholder' ||
    x.kind === 'textContent' ||
    x.kind === 'innerText'
  ) {
    return 'UI';
  }

  if (
    /[A-Za-z]{3,}\s+[A-Za-z]{3,}/.test(v) ||
    /^[A-Z][A-Z\s/·—-]+$/.test(v)
  ) {
    return 'LIKELY_UI';
  }

  return 'REVIEW';
}

const catalog = rows.map(x => ({
  ...x,
  classification: classify(x),
  russian: ''
}));

const ui = catalog.filter(x =>
  x.classification === 'UI' ||
  x.classification === 'LIKELY_UI'
);

const review = catalog.filter(x => x.classification === 'REVIEW');
const technicalRows = catalog.filter(x => x.classification === 'TECHNICAL');
const proper = catalog.filter(x => x.classification === 'PROPER_NAME');

fs.writeFileSync(
  'localization/TRANSLATION-CATALOG.json',
  JSON.stringify(catalog, null, 2) + '\n'
);

fs.writeFileSync(
  'localization/UI-TO-TRANSLATE.txt',
  ui.map(x =>
    `${x.file}:${x.line} [${x.kind}] ${x.value}`
  ).join('\n') + '\n'
);

fs.writeFileSync(
  'localization/REVIEW-STRINGS.txt',
  review.map(x =>
    `${x.file}:${x.line} [${x.kind}] ${x.value}`
  ).join('\n') + '\n'
);

fs.writeFileSync(
  'localization/TECHNICAL-STRINGS.txt',
  technicalRows.map(x =>
    `${x.file}:${x.line} [${x.kind}] ${x.value}`
  ).join('\n') + '\n'
);

fs.writeFileSync(
  'localization/PROPER-NAMES.txt',
  proper.map(x =>
    `${x.file}:${x.line} [${x.kind}] ${x.value}`
  ).join('\n') + '\n'
);

console.log('==========================================');
console.log(' TRANSLATION CATALOG');
console.log('==========================================');
console.log(`Total candidates : ${catalog.length}`);
console.log(`UI to translate  : ${ui.length}`);
console.log(`Review           : ${review.length}`);
console.log(`Technical        : ${technicalRows.length}`);
console.log(`Proper names     : ${proper.length}`);
console.log('==========================================');
console.log('Created:');
console.log('  localization/TRANSLATION-CATALOG.json');
console.log('  localization/UI-TO-TRANSLATE.txt');
console.log('  localization/REVIEW-STRINGS.txt');
console.log('  localization/TECHNICAL-STRINGS.txt');
console.log('  localization/PROPER-NAMES.txt');
