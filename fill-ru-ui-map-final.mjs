const fs = require('fs');

const file = 'localization/RU-UI-MAP.json';
const map = JSON.parse(fs.readFileSync(file, 'utf8'));

const ru = {
  "City Cluster A1": "Городской кластер A1",
  "Soho Core": "Центр Сохо",
  "Rue de Rivoli": "улица Риволи",
  "Champs-Élysées North": "Север Елисейских полей",
  "National Mall Center": "Центр Национальной аллеи",
  "Pentagon South": "Юг Пентагона",
  "DIFC Loop": "Петля DIFC",
  "Downtown East": "Восточный центр города",
  "Congress Southbound": "Конгресс — южное направление",
  "Downtown West": "Западный центр города",

  "Weather data by Open-Meteo.com": "Данные о погоде предоставлены Open-Meteo.com",

  "Fire · FRP ${formatFrp(strongest.frp)} MW":
    "Пожар · FRP ${formatFrp(strongest.frp)} МВт",
  "Fire · FRP ${formatFrp(fire.frp)} MW":
    "Пожар · FRP ${formatFrp(fire.frp)} МВт",

  "military flight": "военный полёт",

  "Focus ${escapeHtml(accessibleLabel)}":
    "Фокус на ${escapeHtml(accessibleLabel)}",

  "Open-source mapped/observed context. Missing broadcasts, unloaded map areas, or unmapped sites are not evidence of absence.":
    "Контекст на основе открытых данных и наблюдений. Отсутствие передачи, незагруженная область карты или объект, отсутствующий на карте, не являются доказательством отсутствия.",

  "${label} · ${formatAwarenessDistance(item.distanceM)} ${bearingText}${courseText}":
    "${label} · ${formatAwarenessDistance(item.distanceM)} ${bearingText}${courseText}",

  "Select ${escapeMissionText(label)}":
    "Выбрать ${escapeMissionText(label)}",

  "STAGE RE-ENTRY / RECOVERY · ${mission}":
    "ЭТАП · ВХОД В АТМОСФЕРУ / ВОССТАНОВЛЕНИЕ · ${mission}",

  "ORBIT REPLAY · ${mission}":
    "ПОВТОР ОРБИТЫ · ${mission}",

  "PAUSED · ${title}":
    "ПАУЗА · ${title}",

  "STAGE RE-ENTRY":
    "ЭТАП · ВХОД В АТМОСФЕРУ",

  "Add the full Starlink broadband shell (thousands of extra points)":
    "Добавить полную широкополосную оболочку Starlink (тысячи дополнительных точек)",

  "Loading the Starlink shell…":
    "Загрузка оболочки Starlink…",

  "Showing the full Starlink shell — click for the core catalog only":
    "Показана полная оболочка Starlink — нажмите, чтобы оставить только основной каталог",

  "Awaiting telemetry...":
    "Ожидание телеметрии...",

  "Error: ${describeError(error)}":
    "Ошибка: ${describeError(error)}",

  "Focusing ${item.label}":
    "Фокус на ${item.label}",

  "No shots yet. Use CAPTURE SHOT to save current look.":
    "Снимков пока нет. Используйте «СОХРАНИТЬ СНИМОК», чтобы сохранить текущий вид.",

  "CONTACT LOST · LAST KNOWN READOUT · NOT AN ALL-CLEAR":
    "КОНТАКТ ПОТЕРЯН · ПОСЛЕДНИЕ ИЗВЕСТНЫЕ ДАННЫЕ · ЭТО НЕ СИГНАЛ О БЕЗОПАСНОСТИ",

  "BRG —":
    "АЗИМУТ —",

  "POSITION UNAVAILABLE":
    "ПОЗИЦИЯ НЕДОСТУПНА",

  "RESOLVING REGION":
    "ОПРЕДЕЛЕНИЕ РЕГИОНА",

  "REGION UNAVAILABLE":
    "РЕГИОН НЕДОСТУПЕН",

  "${expanded ? 'Collapse' : 'Expand'} contact panel":
    "${expanded ? 'Свернуть' : 'Развернуть'} панель контакта",

  "${expanded ? 'Collapse' : 'Expand'} briefing panel":
    "${expanded ? 'Свернуть' : 'Развернуть'} панель сводки",

  "${action} Cockpit display options":
    "${action} параметры отображения кабины",

  "${action} Cockpit Radio controls":
    "${action} управление радио кабины",

  "${action} compact Radio controls":
    "${action} компактное управление радио",

  "${kind} · ${status}":
    "${kind} · ${status}",

  "${field.label}":
    "${field.label}",

  "${camera.city} · ${camera.name}":
    "${camera.city} · ${camera.name}",

  "Enable CCTV to load camera intersections":
    "Включите CCTV, чтобы загрузить камеры на перекрёстках",

  "${action} ${panelName}":
    "${action} ${panelName}",

  "${action} Radio":
    "${action} радио",

  "Voice model tier — applies next session":
    "Уровень голосовой модели — применяется в следующем сеансе",

  "Estimated session cost":
    "Расчётная стоимость сеанса",

  "Voice control — hold Space to speak; click to toggle voice":
    "Голосовое управление — удерживайте пробел для речи; нажмите микрофон для переключения",

  "Hold Space to speak · click mic to toggle voice":
    "Удерживайте пробел для речи · нажмите микрофон для переключения",

  "VOICE SYSTEM ERROR":
    "ОШИБКА ГОЛОСОВОЙ СИСТЕМЫ",

  "Check microphone permission and network access, then try again.":
    "Проверьте разрешение на использование микрофона и доступ к сети, затем повторите попытку.",

  "Estimated session cost on ${state.modelId} — ${state.responses} response(s).":
    "Расчётная стоимость сеанса для ${state.modelId} — ответов: ${state.responses}.",

  "Current God's Eye View viewport screenshot. Read any clearly visible street, building, and place labels in the image and combine them with the structured nearbyPlaces, streetLabels, and scene context. Do not invent labels that are not legible.":
    "Текущий снимок экрана God's Eye View. Прочитайте только чётко видимые названия улиц, зданий и мест на изображении и сопоставьте их со структурированными данными nearbyPlaces, streetLabels и контекстом сцены. Не придумывайте нечитаемые названия.",

  "TOP SECRET // SI-TK // NOFORN":
    "СОВЕРШЕННО СЕКРЕТНО // SI-TK // NOFORN",

  "MGRS: ${formatted}":
    "MGRS: ${formatted}",

  "MGRS: ---":
    "MGRS: ---",

  "MGRS: ${mgrsLabel} LAT: ${latDMS} LON: ${lonDMS}":
    "MGRS: ${mgrsLabel} ШИР: ${latDMS} ДОЛ: ${lonDMS}",

  "GSD: ${gsd.toFixed(2)}m NIIRS: ${niirs.toFixed(1)}":
    "GSD: ${gsd.toFixed(2)} м NIIRS: ${niirs.toFixed(1)}",

  "COLL: ${h}:${m}:${s}Z":
    "СБЛИЖЕНИЕ: ${h}:${m}:${s}Z",

  "ONA: ${ona.toFixed(1)}°":
    "ONA: ${ona.toFixed(1)}°",

  "United States":
    "Соединённые Штаты",

  "VOICE STANDBY":
    "ГОЛОСОВОЙ РЕЖИМ ОЖИДАНИЯ",

  "VOICE CONTROL":
    "ГОЛОСОВОЕ УПРАВЛЕНИЕ"
};

// Строки, которые являются только данными/техническими значениями.
// Их НЕ переводим.
const technical = new Set([
  "element rather than an",
  "${item.label} ${this._formatCount(item.count)}",
  "${_replaySpeed.toFixed(_replaySpeed % 1 ? 2 : 0)}×",
  "${index + 1} / ${_launches.length}",
  "${_launches.length} / 30D",
  "${latDMS} ${lonDMS}",
  "${pct}%",
  "${clamped}%",
  "${fadePct}%",
  "${outsideOpacityPct}%",
  "${tuning.densityPct}%",
  "${sharpenPct}%",
  "${density}%",
  "${loaded}/${total}",
  "${total}/${total}",
  "${value}%",
  "${latitude.toFixed(3)}, ${longitude.toFixed(3)}",
  "${latitude.toFixed(4)}, ${longitude.toFixed(4)}",
  "rgba(255, 216, 128, 0.95)",
  "rgba(225, 255, 210, 0.97)",
  "rgba(255, 236, 208, 0.98)",
  "rgba(200, 250, 255, 0.97)",
  "${style.toUpperCase()} · ${mode} · ${shot.durationSec.toFixed(1)}s + ${shot.holdSec.toFixed(1)}s",
  "${lat} · ${lon}",
  "${this.briefPageIndex + 1} / ${count}",
  "${camera.city} · ${camera.name}",
  "${kind} · ${status}",
  "${field.label}",
  "${action} ${panelName}",
  "${category.label}",
  "ALLOC01 · FL350 · 451 kts"
]);

let translated = 0;

for (const entry of Object.values(map)) {
  const source = entry.source;

  if (entry.ru !== null) continue;
  if (technical.has(source)) continue;

  if (Object.prototype.hasOwnProperty.call(ru, source)) {
    entry.ru = ru[source];
    translated++;
  }
}

fs.writeFileSync(file, JSON.stringify(map, null, 2) + '\n');

const remaining = Object.values(map)
  .filter(x => x.ru === null && !technical.has(x.source));

console.log('==========================================');
console.log(' FINAL RUSSIAN UI MAP');
console.log('==========================================');
console.log(`Translated this pass: ${translated}`);
console.log(`Still untranslated real UI: ${remaining.length}`);
console.log(`Created: ${file}`);

if (remaining.length) {
  console.log('\nREMAINING REAL UI STRINGS:');
  for (const x of remaining) console.log(`- ${x.source}`);
}
