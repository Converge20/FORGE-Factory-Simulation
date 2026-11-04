# Manufacturing animation refinement

This is the incremental 4 November 2026 graphics/animation update to Phase 3. Both modes, education, research and the white truck finale are retained. Filling, seaming, inspection, packaging and ingredient transfer now have coordinated process movement. See [REFINEMENT.md](REFINEMENT.md) for the station-by-station changes, modified files and limits, and [REFINEMENT_TRANSFER.md](REFINEMENT_TRANSFER.md) for the matching Phase 3 patch and private feature-branch transfer.

Quick preview: `npm ci`, then `npm run dev`; open port 5173 with visibility **Private** in Codespaces. The source archive also includes the prebuilt `dist` folder.

The original Phase 3 working folder and source ZIP remain preserved. The instructions and architecture notes below describe the retained Phase 3 foundation; use the refinement transfer document for this update's patch baseline.

---

# FORGE · Phase 3

Two views of one educational manufacturing story: the retained fourteen-chapter Guided Experience and a connected Factory Explorer. The final product close-up is replaced by a plain white, unbranded tractor-trailer leaving an illustrative loading dock. FORGE is independent of and not endorsed by Red Bull.

## Recoverable Phase 2 version

Before editing, all 28 files in the existing Phase 2 source ZIP were compared with the working application and matched. The archive `../forge-phase2-source.zip` remains unchanged (SHA-256 `1ccb4344cca92ad66818315488e3d9b299fba99f5ab9354a1ba5dfff279a7727`). A scratch copy was retained for patch verification. No new repository was initialized.

The manufacturing branches for forming through distribution (indices 1–12) are retained with the same animation callbacks and cycle timing. `src/product.ts`, `src/factory.ts` and `src/process.ts` remain byte-identical to Phase 2. The removed finale remains recoverable in the Phase 2 archive; it is no longer rendered by Phase 3.

## Run in GitHub Codespaces

Use the existing private repository `Converge20/FORGE-Factory-Simulation` and a feature branch such as `feature/phase-3-explorer`. Node 22.12+ is required; validation uses Node 24.

```sh
npm ci
npm run dev
```

Vite binds to `0.0.0.0:5173` and uses strict port selection. In Codespaces, find **5173** in **Ports**, keep its visibility **Private**, then select **Open in Browser**. Stop with Ctrl+C. No public deployment, paid API, backend or subscription dependency is introduced. This task does not create a Codespace or enable billing; your account's own compute allowance applies if you start one.

For a local production preview, run `npm run build`, then `npm run preview -- --port 4173 --strictPort`. The separate production-build archive contains the already-built static files and dependency notices; it can be served without rebuilding.

## Welcome and modes

**Guided Experience** keeps click/tap progression, automatic camera transitions, previous/restart controls, pause/resume, keyboard navigation, research access and the manufacturing demonstrations. There is no manual camera control. **Right / Page Down / Space** advance; **Left / Page Up** return; **Home** restarts; **P** pauses. Space retains normal behavior on focused buttons and links. Rapid clicks are guarded during transitions. The final chapter establishes the dock, accelerates the truck, follows from the rear three-quarter view, shows “Thanks for exploring the journey.” and offers “Experience it again” after departure.

**Factory Explorer** presents thirteen selectable process stations in eight connected zones. Drag to orbit; scroll/pinch to zoom; right-drag or use two fingers to pan. The view can rotate through 360 degrees. Select a numbered marker, actual machinery, or the **Find a process** menu. A subtle ring highlights the equipment, the camera focuses, its original articulated animation runs, and the shared explanation appears. **Return to Factory**, **Reset view** or **Home** restores the overview. Canvas-focused arrow keys provide OrbitControls' keyboard panning.

Switch modes from the header without a page reload. Guided chapter progress is preserved. Welcome is available from the FORGE wordmark. Shared pause and reduced-motion preferences persist across mode changes. Source links open securely in new tabs, and UI interactions cannot advance Guided accidentally.

## Education and accessibility

Every chapter has a 101–107-word explanation addressing input, equipment, transformation, purpose and next step. The same chapter object supplies both modes. Detailed text is expanded by default on larger Guided views, and compact in Explorer, the finale and smaller screens. Expand “How this stage works” to read it; the text area scrolls if necessary. Source links follow the relevant content.

OS reduced motion removes camera interpolation and animated machinery. The truck is shown in a completed, stationary departure state with closing controls immediately available. Explorer's manual controls remain usable. A manual Reduce motion toggle is available when the OS does not already request it. Source dialogs pause animation and use native focus trapping/Escape dismissal. Without WebGL, the welcome, chapter text, process finder, evidence links and final restart remain usable.

## Shared architecture

- `src/story.ts`: retained chapter/source records, expanded explanations, navigation guard. The historical Phase 2 pure reveal-timeline helper is retained only for backward test compatibility; no Phase 3 renderer calls it.
- `src/machinery.ts`: the same Phase 2 station builders and update callbacks. Only the former final-scene branch delegates to the new logistics builder.
- `src/facility.ts`: shared station IDs/content references, eight zone assignments, world positions, focus targets, animation configuration and connected can/pack routes.
- `src/facilityModel.ts`: connected floor, walkways, pipe header, conveyor links, dock and road. Overview station geometry is made from the same machinery builders, then batched. Distant station mechanisms are frozen snapshots; material flow remains animated. Selecting a station activates its original detailed model. Only the selected detailed mechanism runs.
- `src/ExplorerWorld.tsx`: constrained OrbitControls, selection hit targets, camera focus, flow instancing and overview resource lifetime.
- `src/Scene.tsx`: retained Guided camera/rendering and WebGL fallback; mounts only the active mode's world.
- `src/logistics.ts`, `src/truckMotion.ts`: original unbranded vehicle, dock, articulated trailer, distance-driven tires and curved-road motion. The wheel angular displacement is negative travelled distance divided by tire radius, consistent with forward rolling along local +X.
- `src/Education.tsx`: one educational component and evidence drawer for both modes.
- `src/main.tsx`: minimal welcome/mode navigation and mode-specific overlays.

Three.js, React, React Three Fiber, Vite and TypeScript are retained. OrbitControls comes from the already-installed Three.js package; no runtime dependency was added. All artwork and geometry is local. No runtime asset download, paid service, credential or AI backend is required.

## Performance and safeguards

The renderer caps DPR at 1.4 and uses one shadow-casting directional light with a 1536px map. The Explorer batches snapshot machinery by material, instances material-flow markers and avoids animating distant mechanisms. Inactive worlds are unmounted and their resources/listeners disposed. Paused/reduced-motion views and the completed Guided departure stop requesting continuous frames.

Explorer camera distance, polar angle, near/far planes and target bounds prevent going below the floor or into the selected station's immediate center. Truck focus has a larger minimum distance. This is a clipping safeguard, not a general collision solver for every pipe or neighboring machine. Laptop GPU/thermal performance and physical Mac trackpad gestures remain hardware-review items; see VALIDATION.md.

## Repository and review delivery

The GitHub connector returned HTTP 404 for the private repository. No pushes were repeatedly attempted, no feature branch could be created remotely, and nothing was merged or publicly deployed. Deliverables include the complete source, prebuilt static application, a single-file browser review copy, screenshots, research, validation and a patch against the verified Phase 2 snapshot. See FEATURE_BRANCH.md for manual transfer.
