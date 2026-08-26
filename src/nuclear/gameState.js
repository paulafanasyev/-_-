const initialState = Object.freeze({
  phase: 'lobby',
  turn: 0,
  players: [],
  events: [],
  global: {
    impactIndex: 0,
    climateIndex: 0,
  },
});

let state = structuredClone(initialState);
const listeners = new Set();

export function getGameState() {
  return structuredClone(state);
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function resetGameState() {
  state = structuredClone(initialState);
  emit();
}

export function dispatch(action) {
  if (!action || typeof action.type !== 'string') return getGameState();

  switch (action.type) {
    case 'GAME_START':
      state.phase = 'running';
      break;
    case 'TURN_ADVANCE':
      state.turn += 1;
      break;
    case 'GAME_END':
      state.phase = 'finished';
      break;
    case 'EVENT_APPEND':
      state.events = [...state.events.slice(-49), action.event ?? null];
      break;
    default:
      return getGameState();
  }

  emit();
  return getGameState();
}

function emit() {
  const snapshot = getGameState();
  for (const listener of listeners) listener(snapshot);
}
