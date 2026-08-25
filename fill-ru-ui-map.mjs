import fs from 'node:fs';

const file = 'localization/RU-UI-MAP.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const translations = {
  "Palace of Fine Arts": "Дворец изящных искусств",
  "The Presidio (former Army base)": "Президио (бывшая военная база)",
  "ILM / Lucasfilm": "ILM / Lucasfilm",
  "next to the Marina": "рядом с Мариной",
  "The Presidio — a former Army base": "Президио — бывшая военная база",
  "Crissy Field shoreline": "побережье Крисси-Филд",

  "AIS: --": "AIS: --",
  "socket factory returned nothing": "фабрика сокетов ничего не вернула",
  "AIS socket does not expose ws emitter semantics": "AIS-сокет не предоставляет интерфейс событий WebSocket",

  "Midtown West @ 34th": "Мидтаун-Уэст @ 34-я улица",
  "WTC North Plaza": "Северная площадь WTC",
  "Times Sq Northeast": "Северо-восток Таймс-сквер",
  "Market & 5th": "Маркет и 5-я улица",
  "SF Financial Core": "Финансовый центр Сан-Франциско",
  "Shibuya Crossing": "перекрёсток Сибуя",
  "Ginza Core": "центр Гиндзы",
  "Asakusa North Gate": "северные ворота Асакусы",

  "Weather / Emergency": "Погода / чрезвычайные ситуации",
  "Public Safety": "Общественная безопасность",
  "Aviation / Marine": "Авиация / морской транспорт",
  "Traffic / Transit": "Дорожное движение / транспорт",

  "Military flights": "Военные полёты",
  "AIS vessels": "Суда AIS",
  "Mapped installations": "Нанесённые на карту объекты",

  "Global Context navigation": "Навигация по глобальному контексту",
  "Previous — prior visited contact in the 250 km window":
    "Предыдущий — ранее посещённый контакт в радиусе 250 км",
  "Next — nearest unvisited contact in the 250 km window":
    "Следующий — ближайший непосещённый контакт в радиусе 250 км",

  "REPLAY ASCENT": "ПОВТОР ВЗЛЁТА",
  "Replay the estimated ascent with a following camera":
    "Повторить расчётную траекторию взлёта с камерой сопровождения",
  "NO MISSIONS AVAILABLE IN THE CURRENT 30-DAY WINDOW":
    "НЕТ ДОСТУПНЫХ МИССИЙ В ТЕКУЩЕМ 30-ДНЕВНОМ ОКНЕ",
  "ASCENT PATH ·": "ТРАЕКТОРИЯ ВЗЛЁТА ·",
  "CURRENT DISTANCE FROM EARTH ·": "ТЕКУЩЕЕ РАССТОЯНИЕ ОТ ЗЕМЛИ ·",
  "Deselect mission": "Снять выбор миссии",
  "FINAL POSITION": "ФИНАЛЬНАЯ ПОЗИЦИЯ",
  "LAUNCH SITE ·": "МЕСТО ЗАПУСКА ·",
  "LAUNCH TIME ·": "ВРЕМЯ ЗАПУСКА ·",
  "Next mission": "Следующая миссия",
  "Previous mission": "Предыдущая миссия",
  "REPLAY SPEED": "СКОРОСТЬ ПОВТОРА",
  "Replay speed multiplier": "Множитель скорости повтора",
  "SATELLITE SPEED ·": "СКОРОСТЬ СПУТНИКА ·",
  "SELECTED SPACE MISSION": "ВЫБРАННАЯ КОСМИЧЕСКАЯ МИССИЯ",
  "SHOW ALL / DESELECT": "ПОКАЗАТЬ ВСЕ / СНЯТЬ ВЫБОР",
  "Show all missions": "Показать все миссии",
  "STAGE / RE-ENTRY / RECOVERY": "ЭТАП / ВХОД В АТМОСФЕРУ / ВОЗВРАЩЕНИЕ",
  "STATUS ·": "СТАТУС ·",
  "Pause replay": "Приостановить повтор",
  "Cancel replay": "Отменить повтор",

  "Could not open that mission${detail}. Retry or explore manually.":
    "Не удалось открыть эту миссию${detail}. Повторите попытку или изучите её вручную.",
  "This browser is blocking storage, so that could not be saved.":
    "Этот браузер блокирует хранилище, поэтому сохранить данные не удалось.",

  "Awaiting telemetry...": "Ожидание телеметрии...",
  "Configuring viewer...": "Настройка просмотрщика...",
  "Initializing systems...": "Инициализация систем...",
  "Flying to Austin, TX...": "Перелёт в Остин, Техас...",
  "Restoring shared view...": "Восстановление общего вида...",

  "Bing Aerial": "Bing — спутниковый вид",
  "Bing Labels": "Bing — подписи",

  "No shots yet. Use CAPTURE SHOT to save current look.":
    "Снимков пока нет. Используйте «СОХРАНИТЬ СНИМОК», чтобы сохранить текущий вид.",

  "Edge Thickness": "Толщина границы",

  "CONTACT LOST · LAST KNOWN READOUT · NOT AN ALL-CLEAR":
    "КОНТАКТ ПОТЕРЯН · ПОСЛЕДНИЕ ИЗВЕСТНЫЕ ДАННЫЕ · ЭТО НЕ СИГНАЛ О БЕЗОПАСНОСТИ",

  "POSITION UNAVAILABLE": "ПОЗИЦИЯ НЕДОСТУПНА",
  "RESOLVING REGION": "ОПРЕДЕЛЕНИЕ РЕГИОНА",
  "REGION UNAVAILABLE": "РЕГИОН НЕДОСТУПЕН",

  "OFF AIR": "В ЭФИРЕ НЕТ СИГНАЛА",
  "STATION UNAVAILABLE": "СТАНЦИЯ НЕДОСТУПНА",
  "SOURCE · UNKNOWN": "ИСТОЧНИК · НЕИЗВЕСТЕН",
  "FRAME · LOADING": "КАДР · ЗАГРУЗКА",
  "FRAME · UNAVAILABLE": "КАДР · НЕДОСТУПЕН",

  "Enable CCTV to load camera intersections":
    "Включите CCTV, чтобы загрузить камеры на перекрёстках",

  "AI AGENT": "ИИ-АГЕНТ",
  "VOICE STANDBY": "ГОЛОСОВОЙ РЕЖИМ ОЖИДАНИЯ",
  "VOICE CONTROL": "ГОЛОСОВОЕ УПРАВЛЕНИЕ",
  "VOICE SYSTEM ERROR": "ОШИБКА ГОЛОСОВОЙ СИСТЕМЫ",
  "Check microphone permission and network access, then try again.":
    "Проверьте разрешение на использование микрофона и доступ к сети, затем повторите попытку."
};

let translated = 0;
let untranslated = [];

for (const entry of Object.values(data)) {
  const source = entry.source;

  if (translations[source] !== undefined) {
    entry.ru = translations[source];
    translated++;
  } else {
    untranslated.push(source);
  }
}

fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\\n');

console.log('==========================================');
console.log(' RUSSIAN UI MAP');
console.log('==========================================');
console.log(`Total entries: ${Object.keys(data).length}`);
console.log(`Translated now: ${translated}`);
console.log(`Remaining: ${untranslated.length}`);
console.log(`Updated: ${file}`);
console.log('');
console.log('Remaining source strings:');

for (const value of [...new Set(untranslated)].slice(0, 100)) {
  console.log(`- ${value}`);
}
