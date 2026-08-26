# Nuclear God's Eye — Stage 1

## Status

Stage 1 establishes the game runtime foundation on top of the existing God's Eye View client.

The current repository is a Vite/Cesium application, so the game is being integrated into that architecture instead of creating a second nested web application. The future Replit deployment can use the same branch and files.

## Current baseline

- Base commit: `5006f63f8bd1cb661d6a8c0dafe5938eb602f490`
- Working branch: `nuclear-gods-eye-stage1`
- Existing globe: Cesium-based God's Eye View client
- Added runtime server: Express + WebSocket
- Added Three.js dependency for future visual effects

## Modules introduced

- `server.js` — HTTP/WebSocket runtime shell.
- `src/nuclear/gameState.js` — deterministic client-side game state container.
- `src/nuclear/ballistics.js` — abstract visual arc generator for game animation.
- `src/nuclear/nukeEffects.js` — abstract impact visual layers and normalized zones.
- `src/nuclear/airDefense.js` — abstract interception probability for game balance.
- `src/nuclear/nukeWinter.js` — normalized climate-aftermath state model.
- `data/countries.json` — display metadata only.
- `data/defenseSystems.json` — abstract balance classes only.

## Safety boundary

The prototype intentionally does not contain real launch-site coordinates, targeting data, operational procedures, or real-world performance parameters. Gameplay parameters are normalized so the system remains a strategy-game simulation.

## Runtime contract

`npm start` launches the Express server and WebSocket endpoint on `PORT` (default `3000`).

Health check: `/api/health`

WebSocket: `/ws`

Stage 1 only establishes transport and module boundaries. It does not yet connect game controls to the globe.

## Next stage

Integrate the game state with the existing globe view and render an animated, purely visual trajectory between two selected map points. Then add the game HUD and turn/event synchronization.
