#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

PROJECT="$HOME/gods-eye-view-ru"
cd "$PROJECT"

echo "=========================================="
echo " GOD'S EYE VIEW — РУССКАЯ ВЕРСИЯ"
echo " Разработчик: Афанасьев Павел"
echo "=========================================="

echo
echo "[1/8] Проверка Git..."

CHANGES="$(git status --porcelain)"
UNEXPECTED="$(printf '%s\n' "$CHANGES" | grep -vE '^[ ?MADRCTU!]{1,2} (localization/|ru-localize\.sh|README\.md)' || true)"

if [ -n "$UNEXPECTED" ]; then
  echo "ОШИБКА: обнаружены неожиданные изменения:"
  printf '%s\n' "$UNEXPECTED"
  exit 1
fi

echo "Git: clean"

echo
echo "[2/8] Создание резервной ветки..."

BACKUP_BRANCH="backup-before-russian-$(date +%Y%m%d-%H%M%S)"
git branch "$BACKUP_BRANCH"

echo "Резервная ветка: $BACKUP_BRANCH"

echo
echo "[3/8] Создание структуры локализации..."

mkdir -p localization

cat > localization/README-RU.md <<'EOF'
# Русская версия God's Eye View

**Разработчик русской версии: Афанасьев Павел**

Контакты разработчика:

- Телефон: +84834012046
- WhatsApp (Россия): +79148289946
- Email: xongphavietnam@gmail.com
- Telegram: @PaulPavel_it_dev
- Репозиторий русской версии: https://github.com/paulafanasyev/-_-

Эта директория содержит материалы русской локализации интерфейса God's Eye View.

Исходный проект и оригинальные авторские права сохраняются в соответствии
с лицензией исходного проекта.

Русская локализация не изменяет программные идентификаторы, API-ключи,
URL, JSON-структуры, CSS-классы или внутренние имена функций.
EOF

cat > localization/ru.json <<'EOF'
{
  "language": "ru",
  "languageName": "Русский",
  "developer": {
    "name": "Афанасьев Павел",
    "role": "Разработчик русской версии",
    "phone": "+84834012046",
    "whatsapp": "+79148289946",
    "email": "xongphavietnam@gmail.com",
    "telegram": "@PaulPavel_it_dev",
    "repository": "https://github.com/paulafanasyev/-_-"
  },
  "ui": {
    "LIVE": "ПРЯМОЙ ЭФИР",
    "LIVE SIGNALS": "ЖИВЫЕ СИГНАЛЫ",
    "CONTROL PANEL": "ПАНЕЛЬ УПРАВЛЕНИЯ",
    "LOCATION": "МЕСТОПОЛОЖЕНИЕ",
    "SATELLITES": "СПУТНИКИ",
    "AIRCRAFT": "ВОЗДУШНЫЕ СУДА",
    "VESSELS": "СУДА",
    "CAMERAS": "КАМЕРЫ",
    "RADIO": "РАДИО",
    "WEATHER": "ПОГОДА",
    "THERMAL": "ТЕПЛОВИЗОР",
    "SURVEILLANCE": "НАБЛЮДЕНИЕ",
    "COCKPIT": "КАБИНА",
    "CONTACTS": "КОНТАКТЫ",
    "FLIGHTS": "РЕЙСЫ",
    "NORMAL": "ОБЫЧНЫЙ",
    "OFF": "ВЫКЛ.",
    "ON": "ВКЛ.",
    "TRACK": "ОТСЛЕЖИВАТЬ",
    "RESET": "СБРОСИТЬ",
    "CLOSE": "ЗАКРЫТЬ",
    "OPEN": "ОТКРЫТЬ",
    "SEARCH": "ПОИСК",
    "SETTINGS": "НАСТРОЙКИ",
    "MAP": "КАРТА",
    "NEWS": "НОВОСТИ",
    "LOCAL INFO": "МЕСТНАЯ ИНФОРМАЦИЯ",
    "REGIONAL NEWS": "НОВОСТИ РЕГИОНА",
    "GLOBAL CONTEXT": "ГЛОБАЛЬНЫЙ КОНТЕКСТ",
    "CYCLE OFF": "ЦИКЛ ВЫКЛ.",
    "NEXT": "СЛЕДУЮЩИЙ",
    "PREVIOUS": "ПРЕДЫДУЩИЙ",
    "ENABLE": "ВКЛЮЧИТЬ",
    "DISABLE": "ОТКЛЮЧИТЬ",
    "CLEAR": "ОЧИСТИТЬ",
    "CLEAR SELECTED DATA LAYERS": "ОЧИСТИТЬ ВЫБРАННЫЕ СЛОИ ДАННЫХ",
    "RESET TO FULL GLOBE VIEW": "ВЕРНУТЬ ПОЛНЫЙ ВИД ГЛОБУСА",
    "EXIT COCKPIT VIEW": "ВЫЙТИ ИЗ РЕЖИМА КАБИНЫ",
    "RESET COCKPIT TO FULL GLOBE VIEW": "ВЕРНУТЬ КАБИНУ К ПОЛНОМУ ВИДУ ГЛОБУСА",
    "CONTACT NAVIGATION": "НАВИГАЦИЯ ПО КОНТАКТАМ",
    "CONTACT": "КОНТАКТ",
    "CONTACTS": "КОНТАКТЫ",
    "PREVIOUS — PRIOR VISITED CONTACT": "ПРЕДЫДУЩИЙ — РАНЕЕ ПОСЕЩЁННЫЙ КОНТАКТ",
    "NEXT — NEAREST UNVISITED CONTACT": "СЛЕДУЮЩИЙ — БЛИЖАЙШИЙ НЕПОСЕЩЁННЫЙ КОНТАКТ",
    "COLLAPSE CONTACT PANEL": "СВЕРНУТЬ ПАНЕЛЬ КОНТАКТА"
  }
}
EOF

echo
echo "[4/8] Создание отчёта пользовательских строк..."

node > localization/ui-candidates.txt <<'NODE'
const fs = require('fs');
const path = require('path');

const root = path.join(process.cwd(), 'src');
const result = new Set();

function walk(dir) {
  for (const e of fs.readdirSync(dir, {withFileTypes:true})) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(js|mjs|html)$/.test(e.name) && !/\.test\./.test(e.name)) {
      scan(p);
    }
  }
}

function scan(file) {
  const s = fs.readFileSync(file, 'utf8');

  const patterns = [
    /\bplaceholder\s*[:=]\s*(['"`])([^'"`]{2,})\1/g,
    /\baria-label\s*[:=]\s*(['"`])([^'"`]{2,})\1/g,
    /\btitle\s*[:=]\s*(['"`])([^'"`]{2,})\1/g,
    /\btextContent\s*=\s*(['"`])([^'"`]{2,})\1/g,
    /\binnerText\s*=\s*(['"`])([^'"`]{2,})\1/g
  ];

  for (const re of patterns) {
    let m;
    while ((m = re.exec(s))) {
      const value = m[2].trim();

      if (
        value.length >= 3 &&
        value.length <= 200 &&
        /[A-Za-z]{2,}/.test(value) &&
        !/^[A-Za-z_$][A-Za-z0-9_$.-]*$/.test(value)
      ) {
        const line = s.slice(0, m.index).split('\n').length;
        result.add(`${path.relative(process.cwd(), file)}:${line}: ${value}`);
      }
    }
  }
}

walk(root);

process.stdout.write([...result].sort().join('\n') + '\n');
NODE

echo "Найдено потенциальных пользовательских строк:"
wc -l localization/ui-candidates.txt

echo
echo "[5/8] Создание информации о разработчике..."

cat > localization/DEVELOPER-RU.md <<'EOF'
# Разработчик русской версии

## Афанасьев Павел

Русская локализация и адаптация пользовательского интерфейса God's Eye View.

**Телефон:** +84834012046  
**WhatsApp:** +79148289946  
**Email:** xongphavietnam@gmail.com  
**Telegram:** @PaulPavel_it_dev  
**Репозиторий:** https://github.com/paulafanasyev/-_-
EOF

echo
echo "[6/8] Добавление информации в README..."

if ! grep -q "Разработчик русской версии: Афанасьев Павел" README.md; then
cat >> README.md <<'EOF'

---

# Русская версия

## Разработчик русской версии

**Афанасьев Павел**

- Телефон: +84834012046
- WhatsApp: +79148289946
- Email: xongphavietnam@gmail.com
- Telegram: @PaulPavel_it_dev
- Репозиторий русской версии: https://github.com/paulafanasyev/-_-

Материалы локализации находятся в `localization/`.

> Русская версия сохраняет оригинальную лицензию и авторство исходного проекта.
> Внутренние идентификаторы, API, URL и программная логика не переводятся.
EOF
fi

echo
echo "[7/8] Проверка изменений..."

git diff --stat
echo
git status --short

echo
echo "[8/8] Проверка Node..."

node --version
npm --version

echo
echo "=========================================="
echo " ЛОКАЛИЗАЦИОННЫЙ ПОДГОТОВИТЕЛЬ ЗАВЕРШЁН"
echo "=========================================="
echo
echo "Создано:"
echo "  localization/ru.json"
echo "  localization/README-RU.md"
echo "  localization/DEVELOPER-RU.md"
echo "  localization/ui-candidates.txt"
echo
echo "Резервная ветка:"
echo "  $BACKUP_BRANCH"
echo
echo "ВАЖНО: автоматического push нет."
echo "Сначала проверяем diff и сборку."
