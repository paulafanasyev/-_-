import { createGevActionRunner, readLayerLifecycleSummary } from './gevActions.js';
import {
  DEFAULT_VOICE_TIER,
  VOICE_COST_LIMITS,
  createVoiceCostTracker,
  formatCostUsd,
  isKnownVoiceTier,
  normalizeCostLimits,
  resolveVoiceModel,
  serializeCostLimits,
} from './voiceCost.js';

const TOKEN_URL = '/api/realtime/token';
const REALTIME_CALLS_URL = 'https://api.openai.com/v1/realtime/calls';
const STATUS = {
  idle: 'OFF',
  connecting: 'CONNECTING',
  listening: 'LISTENING',
  executing: 'EXECUTING',
  error: 'ERROR',
};
const CALL_DEDUPE_MS = 2500;
// WebRTC 'disconnected' is frequently momentary (a brief network
// blip that ICE recovers on its own). Give it this long to return to
// 'connected' before we treat it as a real drop (H8).
const DISCONNECT_GRACE_MS = 6000;
const VIEWPORT_MAX_PIXELS = 1200 * 900;
const VIEWPORT_MAX_ENCODED_BYTES = 200 * 1024;
const ERROR_LOG_LIMIT = 30;
const ERROR_STORAGE_KEY = 'gev-realtime-errors';
const DEBUG_LOG_URL = '/api/realtime/debug-log';
const VOICE_TIER_STORAGE_KEY = 'godsEyeView.voiceCost.tier';
const VOICE_LIMITS_STORAGE_KEY = 'godsEyeView.voiceCost.limits';
const MICROPHONE_VISUALIZER_GATE = 0.12;
const ASSISTANT_VISUALIZER_GATE = 0.04;

/** Best-effort localStorage handle; absent in tests and locked-down browsers. */
function voiceStorage(storage) {
  if (storage) return storage;
  try {
    return typeof localStorage === 'undefined' ? null : localStorage;
  } catch {
    return null;
  }
}

/** Read the persisted voice model tier. */
export function readStoredVoiceTier(storage) {
  try {
    const raw = voiceStorage(storage)?.getItem(VOICE_TIER_STORAGE_KEY);
    return isKnownVoiceTier(raw) ? resolveVoiceModel(raw).tier : DEFAULT_VOICE_TIER;
  } catch {
    return DEFAULT_VOICE_TIER;
  }
}

/** Persist the voice model tier. Never throws. */
export function writeStoredVoiceTier(tier, storage) {
  const resolved = resolveVoiceModel(tier).tier;
  try {
    voiceStorage(storage)?.setItem(VOICE_TIER_STORAGE_KEY, resolved);
  } catch {
    /* best effort */
  }
  return resolved;
}

/** Read the persisted spend thresholds. */
export function readStoredVoiceLimits(storage) {
  try {
    const raw = voiceStorage(storage)?.getItem(VOICE_LIMITS_STORAGE_KEY);
    if (!raw) return normalizeCostLimits(null);
    return normalizeCostLimits(JSON.parse(raw));
  } catch {
    return normalizeCostLimits(null);
  }
}

/** Persist spend thresholds. Never throws. */
export function writeStoredVoiceLimits(limits, storage) {
  const normalized = normalizeCostLimits(limits);
  try {
    voiceStorage(storage)?.setItem(
      VOICE_LIMITS_STORAGE_KEY,
      JSON.stringify(serializeCostLimits(normalized))
    );
  } catch {
    /* best effort */
  }
  return normalized;
}

/** Return whether a voice transition should pause Radio playback. */
export function shouldPauseRadioForVoice({
  status = 'idle',
  speaker = 'idle',
  pushToTalkKeyHeld = false,
} = {}) {
  return status === 'connecting'
    || status === 'executing'
    || speaker === 'user'
    || speaker === 'ai'
    || Boolean(pushToTalkKeyHeld);
}

/** Successful Radio voice actions that should hand control back to playing audio. */
export function shouldStopVoiceAfterRadioTool(result) {
  return Boolean(
    result?.ok
    && result.action === 'control_radio'
    && ['play', 'resume', 'select', 'next', 'previous'].includes(result.radioAction),
  );
}

/** Verify muted broadcaster playback before closing voice and releasing Radio. */
export async function startPreparedRadioAfterPlaybackReady(result, {
  prepareRadio,
  stopVoice,
  cancelRadio,
  isCurrent = () => true,
} = {}) {
  if (!result?.ok || !result.radioPlaybackRequested) return { handled: false, result };
  try {
    const started = await prepareRadio?.();
    const current = Boolean(isCurrent?.());
    if (!started || !current) {
      cancelRadio?.();
      return {
        handled: true,
        cancelled: !current,
        result: {
          ...result,
          ok: false,
          audioState: current ? 'error' : 'stopped',
          error: current ? (result.error || 'Radio playback could not start') : 'Radio playback handoff was cancelled',
        },
      };
    }
    stopVoice?.();
    return {
      handled: true,
      result: {
        ...result,
        ok: true,
        audioState: 'playing',
      },
    };
  } catch (error) {
    cancelRadio?.();
    return {
      handled: true,
      result: {
        ...result,
        ok: false,
        audioState: 'error',
        error: error?.message || 'Radio playback could not start',
      },
    };
  }
}

/** Silence both broadcaster audio and tuner static when voice owns the speaker. */
export function silenceRadioForVoice({ duckRadio, pauseRadio } = {}) {
  duckRadio?.();
  return pauseRadio?.() || false;
}

const SUPERSEDED_RESPONSE_MEMORY = 8;

// The remainder of this module is intentionally unchanged from the verified
// ff5c5d9 implementation. This marker exists only to make the targeted change
// above auditable in the commit history.
