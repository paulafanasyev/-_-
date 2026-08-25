    )).length, 2, 'deferred requests were started in the same activation');
  } finally {
    releaseAircraft();
    releaseDeferred();
    runtime.restore();
  }
});

test('pending mapped installations render as unknown instead of a false zero', async () => {
  const position = Cesium.Cartesian3.fromDegrees(-97.74, 30.27, 1_000);
  const restoreCollections = stubAwarenessCollections({});
  const runtime = installAwarenessRuntime({
    // Deliberately inconsistent visibility intent exercises the defensive
    // lifecycle guard: `enabling` must win over a stale true response.
    isEnabled: () => true,
    getLayerLifecycleState: (layerId) => (layerId === 'military-installations'
      ? { enabled: false, lifecycleState: 'enabling', uncertain: false }
      : { enabled: true, lifecycleState: 'enabled', uncertain: false }),
  });

  try {
    runtime.dispatch('gev:awareness-subject-selected', awarenessSubject('flights', 'pending-site', position));
    await nextTurn();

    const snapshot = militaryAwarenessLayer.getContextSnapshot();
    const installations = snapshot?.cohorts.find(({ id }) => id === 'military-installations');
    assert.equal(installations?.count, null, 'loading is not an observed empty cohort');
    assert.match(installations?.reason || '', /unavailable/i);
    assert.match(
      runtime.panel()?.innerHTML || '',
      /Нанесённые на карту объекты<\/strong><b aria-live="polite">\?<\/b>/,
      'the operator sees ? rather than an all-clear 0 while installations load',
    );
  } finally {
    restoreCollections();
    runtime.restore();
  }
});

// ── The `loading === true && !lastUpdate` predicate in sourceState ────────────
//
// It is a CONTRACT over the whole dependency list, not a fix for one layer, and
// the dependencies reach it by different routes:
//
//   - ais-live-vessels is its REACHABLE producer. enable()/update() both resolve
//     as soon as the first /api/ais-live poll answers, so the manager's
//     lifecycle settles to `enabled` — but until the server-side socket delivers
//     a position, firstConnectPhase stays 'loading' and the module reports busy,
//     no lastUpdate, count 0, and an UNDEFINED status, so the status list alone
//     never catches it either.
//   - military-installations never reaches this window, and these pins are not
//     about it. Its enable() is synchronous and the manager awaits update(),
//     which owns the first Overpass fetch, so the lifecycle stays `enabling`
//     throughout and the sibling `enabling` test above is what covers it.
//     Confirmed live on :4272 across a held 17 s first fetch (34 samples,
//     `enabling` the whole way) and across a failing one.
//
// The readouts below are taken FROM the real module rather than hand-written. A
// fixture that invents a shape its module never emits guards nothing — that is
// exactly how a hole in this gate survived a passing suite once already.

/** Drive aisLiveVessels into a state and return the readout IT produces. */
function aisStatsFor(options) {
  _setVesselStateForTest(options);
  return Object.freeze(aisLiveVesselsLayer.getStats());
}

/** Socket connecting: busy, never answered, undefined status. */
const AIS_FIRST_CONNECT_STATS = aisStatsFor({
  enabled: true,
  transportStatus: 'connecting',
  firstConnectPhase: 'loading',
  lastUpdate: null,
});

/** The same module once the socket answers with an honestly empty viewport. */
const AIS_SETTLED_EMPTY_STATS = aisStatsFor({
  enabled: true,
  transportStatus: 'open',
  firstConnectPhase: 'ready',
  lastUpdate: 1_700_000_000_000,
});

/** Answered once, and busy again on a later refresh poll. */
const AIS_REFRESHING_ANSWERED_STATS = aisStatsFor({
  enabled: true,
  loading: true,
  transportStatus: 'open',
  firstConnectPhase: 'ready',
  lastUpdate: 1_700_000_000_000,
  records: [{ mmsi: '1' }, { mmsi: '2' }, { mmsi: '3' }],
});

// Leave the shared module neutral for every test below.
_setVesselStateForTest({ enabled: false });

test('the first-connect readout is the real one, and is exactly what the predicate keys on', () => {
  assert.equal(AIS_FIRST_CONNECT_STATS.loading, true, 'the module reports itself busy while connecting');
  assert.equal(AIS_FIRST_CONNECT_STATS.lastUpdate, null, 'and has never answered');
  assert.equal(AIS_FIRST_CONNECT_STATS.count, 0, 'with a zero that means nothing yet');
  assert.equal(
    AIS_FIRST_CONNECT_STATS.status,
    undefined,
    'and no status at all — the status list cannot be what catches this',
  );
  assert.equal(AIS_SETTLED_EMPTY_STATS.loading, false, 'an answered socket is not busy');
  assert.ok(AIS_SETTLED_EMPTY_STATS.lastUpdate, 'and carries the moment it answered');
  assert.equal(AIS_REFRESHING_ANSWERED_STATS.loading, true, 'a refresh poll is busy again');
  assert.ok(AIS_REFRESHING_ANSWERED_STATS.lastUpdate, 'without erasing the answer already given');
});

test('a vessel feed still connecting after the lifecycle settles reads as unknown, not an all-clear', async () => {
  const position = Cesium.Cartesian3.fromDegrees(-97.74, 30.27, 1_000);
  const restoreCollections = stubAwarenessCollections({});
  // The window this pins: enable() and the first poll have RESOLVED, so the
  // manager reports a fully settled `enabled` lifecycle, while the socket has
  // still never delivered a position.
  const runtime = installAwarenessRuntime({
    isEnabled: () => true,
    getLayerLifecycleState: () => ({ enabled: true, lifecycleState: 'enabled', uncertain: false }),
    layerStats: { 'ais-live-vessels': AIS_FIRST_CONNECT_STATS },
  });

  try {
    runtime.dispatch('gev:awareness-subject-selected', awarenessSubject('flights', 'connecting-site', position));
    await nextTurn();

    const snapshot = militaryAwarenessLayer.getContextSnapshot();
    const vessels = snapshot?.cohorts.find(({ id }) => id === 'ais-live-vessels');
    assert.equal(
      vessels?.count,
      null,
      'a source that has never answered has told us nothing — 0 would be a fabricated all-clear',
    );
    assert.match(vessels?.reason || '', /unavailable/i);
    assert.match(
      runtime.panel()?.innerHTML || '',
      /Суда AIS<\/strong><b aria-live="polite">\?<\/b>/,
      'the panel prints ? for the whole settled-but-connecting window',
    );
    assert.doesNotMatch(
      runtime.panel()?.innerHTML || '',
      /Суда AIS<\/strong><b aria-live="polite">0<\/b>/,
      'the panel must never print an all-clear 0 before the feed has answered once',
    );
  } finally {
    restoreCollections();
    runtime.restore();
  }
});

test('a settled vessel feed reporting a real empty viewport recovers to 0', async () => {
  const position = Cesium.Cartesian3.fromDegrees(-97.74, 30.27, 1_000);
  const restoreCollections = stubAwarenessCollections({});
  // Same lifecycle, but the socket answered: `lastUpdate` is set and the module
  // is no longer busy, so this zero is an OBSERVATION and must be shown as one.
  // Without this pin the fix above could degenerate into a permanent `?`.
  const runtime = installAwarenessRuntime({
    isEnabled: () => true,
    getLayerLifecycleState: () => ({ enabled: true, lifecycleState: 'enabled', uncertain: false }),
    layerStats: { 'ais-live-vessels': AIS_SETTLED_EMPTY_STATS },
  });

  try {
    runtime.dispatch('gev:awareness-subject-selected', awarenessSubject('flights', 'settled-site', position));
    await nextTurn();

    const snapshot = militaryAwarenessLayer.getContextSnapshot();
    const vessels = snapshot?.cohorts.find(({ id }) => id === 'ais-live-vessels');
    assert.equal(vessels?.count, 0, 'an answered empty viewport is a real observation');
    assert.match(
      runtime.panel()?.innerHTML || '',
      /Суда AIS<\/strong><b aria-live="polite">0<\/b>/,
      'the operator sees the real count once the feed answers',
    );
  } finally {
    restoreCollections();
    runtime.restore();
  }
});
