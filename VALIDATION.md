# Animation refinement validation · 4 November 2026

## Executed results

- `npm test` passes all four Node test files, containing 20 tests (12 existing plus eight new). The new model tests also run directly and pass 8/8. They check indexed filling spacing, stop/fill/close/depart timing, actual liquid bounds, guarded return boundaries, seaming, supported pickup/placement/dispatch, reject routing, shared pause/mode clock, and real geometry updates/reduced-motion stability across all twelve manufacturing builders.
- The 13-test Chromium production suite initially passed 12/13 in 6.5 minutes. Its camera test timed out on a five-second wait for the selected station's rendered canvas after the DOM inspector had updated. The software-rendering wait was increased to 30 seconds. A final targeted run passed 3/3 in 2.7 minutes: full orbit/zoom/pan/focus/reset, all thirteen Explorer stations, and all fourteen Guided chapters. Across these runs every browser check passes; this is not a claim that the initial full run was all green.
- The new browser check passes actual arrival/filling/closure/departure states and verifies the filling phase remains identical while paused and switching from Guided to Explorer. Existing checks pass mobile/touch navigation, keyboard navigation, sources, safe UI interaction, reduced motion, unavailable/lost WebGL and the normal-motion white-truck departure and closing message.
- `npm run build` passes strict TypeScript and Vite. Final output: JavaScript 1,224.66 kB (347.12 kB gzip), CSS 21.39 kB (5.19 kB gzip), HTML 0.86 kB. Vite's existing large-chunk advisory remains non-fatal. Application dependencies are unchanged; a formatter ran only in the cloud tooling cache.
- The self-contained HTML passes a local HTTP browser smoke test: a real WebGL canvas, Explorer station selection, mode switch and Guided advancement, zero page errors, and one HTTP request for the HTML itself. No external runtime asset or service request was required.

## Review and limitations

Browser captures inspect every manufacturing station in Explorer plus filling arrival, dispensing and completion. Final captures also include Guided filling, portrait filling and the retained truck closing state. The screenshots are actual WebGL renders. Reduced-motion captures intentionally freeze a representative state; a separate normal-motion test verifies real truck travel and rotating wheels.

The detailed station review reports no uncaught page errors. Scene draw/triangle diagnostics and raw test/build logs are supplied with the review downloads. These describe geometry complexity, not Mac FPS, power or thermal performance. Physical Mac GPU behavior, native trackpad feel, long-session memory trends and every possible model intersection remain unverified.

Distant machinery is batched into static equipment snapshots without stationary consumable products; only selected detailed machinery and shared conveyor representations animate. Finite loops recycle under end guards. This is a visual education prototype, not continuous individual-product tracking, fluid dynamics, seam deformation or general collision simulation. REFINEMENT.md describes the station changes and interpretation limits.

## Preservation and delivery

The original `/workspace/output/forge` source remains unchanged; the update is a separate `/workspace/output/forge-refined` folder. The preserved Phase 3 ZIP SHA-256 remains `85d8eef0c197b17f59b7e3ca6f434835d2e184bab5acb7558262415609537099`. Packaging checks compare the original source with that archive, apply the refinement patch to a scratch baseline and compare every resulting source file byte-for-byte, then check ZIP integrity.

The main interface, styles, Education.tsx, story.ts, RESEARCH.md and truckMotion.ts remain byte-identical. The vehicle remains white/unbranded with its original motion; only dispatch-carton movement/support/guards change in logistics.ts. Product artwork and outside can profile remain; an open can's interior disk is moved to its bottom.

GitHub returned HTTP 404. No feature branch, commit, push, merge, public deployment or replacement repository is claimed. REFINEMENT_TRANSFER.md documents the source ZIP and matching Phase 3 patch route. Direct file-scheme opening of the HTML remains unverified under the managed browser's policy; use the downloaded HTML in Chrome or the private Codespaces port-5173 preview.

The previous Phase 3 validation follows as historical documentation; its scene counts and exact-preservation statements apply to that earlier baseline.

---

# Phase 3 validation · 3 November 2026

## Automated results

- `npm test`: all 12 assertions pass across three Node test files. The runner reports three file-level passes in this environment. Original process tests and the historical story timeline helper test remain; new tests cover shared station data, explanation lengths, connected routes, truck path and rolling direction, and actual unbranded geometry.
- `npm run build`: strict TypeScript and Vite production build pass. JavaScript is 1,218.43 kB (344.68 kB gzip), CSS 21.39 kB (5.19 kB gzip), HTML 0.86 kB. Vite reports a non-fatal chunk-size advisory above 1,200 kB. No runtime dependency was added.
- `FORGE_TEST_URL=http://127.0.0.1:4173 npm run test:e2e`: all 12 Chromium browser tests pass against the production application. The complete run took approximately 5.2 minutes with software WebGL. Coverage includes welcome/modes, all fourteen Guided chapters, previous/restart/keyboard/pause, source dialog, reduced motion, missing/lost WebGL, the real timed truck departure, complete Explorer orbit, zoom, pan, focus/reset, every selectable station, touch selection, shared education, safe external links, no reload on mode changes, and rejected camera/drag gestures in Guided.
- After final portrait framing and reduced-motion camera fixes, three affected browser tests were rerun: all fourteen reduced-motion chapters including the completed truck's camera target after portrait resize, mobile navigation, and touch selection. All pass.
- Final screenshot capture recorded zero uncaught page errors and no external runtime asset requests. Normal-motion capture waited for actual departure distance and completed animation state, rather than substituting images.

## Scene complexity and resource behavior

The final 1600 × 1000 Explorer capture reports 153 draw calls and 316,004 visible triangles for the complete factory overview. Selected station captures report 41–195 draw calls and 46,658–308,872 visible triangles; view frustum culling accounts for the lower close-up counts. The truck finale reports 41 calls and 27,262 triangles. Exact diagnostics accompany the screenshot archive.

These counts describe render complexity, not measured FPS on a Mac. Software Chromium cannot establish integrated-GPU frame rate, power use, thermal behavior or long-session memory stability. Native trackpad feel and physical touch hardware remain unverified; browser mouse and emulated touch controls pass.

Only the active mode is mounted. Explorer keeps batched snapshots of distant machines and runs the selected station's original animation plus instanced material flow. This is an intentional visual level-of-detail approach, not a full-factory physics simulation. Materials and geometry are batched/shared where practical; environment maps, chapter resources, controls and event listeners have cleanup paths. There is one shadow-casting directional light with a 1536-pixel map and DPR capped at 1.4. Paused/reduced scenes use demand rendering after camera settling; completed departure stops continuous updates.

Camera distance, polar angle, pan bounds, station-specific minimum distances and near/far planes guard common clipping cases. These safeguards are not a general collision solver: deliberate extreme close orbit angles can still intersect complicated machinery.

## Preservation and visual review

All 28 source files in the saved Phase 2 source archive matched the starting project before changes. `product.ts`, `factory.ts` and `process.ts` remain byte-identical. Whitespace-normalized machinery branches 1–12 match Phase 2; the final can/carton reveal branch alone is replaced with logistics. The old pure reveal timeline helper remains for test compatibility and is not rendered by the application.

The recoverable `forge-phase2-source.zip` remains unchanged, SHA-256:

`1ccb4344cca92ad66818315488e3d9b299fba99f5ab9354a1ba5dfff279a7727`

The earlier `forge-github-transfer.zip` also remains unchanged. The Phase 3 patch is applied to a scratch copy of the preserved Phase 2 baseline, and every resulting source file is compared byte-for-byte with the deliverable project. ZIP integrity is checked before delivery.

Desktop screenshots at 1600 × 1000 cover welcome, complete overview, selected machinery, expanded explanation, Guided manufacturing, real departure and closing. Additional 390 × 844 captures cover portrait overview and reduced-motion closing. Screenshots show the actual browser canvas; no generated replacement artwork is used.

## Review preview and transfer

The self-contained `forge-phase3-preview.html` embeds the exact production JavaScript, CSS and license notices. A local HTTP smoke test verifies a live canvas, Explorer selection, switching to Guided and chapter advancement, with no page errors or HTTP requests beyond the HTML itself. This is the interactive application, not a video or static mockup.

Direct `file://` opening is blocked by managed cloud Chromium policy (`ERR_BLOCKED_BY_ADMINISTRATOR`); Mac double-click behavior is therefore unverified. Try downloading the HTML and opening it in Chrome. If local-file policy blocks it, use the existing private Codespace: `npm ci`, `npm run dev`, then open port 5173 with visibility Private. No browser policy bypass or public deployment is required.

GitHub repository access returned HTTP 404. The local project is an exported folder, not a Git checkout, so no remote feature branch, commit, push or merge is claimed. The full source ZIP, prebuilt production ZIP and tested patch provide manual transfer routes; see FEATURE_BRANCH.md. No new repository was created.

## Research and interpretation

Shared explanations are 101–107 words per chapter. Each distinguishes verified Red Bull information, standard manufacturing practice and illustrative machinery/layout; both modes use the same records. Source contents were checked for the official lifecycle, ingredients and production-location pages and relevant GEA/Krones equipment descriptions. Ball's PDF remains directly inaccessible (403); official indexed technical text supports the cited forming description, and this limitation remains explicit in RESEARCH.md.

The factory arrangement, model dimensions, transparent cutaways, conveyors, ingredient flow, cycle speeds, truck geometry, road, acceleration and steering are illustrative. Product-label ingredient quantities are not manufacturing dosing instructions. The generic truck is not claimed to represent a Red Bull fleet or transport route, and equipment references do not establish supplier relationships. See the claim-by-claim research register and asset/license inventory for detail.
