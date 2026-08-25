import { readFile, writeFile } from 'node:fs/promises';

const replacements = [
  ['src/cockpitMarkup.test.mjs', "assert.match(body, /'BRG —'/);", "assert.match(body, /'АЗИМУТ —'/);"],
  ['src/data/aisStreamAdapter.js', 'AIS-сокет не предоставляет интерфейс событий WebSocket', 'AIS socket does not provide ws emitter semantics'],
  ['src/data/layerState.test.mjs', "label: 'military flight',", "label: 'военный полёт',"],
  ['src/data/militaryAwareness.test.mjs', 'Mapped installations</strong><b aria-live="polite">?</b>', 'Нанесённые на карту объекты</strong><b aria-live="polite">?</b>'],
  ['src/data/militaryAwareness.test.mjs', 'AIS vessels</strong><b aria-live="polite">?</b>', 'Суда AIS</strong><b aria-live="polite">?</b>'],
  ['src/data/militaryAwareness.test.mjs', 'AIS vessels</strong><b aria-live="polite">0</b>', 'Суда AIS</strong><b aria-live="polite">0</b>'],
  ['src/data/rocketLaunches.test.mjs', "      'STAGE RE-ENTRY',\n      'EST. ORBIT POSITION',", "      'ЭТАП · ВХОД В АТМОСФЕРУ',\n      'EST. ORBIT POSITION',"],
  ['src/overlays/worldOverlay.test.mjs', 'Focusing Focus vessel TEST, MMSI 123', 'Фокус на Focus vessel TEST, MMSI 123'],
  ['src/voice/gevRealtime.test.mjs', 'Hold Space to speak · click mic to toggle voice', 'Удерживайте пробел для речи · нажмите микрофон для переключения голоса'],
  ['src/voice/gevRealtime.test.mjs', 'Release Space to send', 'Отпустите пробел для отправки'],
];

for (const [path, oldText, newText] of replacements) {
  const source = await readFile(path, 'utf8');
  if (!source.includes(oldText)) throw new Error(`Expected text not found in ${path}: ${oldText}`);
  await writeFile(path, source.replace(oldText, newText), 'utf8');
}

console.log(`Applied ${replacements.length} verified RU expectation fixes.`);
