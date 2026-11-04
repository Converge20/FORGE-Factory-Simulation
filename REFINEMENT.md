# Manufacturing graphics and animation refinement

4 November 2026. Incremental update to the existing Phase 3 application; the original project and its source ZIP are preserved separately.

## Changes by station

| Station | Refinement |
| --- | --- |
| Aluminium forming | Moving sheet-feed markers, an illustrated drawing stroke, a workpiece transferred out of the die, and a guarded output conveyor. Workpiece size and support height match the outgoing body more closely. |
| Wash, coat and print | Open bodies travel through the wash and between contact rollers. Bare and decorated states switch at the printing operation. Rollers flank the path instead of intersecting it. |
| Water preparation | Floating drops are replaced by flow indicators inside actual transfer sight glasses; a restrained tank level indicates stored water. |
| Sugar preparation | Fewer crystals follow the hopper/chute into a sectioned dissolving vessel; a shaft turns inside and solution follows the outlet pipe. |
| Functional ingredients | Small transfer indicators follow the metering manifold. Vessel identities and the existing no-proprietary-dosing explanation remain. |
| Beverage blending | The original sectioned tank and impeller remain, with restrained submerged circulation and outlet transfer. |
| Carbonation | Bubbles rise within the visible liquid, with a connected illustrative gas feed and liquid outlet. |
| Can filling | Seven evenly spaced open cutaway cans index beneath three filling heads. The conveyor stops, valves lower, streams dispense and liquid rises; valves close before filled cans leave. The former separate stationary inlet/outlet cans are removed. |
| Can sealing | Filled open bodies arrive on the belt, stop under the tooling, receive an end, undergo the illustrated seaming cycle, and depart with the end in place. |
| Quality inspection | Cans pass a fixed sensor. One representative reject follows a supported branch through a real opening in the conveyor side rail. |
| Case packaging | A supported group arrives, is gripped and lifted by the gantry, moves over an open carton, is lowered and released, and leaves inside the closed carton. Empty cartons enter on a perpendicular supported feed. |
| Shipping and distribution | Closed cartons travel on the conveyor with consistent spacing and guarded loop boundaries. Existing rail context is retained. |
| Final departure | The original white, unbranded vehicle, wheel rotation, path, camera sequence and closing message remain. Dispatch cartons now move toward the dock, rest on the conveyor, and remain spaced under reduced motion. |

Both modes use the same machinery builder and motion functions. A persistent manufacturing clock survives mode and station switches; pausing freezes it. The departure remains a chapter-relative cinematic sequence so restart continues to work. Reduced motion provides a fixed representative state.

Explorer's distant machinery remains batched for performance, but its snapshots omit consumable product meshes and transient streams. The shared facility conveyors supply representative moving material. Around a selected detailed station, those overview products are suppressed so the module controls its own products without duplicate cans. Packaging/distribution modules face the actual outbound route; common pipes now meet the modules' outlet positions. Carton and can proxy heights match their conveyors.

## Scope and preservation

The interface, typography, styles, education components, complete chapter/source records, research register and truck-path module are byte-identical to the previous Phase 3 project. The can's existing label and outer profile remain; the open-can interior disk moves to the bottom so it no longer seals the mouth. No replacement hero can, image, paid service, runtime asset download or application dependency was added.

Modified source files:

- `src/machinery.ts` — retained machinery helpers with coordinated process animations.
- `src/productionMotion.ts` — new shared, pure motion/timing functions.
- `src/Scene.tsx` — persistent clock and Guided animation diagnostics.
- `src/ExplorerWorld.tsx` — shared clock, outbound orientation, selected-station product suppression and supported proxy sizes.
- `src/facility.ts` — material route start and support heights.
- `src/facilityModel.ts` — consumable-free distant snapshots, outbound orientation and connected pipe outlets.
- `src/product.ts` — open-can bottom placement only.
- `src/logistics.ts` — dispatch cartons and loop guards; the vehicle geometry/materials and departure motion are retained.

Tests: new `tests/production.test.mjs` and `tests/production.spec.ts`; `tests/explorer.spec.ts` allows more time for a software-WebGL focus render. Documentation additions are this report and `REFINEMENT_TRANSFER.md`, plus current README/validation/asset notes.

## Interpretation and remaining limits

All speeds, cycle phases, sample sizes, exposed sections and transfer indicators are illustrative presentation choices. The update does not establish Red Bull settings, machine suppliers, throughput, ingredient dosing or a proprietary factory layout. Existing evidence classifications and research links remain intact.

Finite conveyor demonstrations recycle products inside their guarded end zones. They do not track individual cans from aluminium coil to the departing truck. Bare-to-decorated change, drawing and seaming are simplified educational transformations; no wall-thickness or seam-deformation solver is included. Mixing and carbonation indicators explain direction and circulation rather than simulating fluid dynamics.

Distant machine mechanisms are snapshots, while selected equipment and common conveyor flow animate. The scene uses camera clipping safeguards rather than general physical collision detection. Browser tests and geometric invariants cover representative movement; they do not prove absence of every intersection at every camera angle. Desktop/mobile browser review is included, but physical Mac GPU performance, native trackpad feel and thermal behavior remain unmeasured.

See VALIDATION.md for executed checks and RESEARCH.md/ASSETS.md for evidence and licensing.
