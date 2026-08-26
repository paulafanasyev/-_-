// Визуальные игровые эффекты. Параметры намеренно абстрактны и не являются
// моделью реального поражения.

export function createImpactEffect({ intensity = 0.5, durationMs = 1200 } = {}) {
  return {
    kind: 'impact',
    intensity: Math.max(0, Math.min(1, intensity)),
    durationMs: Math.max(100, Math.min(10000, durationMs)),
    layers: ['flash', 'shockwave', 'debris'],
  };
}

export function createImpactZones(intensity = 0.5) {
  const value = Math.max(0, Math.min(1, intensity));
  return [
    { kind: 'thermal', radius: 0.35 * value },
    { kind: 'shockwave', radius: 0.55 * value },
    { kind: 'fallout', radius: 0.75 * value },
  ];
}
