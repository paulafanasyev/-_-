// Игровая аппроксимация траектории. Это визуальная модель для игры,
// а не расчёт реального оружия или наведения.

export function createArc(start, end, options = {}) {
  const points = Math.max(8, Math.min(256, options.points ?? 64));
  const lift = Math.max(0, options.lift ?? 0.35);
  const result = [];

  for (let i = 0; i <= points; i += 1) {
    const t = i / points;
    const x = start.x + (end.x - start.x) * t;
    const y = start.y + (end.y - start.y) * t + Math.sin(Math.PI * t) * lift;
    const z = start.z + (end.z - start.z) * t;
    result.push({ x, y, z, t });
  }

  return result;
}

export function estimateFlightDuration(distanceUnits, speedUnitsPerSecond = 1) {
  const distance = Math.max(0, Number(distanceUnits) || 0);
  const speed = Math.max(0.01, Number(speedUnitsPerSecond) || 1);
  return distance / speed;
}
