import fs from 'fs';

const replacements = [
  ['src/data/dataCredits.js', 'Weather data by Open-Meteo.com', 'Данные о погоде предоставлены Open-Meteo.com'],
  ['src/data/militaryAwareness.js', 'Open-source mapped/observed context. Missing broadcasts, unloaded map areas, or unmapped sites are not evidence of absence.', 'Контекст на основе открытых данных и наблюдений. Отсутствие передачи, незагруженная область карты или объект, отсутствующий на карте, не являются доказательством отсутствия.'],
  ['src/data/rocketLaunches.js', 'NO MISSIONS AVAILABLE IN THE CURRENT 30-DAY WINDOW', 'НЕТ ДОСТУПНЫХ МИССИЙ В ТЕКУЩЕМ 30-ДНЕВНОМ ОКНЕ'],
  ['src/data/rocketLaunches.js', 'STATUS ·', 'СТАТУС ·'],
  ['src/hud.js', 'TOP SECRET // SI-TK // NOFORN', 'СОВЕРШЕННО СЕКРЕТНО // SI-TK // NOFORN'],
  ['src/hud.js', 'Awaiting telemetry...', 'Ожидание телеметрии...'],
  ['src/hud.js', 'MGRS: ${mgrsLabel} LAT: ${latDMS} LON: ${lonDMS}', 'MGRS: ${mgrsLabel} ШИР: ${latDMS} ДОЛ: ${lonDMS}'],
  ['src/hud.js', 'GSD: ${gsd.toFixed(2)}m NIIRS: ${niirs.toFixed(1)}', 'GSD: ${gsd.toFixed(2)} м NIIRS: ${niirs.toFixed(1)}'],
  ['src/voice/gevRealtime.js', 'Estimated session cost on ${state.modelId} — ${state.responses} response(s).', 'Расчётная стоимость сеанса для ${state.modelId} — ответов: ${state.responses}.'],
  ['src/voice/gevRealtime.js', 'AI AGENT', 'ИИ-АГЕНТ'],
  ['src/voice/gevRealtime.js', 'VOICE STANDBY', 'ГОЛОСОВОЙ РЕЖИМ ОЖИДАНИЯ'],
  ['src/voice/gevRealtime.js', 'VOICE CONTROL', 'ГОЛОСОВОЕ УПРАВЛЕНИЕ'],
  ['src/voice/gevRealtime.js', 'Hold Space to speak · click mic to toggle voice', 'Удерживайте пробел для речи · нажмите микрофон для переключения'],
  ['src/voice/gevRealtime.js', 'VOICE SYSTEM ERROR', 'ОШИБКА ГОЛОСОВОЙ СИСТЕМЫ'],
  ['src/voice/gevRealtime.js', 'Check microphone permission and network access, then try again.', 'Проверьте разрешение на использование микрофона и доступ к сети, затем повторите попытку.']
];

let applied = 0;

for (const [file, en, ru] of replacements) {
  let text = fs.readFileSync(file, 'utf8');

  const count = text.split(en).length - 1;

  if (count === 0) {
    console.log(`SKIP: ${file} :: ${en}`);
    continue;
  }

  text = text.split(en).join(ru);
  fs.writeFileSync(file, text);
  applied += count;

  console.log(`OK ${file}: ${count}`);
}

console.log(`\nAPPLIED OCCURRENCES: ${applied}`);
