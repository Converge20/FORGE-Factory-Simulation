# Validation · 2 November 2026

## Passed

- `npm run build`: TypeScript strict checking and Vite production compilation pass.
- `npm test`: the process test file passes. Its three checks cover six station records and references, 1,000 centerline samples on connected conveyor segments, and route wrap / negative-progress behavior.
- `FORGE_TEST_URL=http://127.0.0.1:4173 npm run test:e2e`: **5 / 5 browser tests passed against the production build**, using installed Chromium with software WebGL. Total browser-suite runtime: approximately 1 minute 6 seconds.
- Desktop interaction test: actual WebGL canvas; all six inspectors; reset; pause/resume; zoom buttons; label toggle; research dialog and Escape dismissal; timed tour advancement; no uncaught page errors.
- OS reduced-motion test: paused scene, manual station exploration, no timed tour.
- Responsive test at 390 × 844: no document horizontal overflow; station inspection remains usable.
- WebGL unavailable test: explanatory fallback and station navigation.
- WebGL context-loss test: fallback replaces the renderer and station navigation remains usable.

## Build size

Production output (Vite report): approximately 1,167 kB JavaScript / 327 kB gzip, 17 kB CSS / 4.4 kB gzip, and 0.82 kB HTML. Most JavaScript is the Three.js / React renderer. There are no remote models, image textures, font downloads, API calls or credentials. The source archive includes the dependency lockfile; runtime dependencies are installed locally in the cloud workspace only.

## Visual review

Full desktop screenshot from the production preview: `../forge-desktop.png`. The overview is 1600 × 1120 pixels. Production capture reported zero uncaught page errors and zero external network requests. Additional station-focus screenshot: `../forge-filling-detail.png`. The overview was inspected and refined for metallic contrast, framing and scene/panel alignment. Actual responsive layout and reduced-motion behavior were exercised in Chromium.

## Limits

The cloud runner uses Chromium with SwiftShader, not a desktop GPU. Browser automation is functional evidence, not a Chrome hardware frame-rate benchmark. Smoothness and thermals should be reviewed on the intended hardware. No real plant throughput, safety, hygiene, fluid dynamics, inventory or economics are validated. No public deployment, repository push or merge was performed.

An initial desktop run exceeded Playwright's default 30-second limit while using software rendering. The configured timeout was increased to 120 seconds; the final production suite passes without forced clicks or skipped checks. The official Ball PDF blocked direct fetching with HTTP 403; its search-indexed technical text was available and this limitation is recorded in RESEARCH.md.
