# Animation refinement asset note

4 November 2026: no external asset or new runtime dependency was added. Existing procedural machinery is reused and refined in project source. Conveyor guards, supported reject/carton feeds, cutaway cans and transfer indicators are original procedural geometry distributed under the existing project license. Existing can artwork, outside can profile, truck vehicle geometry and materials remain; the open-can interior disk is positioned at its base. Dispatch conveyor cartons and end guards are refined separately from the unbranded vehicle. The previous asset/source/license inventory follows unchanged.

---

# Phase 3 asset record

No external asset, model, brand image, paid service or font was downloaded for Phase 3. Original procedural assets remain in the project. The truck is intentionally generic and unbranded.

| Added or reused element | Source / author | License and scope |
| --- | --- | --- |
| White tractor cab, enclosed trailer, mirrors, glazing, grille, lamps, tires, rims, chassis, rear doors and hinges | Original FORGE procedural geometry in `src/logistics.ts` | Project MIT for original code/geometry. No logo, text mesh, image map or brand graphic on the vehicle. |
| Dock, cartons, curved access-road motion and distance-driven wheels | Original FORGE implementation in `src/logistics.ts`, `src/truckMotion.ts` | Project MIT. Presentation geometry and motion only, not vehicle engineering/CAD. |
| Connected factory, conveyors, pipe header, floor markings and zone stencils | Original FORGE `src/facilityModel.ts` | Project MIT. Textures are generated from system fonts with Canvas2D; no font or image download. |
| Explorer station models and animations | Existing Phase 2 `src/machinery.ts` | Same builders and manufacturing callbacks reused; no duplicate machinery implementation. |
| OrbitControls | Three.js contributors, existing installed Three.js package | MIT. Used only in Explorer/welcome world, enabled only for Explorer. Listeners disposed on unmount. |
| Existing cans, carton artwork, original factory and process geometry | Retained Phase 2 `src/product.ts`, `src/factory.ts`, `src/process.ts` | Byte-identical to Phase 2. Prior trademark/asset notes apply to earlier manufacturing scenes; no new can artwork or replacement product rendering was introduced. |

The removed product finale remains recoverable in the Phase 2 archive. A generic white truck is its replacement, with no Red Bull or FORGE branding. Existing manufacturing cans were not remodeled. Full dependency notices remain in THIRD_PARTY_NOTICES.txt. No new runtime dependency was added.

---

# Phase 2 asset archive

# Phase 2 asset record

No external image, 3D model, font, HDRI or brand asset was downloaded for Phase 2. The existing Phase 1 factory, npm dependencies and licensing notices are retained.

| Added asset | Author/source | Rights and use |
| --- | --- | --- |
| Fourteen process demonstrations and studio stage | Original FORGE implementation, `src/machinery.ts`, `src/Scene.tsx` | Project MIT license for original code/geometry. |
| Lathed 250 ml can, rims, end, tab and rivet | Original FORGE implementation, `src/product.ts` | Original geometry; illustrative proportions, not licensed CAD. |
| Blue/silver label study with original angular bull motifs and nominative text | Original local Canvas2D drawing in `src/product.ts` | No photography, official logo files or copied label texture. Red Bull names and packaging cues identify the educational subject. No endorsement or trademark/trade-dress license is claimed; the MIT license does not grant rights in third-party marks. It is an artistic approximation, not exact official packaging. |
| Beverage carton, four hinged flaps and procedural labels | Original FORGE implementation, `src/product.ts`, `src/machinery.ts` | Original geometry/artwork under project MIT, subject to the same trademark qualification. |
| UI wordmark and controls | Retained/extended original FORGE shapes and system fonts | No font downloads. |

The custom can artwork is appropriate for this independent educational identification context; this does not establish general promotional merchandise or official-brand reuse rights. No production claim is inferred from its appearance.

Phase 2 adds no runtime dependencies. RoomEnvironment, RoundedBoxGeometry and mergeGeometries remain Three.js MIT components. OrbitControls is no longer imported or enabled by the presentation. Full existing dependency notices remain in THIRD_PARTY_NOTICES.txt.

---

# Phase 1 asset archive

# Asset research, authors and licensing

Research date: 2 November 2026.

| Asset / candidate | Author | Primary source | License | Decision |
| --- | --- | --- | --- | --- |
| Factory Kit, 140 industrial/conveyor assets | Kenney | https://kenney.nl/assets/factory-kit | CC0 1.0, explicitly stated on creator's page; https://creativecommons.org/publicdomain/zero/1.0/ | Researched before implementation. Not downloaded or bundled. General-purpose stylized geometry did not match the desired beverage tooling detail. |
| Entire factory: machinery, robot, warehouse, conveyors, cans, materials and floor | Original FORGE implementation, generated for this project | `src/factory.ts`, `src/Scene.tsx` | MIT; see `LICENSE` | Used. Editable procedural geometry, no external model or texture dependencies. |
| Interface mark and SVG icons | Original FORGE implementation | `src/main.tsx`, `index.html` | MIT | Used. No brand logo assets. |
| Reflection environment | Three.js contributors | https://github.com/mrdoob/three.js/blob/dev/examples/jsm/environments/RoomEnvironment.js | MIT, Three.js package license | Used: generated in memory, no external HDRI. |
| RoundedBoxGeometry, mergeGeometries, OrbitControls | Three.js contributors | https://github.com/mrdoob/three.js | MIT | Used through installed npm package. |

The decision is a compact, bespoke diorama rather than an extensive asset-pack warehouse. No suitable photorealistic beverage-specific model with confirmed redistribution rights was established within this research; this does not claim that none exists. The resulting machinery is recognizable, detailed and illustrative, rather than a CAD replica. No source photographs, diagrams, technical drawings, Red Bull logos or branded cans are redistributed. Source documents are linked rather than packaged.

## Dependency licenses

| Package | Author / steward | License |
| --- | --- | --- |
| React / React DOM | Meta and contributors | MIT |
| Three.js | Three.js contributors | MIT |
| @react-three/fiber | Poimandres and contributors | MIT |
| Vite / @vitejs/plugin-react | Vite contributors | MIT |
| TypeScript | Microsoft and contributors | Apache-2.0 |
| Playwright | Microsoft and contributors | Apache-2.0 |
| @types packages | DefinitelyTyped contributors | MIT |

`package-lock.json` pins the full dependency tree. For redistribution, preserve the project's MIT license and bundled dependency notices; see `THIRD_PARTY_NOTICES.txt`, generated from installed packages. External reference text remains the property of its respective publisher. Educational inspiration does not imply endorsement.
