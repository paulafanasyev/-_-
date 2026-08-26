// Абстрактная игровая механика перехвата.
// Не моделирует реальные характеристики конкретных систем.

export function resolveInterception({
  defenderRating = 0.5,
  threatDifficulty = 0.5,
  interceptorCount = 1,
  random = Math.random,
} = {}) {
  const defense = Math.max(0, Math.min(1, Number(defenderRating) || 0));
  const threat = Math.max(0, Math.min(1, Number(threatDifficulty) || 0));
  const count = Math.max(1, Math.floor(Number(interceptorCount) || 1));
  const baseChance = Math.max(0, Math.min(0.95, 0.5 + defense * 0.4 - threat * 0.4));
  const combinedChance = 1 - (1 - baseChance) ** count;

  return {
    intercepted: random() < combinedChance,
    probability: combinedChance,
  };
}
