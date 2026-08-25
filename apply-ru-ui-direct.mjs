import fs from 'fs';

const replacements = {
  'src/data/rocketLaunches.js': [
    ['Resume replay', 'Продолжить повтор'],
    ['Pause replay', 'Пауза повтора'],
    ['SELECTED SPACE MISSION', 'ВЫБРАННАЯ КОСМИЧЕСКАЯ МИССИЯ'],
    ['MISSION', 'МИССИЯ'],
    ['LAUNCH SITE', 'МЕСТО ЗАПУСКА'],
    ['LAUNCH TIME', 'ВРЕМЯ ЗАПУСКА'],
    ['ORBIT', 'ОРБИТА'],
    ['ASCENT PATH', 'ТРАЕКТОРИЯ ВЗЛЁТА'],
    ['CURRENT DISTANCE FROM EARTH', 'ТЕКУЩЕЕ РАССТОЯНИЕ ОТ ЗЕМЛИ'],
    ['SATELLITE SPEED', 'СКОРОСТЬ СПУТНИКА'],
    ['PAYLOAD', 'ПОЛЕЗНАЯ НАГРУЗКА'],
    ['NAME', 'НАЗВАНИЕ'],
    ['TYPE', 'ТИП'],
    ['DESTINATION', 'НАЗНАЧЕНИЕ'],
    ['STAGE / RE-ENTRY / RECOVERY', 'СТУПЕНЬ / ВХОД В АТМОСФЕРУ / ВОЗВРАТ'],
    ['STAGE', 'СТУПЕНЬ'],
    ['STATUS', 'СТАТУС'],
    ['FINAL POSITION', 'ФИНАЛЬНАЯ ПОЗИЦИЯ'],
    ['REPLAY SPEED', 'СКОРОСТЬ ПОВТОРА'],
    ['FOCUS', 'ФОКУС'],
    ['PREV', 'НАЗАД'],
    ['NEXT', 'ДАЛЕЕ'],
    ['SHOW ALL / DESELECT', 'ПОКАЗАТЬ ВСЕ / СНЯТЬ ВЫБОР'],
    ['POSITION UNAVAILABLE', 'ПОЗИЦИЯ НЕДОСТУПНА']
  ],
  'src/ui.js': [
    ['enable CCTV to activate', 'включите CCTV для активации'],
    ['Enable CCTV to start camera-linked intelligence summaries.', 'Включите CCTV, чтобы запустить сводки аналитики, связанные с камерами.'],
    ['cameras loaded', 'камер загружено']
  ]
};

let changed = 0;
for (const [file, pairs] of Object.entries(replacements)) {
  let text = fs.readFileSync(file, 'utf8');
  for (const [from, to] of pairs) {
    const before = text;
    text = text.split(from).join(to);
    if (text !== before) changed++;
  }
  fs.writeFileSync(file, text);
}

console.log(`Direct Russian UI replacements: ${changed}`);
