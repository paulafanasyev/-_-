// Простая игровая модель глобального последействия.
// Значения нормализованы для баланса игры, а не для научного прогноза.

export function stepClimateState(state = {}, eventIntensity = 0) {
  const previous = {
    temperatureIndex: Number(state.temperatureIndex ?? 0),
    cloudIndex: Number(state.cloudIndex ?? 0),
    harvestIndex: Number(state.harvestIndex ?? 1),
  };

  const intensity = Math.max(0, Math.min(1, Number(eventIntensity) || 0));
  const nextTemperature = Math.max(-1, previous.temperatureIndex - intensity * 0.08);
  const nextCloud = Math.min(1, previous.cloudIndex + intensity * 0.06);
  const nextHarvest = Math.max(0, previous.harvestIndex - intensity * 0.05);

  return {
    temperatureIndex: nextTemperature,
    cloudIndex: nextCloud,
    harvestIndex: nextHarvest,
  };
}
