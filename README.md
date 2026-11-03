# FORGE · Phase 1

An independent browser-based educational reconstruction of beverage manufacturing, inspired by public Red Bull, Ball and equipment-maker references. This is a separate project from AXIOM. No backend, credentials, paid services, AI agents or business simulation.

## Preview

Requires Node.js 22.12+ (Node 24 was used here).

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. `npm run build` creates `dist/`; `npm run preview` serves that build locally. Do not open `index.html` via `file://`. Nothing has been installed on your Mac or deployed publicly.

The live development preview in this cloud workspace runs on port 5173. The portable source archive excludes installed dependencies; the separate build archive contains the prebuilt static site. Serve the prebuilt folder with an existing static HTTP server to preview without installing Node dependencies.

## Explore

- Drag to orbit; scroll/pinch or use +/− to zoom. Right-drag pans.
- Click machinery, numbered scene markers, or any of six station buttons to inspect and focus the camera.
- The guided tour advances through six stations at 6.5-second intervals, then returns to overview.
- Pause stops cans, carousel and robot. Reset returns the overview framing.
- Hide labels for an unobstructed scene. Fullscreen uses the browser Fullscreen API.
- OS reduced motion stops animated flow and camera tweening and replaces the timed tour with manual exploration. A manual Reduce motion toggle is also available; an OS preference cannot be overridden accidentally.
- If WebGL2 is unavailable, the station explanations, process navigation and research dialog remain available.

## Technical organization

- `src/factory.ts`: original procedural machinery; static geometry merged by material; explicitly disposable resources.
- `src/Scene.tsx`: React Three Fiber canvas, orbit controller, lighting, camera transitions, instanced moving cans, original RoomEnvironment reflections.
- `src/process.ts`: typed station content and conveyor centerline sampling.
- `src/main.tsx`: overview, inspector, tour, accessibility preferences and source dialog.
- `src/style.css`: responsive editorial interface.
- `tests/`: process invariants and Chromium interaction/fallback tests.

The renderer caps pixel ratio at 1.6 and uses 2048px directional shadows. Static models are merged by material rather than issuing a draw call for each modeled bolt, rail or pipe. Moving cans use one instanced mesh. All visuals are generated locally: no asset fetch, CDN, font service or network request is required at runtime.

## Static hosting compatibility

Vite uses `base: './'`. The app has no server routes or history routing and is compatible with a GitHub Pages project subdirectory. Publish only `dist/` after your review; no deployment or GitHub change was made. Research links leave the application only when clicked.

## Checks

```sh
npm test
npm run build
npm run dev -- --port 5173
npm run test:e2e
```

The browser-test config uses the cloud workspace's `/usr/bin/chromium` and SwiftShader flags so it does not download a browser. For another machine, set the installed Chromium executable path in `playwright.config.ts` or use your existing Playwright browser installation. See `VALIDATION.md` for the actual results and limits, `RESEARCH.md` for evidence, and `ASSETS.md` for licensing.

## Limits of Phase 1

This is a visual explanatory prototype, not an engineering or food-safety simulator. Cans represent flow, not tracked physical items. They recirculate at the end of the route; the robot's looping movement does not simulate a complete grip/transfer cycle. Product does not undergo physical deformation, fluid filling or collision simulation. Finishing operations are compressed into representative modules. Tanks are conceptual supply/buffer vessels; the layout is not an as-built facility. Runtime performance needs confirmation on your target desktop Chrome hardware; cloud software rendering is not a valid GPU benchmark.
