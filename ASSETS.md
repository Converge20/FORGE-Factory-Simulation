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
