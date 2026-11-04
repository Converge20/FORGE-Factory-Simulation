# Phase 3 research and evidence register

Reviewed before implementation on 3 November 2026 (client timezone America/New_York). Phase 2 documentation follows below as a historical archive; its removed can-reveal entry is not current Phase 3 behavior.

## Source verification

The requested Red Bull lifecycle, ingredient and production-location pages were opened and reviewed, as was the retained ingredient Q&A. The international English ingredient reference still supplies original-250-ml product facts; Namibia English pages supply manufacturing/distribution context. No market-specific complete nutrition label is reconstructed.

GEA DISUGAR, Krones Contiflow, Modulfill Bloc FS-C, Checkmat SLD and palletising pages were reopened. Their actual text supports dissolution/control, deaeration/dosing/carbonation, linked filling/seaming, can leakage inspection, and pack/pallet handling respectively. None establishes a Red Bull supplier relationship. Published equipment capacities, pressures, temperatures and tolerances are not assigned to this visualization.

The Ball document remains available through indexed technical text; direct PDF access was blocked in prior research. This limitation is preserved. No source diagram is copied or newly claimed to have been visually inspected.

## Current structured claim mapping

The common `chapters` records in `src/story.ts` provide `fact`/`factSource` (Red Bull information), `practice`/`practiceSource` (industry context) and `assumption` (reconstruction boundary). Their 101–107-word explanations are shared by reference in `explorerStations`, with the same citations in both modes. UI expansion does not change the underlying text or evidence level.

| Chapter / Explorer station | Description and evidence | Reconstruction boundary |
| --- | --- | --- |
| 01 Connected introduction | R1 wall-to-wall concept; I4 stream convergence. | Whole layout and material-flow routing are illustrative. |
| 02 Forming | I1 coil, cupper, bodymaker and trimming; R1 aluminium packaging. | Retained exposed ram/tooling and simplified cup growth. |
| 03 Preparation/decoration | I1 washing, coatings, printing, curing, necking/flanging; R1 packaging properties. | Several industrial steps compressed into one module. |
| 04 Water | R2 water ingredient; I3 water preparation/deaeration context. | Filter media, sequence and targets are not Red Bull procedures. |
| 05 Sugar | I2 dissolving with water and mixing; R2 product sugar fact. | Hopper and feed motion are symbolic; label sugar is not a dosing instruction. |
| 06 Functional ingredients | R2/R4 ingredient categories; I3 controlled ingredient streams. | Vessel count, addition order and quantities are not established. |
| 07 Blending | I3 combining incoming streams; R4 categories. | Impeller, liquid appearance and recipe ratios illustrative. |
| 08 Carbonation | I3 gas dosing/carbonation context; supplied Red Bull pages do not specify its equipment. | Enlarged bubbles and no claimed Red Bull conditions. |
| 09 Filling | I4 filling/seaming equipment; R1 co-location. | Sectioned cans, visible levels, timing and hygiene cutaways illustrative. |
| 10 Sealing | I4 linked can seamer; R3 filled-can production context. | End/roller motion is not a validated seam cross-section. |
| 11 Inspection | I5 laser/camera measurement of lid shape to infer leak tightness; R1 quality context. | Blue scan and immediate rejection are illustrative, not Red Bull protocols or a literal Checkmat installation/timing. |
| 12 Packaging | I6 grouping/pallet handling; R1 recyclable cardboard. | Same Phase 2 gantry, packing pattern, carton and cycle retained. |
| 13 Distribution | R3 main locations and rail/ship onward transport; I6 pack handling. | Conveyor, dock, storage arrangement and road route illustrative. |
| 14 White truck departure | R3 onward distribution and I6 handling context only. | Generic, unbranded truck; no actual Red Bull fleet, carrier, route, loading procedure or vehicle specification is claimed. |

Reference keys R1–R4 and I1–I6 retain the full URLs listed in the Phase 2 archive below. The current application also links each source directly beneath its relevant content.

## Explorer and truck assumptions

Eight zones share a compact factory slab, connected conveyors, ingredient pipe headers, walkways and a dispatch road. Their placement, machine scale, stream-marker speed, floor stencils and camera targets are original explanatory choices. Overview mechanisms are frozen batched snapshots; selecting a machine runs its existing Phase 2 animation. The markers are representative flow, not tracked production counts.

The truck is locally generated geometry. Its body and enclosed trailer are plain white, with dark windows, tires, chassis, mirrors and lamps. There are no logos, product graphics, lettering or advertisements on it. Environment markings are road/factory markings, not truck decoration. Boxes moving toward dispatch imply a completed shipment; no validated interior loading simulation is represented.

The scene starts with a parked loading-dock view. Departure begins after six presentation seconds, reaches a gentle yard-driving pace, follows a shallow access-road curve and finishes at a held closing view. These are animation choices, not operating instructions or real speed data. Tires rotate with path distance divided by their modeled radius; the trailer and front-wheel steering respond to the path. Reduced motion presents a static completed state. The former can close-up/carton-opening finale is not rendered.

---

# Phase 2 research archive

# Phase 2 research and claim register

Reviewed 3 November 2026 before implementing the cinematic presentation. The Phase 1 research is preserved below as historical context; Phase 2 stage claims and current UI sources are governed by this register.

## Product and regional scope

Subject: the original 250 ml Red Bull Energy Drink, using the **international English product/ingredient reference** for ingredient categories and the published 80 mg caffeine / 27 g sugars values. This is not a reproduction of any particular country's complete legal nutrition label. The **Namibia English** lifecycle and production Q&A supply manufacturing/distribution context. No values from Sugarfree, Zero or Editions are combined with the original. Label facts are not manufacturing doses.

## Primary references

- R1: Red Bull, Namibia English, Can lifecycle: https://www.redbull.com/na-en/energydrink/red-bull-can-lifecycle
- R2: Red Bull, international English, Original ingredients: https://www.redbull.com/int-en/energydrink/products/red-bull-energy-drink-ingredients-list
- R3: Red Bull, Namibia English, Production locations Q&A: https://www.redbull.com/na-en/energydrink/questions/where-is-red-bull-energy-drink-produced
- R4: Red Bull, international English, Ingredients Q&A: https://www.redbull.com/int-en/energydrink/questions/what-are-the-ingredients-of-red-bull-energy-drink

All four requested pages were opened and reviewed. Their claims do not identify individual equipment suppliers, plant layouts, exact process sequence, recipe ratios or operating settings.

## Equipment references

- I1: Ball, Inside a Ball Beverage Can Plant: https://www.ball.com/getmedia/4db64513-133d-4fa8-9de0-89fd7c2724f9/How_a_Ball_Metal_Beverage_Can_Is_Made.pdf — indexed technical text available; direct PDF retrieval again returned HTTP 403. No diagram was copied.
- I2: GEA DISUGAR: https://www.gea.com/en/products/liquid-processing/sugar-dissolvers/disugar-sugar-dissolving-systems/ — crystal dissolution with water, batch/continuous dissolving.
- I3: Krones Contiflow: https://www.krones.com/en/products/process-technology/single-lines/contiflow-mixer/ — public mixing, deaeration and carbonation principles. No published machine setting is transferred into FORGE.
- I4: Krones Modulfill Bloc FS-C: https://www.krones.com/en/products/filling-and-packing-technology/block-synchronised-systems/can-filler-seamer-block-modulfill-bloc-fs-c/ — linked filling and seaming.
- I5: Krones Checkmat SLD: https://www.krones.com/en/products/filling-and-packing-technology/single-machines/inspection-technology/checkmat-sld-leakage-detection-for-beverage-cans/ — can seam leakage detection.
- I6: Krones palletising: https://www.krones.com/en/products/filling-and-packing-technology/single-machines/palletising-technology/ — automated grouping and pallet handling.

These manufacturers illustrate industry principles; FORGE does **not** claim that they supply Red Bull or that the shown machinery is their equipment.

## Stage-by-stage register

| Chapter | Direct Red Bull information | Industry practice | Artistic / unverified reconstruction |
| --- | --- | --- | --- |
| 01 Connected factory | On-site can/beverage production and filling: R1. | Streams meet at filling: I4. | Entire compact site and camera path. |
| 02 Can formation | Recyclable aluminium packaging: R1. | Cupping, drawing/ironing, trimming: I1. | Exposed punch, ring tooling and simplified body stretch; no accurate metal deformation. |
| 03 Preparation/printing | Packaging is lightweight and light-proof: R1. | Washing, coating, decoration, curing, necking/flanging: I1. | A single cutaway represents multiple machines. Spray and rotating printing tools are illustrative. |
| 04 Water preparation | Water is a main ingredient: R2. | Water deaeration and transfer may be part of beverage mixing: I3. | The filter skid, filter count and media sequence are not Red Bull facts. |
| 05 Sugar | 27 g sugars per original 250 ml: R2. | Dissolving crystals with water: I2. | Hopper, feed speed and tank size. The published label value is not a production dosing setting. |
| 06 Functional ingredients | Caffeine, taurine and B-group vitamins are listed: R4. | Ingredient streams can be metered and mixed: I3. | Three vessels, labels, sequencing, valve movement and quantities. |
| 07 Blending | Listed ingredient categories: R4. | Combining beverage streams: I3. | Impeller type, vessel, ingredient ratios, liquid colour and routing. |
| 08 Carbonation | Supplied Red Bull pages do not specify carbonation machinery/settings: R4 scope boundary. | Carbonators and deaerators are documented: I3. | Enlarged bubbles, contact vessel, gas delivery and conditions. No Red Bull process claim is made. |
| 09 Filling | Filling can be co-located with can/beverage production: R1. | Linked rotary filler/seamer: I4. | Enlarged stationary cutaway shows levels rising; valve timing, open cutaway and volume appearance are not settings. |
| 10 Sealing | Filled cans leave main production sites: R3. | Filler/seamer synchronisation: I4. | Lid positioning and orbiting seam rollers explain the closure concept, not a validated seam cross-section. |
| 11 Inspection | Production-quality commitment: R1. | Can leakage inspection exists: I5. | Visible blue scan, rejection, sensors and acceptance criteria. Actual leakage detection is not necessarily optical. |
| 12 Packaging | Recyclable cardboard packaging: R1. | Automated grouping and pack/pallet handling: I6. | Gantry, case style, six representative cans, flap timing and sequence. |
| 13 Distribution | Main sites Austria, Switzerland, US; rail/ship onward transport: R3. | Pallet handling: I6. | Loading platform, wagon, route, geometry and travel timing. |
| 14 Reveal | 80 mg caffeine per original 250 ml: R2. | Completed packs are handled after filling/packing: I6 context. | Entire studio, carton opening, levitating can, artwork and closing sequence are an artistic presentation. |

The UI records these same distinctions per chapter in `src/story.ts` and displays them in Sources & notes. A Red Bull fact adjacent to a machine does not verify that machine.

## Simulation and visual limits

- Fourteen chapters are an explanatory order, not an authenticated order of operations for any Red Bull facility.
- No operating speeds, pressures, temperatures, dwell times, exact supplier identities, formulation ratios or quality limits are asserted.
- Liquid surfaces, fill amounts, bubbles and crystal counts are explanatory geometry, not validated fluid or particle simulation.
- Machinery and containers are enlarged, cut away and rearranged for legibility. No sanitation, safety clearance or maintenance guidance should be derived from them.
- The final label is an original nominative packaging study. It is not a copied brand asset, regional legal label or officially licensed Red Bull artwork. Red Bull trademarks and trade dress remain with their respective owners.

---

# Phase 1 research archive

# Evidence and modeled machinery

FORGE is independent of Red Bull and is not an official project. The facility is an imagined compact diorama, not a reproduction of Red Bull's proprietary layout or manufacturing settings. Verified facts below concern public processes, not this scene's exact machines.

## Primary references

1. **Red Bull — Sustainability & Energy Drink Can Lifecycle**  
   https://www.redbull.com/in-en/energydrink/red-bull-can-lifecycle  
   Read the official production and transport sections. Supports on-site can and beverage production alongside filling (wall-to-wall), and onward transport using rail and ship where feasible. The scene draws on the co-location concept, not a specific plant.
2. **Ball Corporation — Inside a Ball Beverage Can Plant**  
   https://www.ball.com/getmedia/4db64513-133d-4fa8-9de0-89fd7c2724f9/How_a_Ball_Metal_Beverage_Can_Is_Made.pdf  
   The official document's indexed text was available for the numbered production sequence. Direct PDF retrieval through the research browser returned HTTP 403; no local PDF or diagram is redistributed. Process mapping uses the indexed text, not a claimed visual inspection of the original PDF.
3. **Krones — Modulfill Bloc FS-C**  
   https://www.krones.com/en/products/filling-and-packing-technology/block-synchronised-systems/can-filler-seamer-block-modulfill-bloc-fs-c/  
   Read official equipment documentation supporting linked can filler and seamer equipment, and filling valve operation. The modeled machine is not a branded Krones replica and does not claim any published output rating.
4. **Krones — Palletising technology**  
   https://www.krones.com/en/products/filling-and-packing-technology/single-machines/palletising-technology/  
   Supports automated pack/layer grouping, pallet transport, and robotic palletising. The FORGE arm geometry and trajectory are illustrative, not Krones machine kinematics.

Accessed 2 November 2026. No recipe, temperature, pressure, fill-volume tolerance, hygiene setting, yield or real throughput is inferred.

## Fact versus illustration

| Verified public process | How FORGE presents it | Illustrative assumptions / omissions |
| --- | --- | --- |
| Aluminium coil feeds lubrication and cupping; blanks become cups. [Ball] | Uncoiler with concentric sheet rings, feed sheet, four-column cupping press, die bed and ram. | Feed drive, die count, press strokes and lubrication are not simulated. |
| Bodymakers redraw and iron cups; trimmers establish uniform height. [Ball] | Horizontal bodymaker with ram, die housing, motor and coolant line. | No actual metal deformation or scrap removal. Press and bodymaker transfer is compressed into a representative line. |
| Washing/rinsing/drying precedes decoration and internal coatings; ovens cure coatings. [Ball] | Wash/curing tunnel with service doors, vents and extraction stacks. | Multiple full-scale operations combined into an enclosure; no chemical wash or oven physics. |
| Necking narrows the opening; flanging prepares a lip for an end; inspection checks bodies. [Ball] | Exposed representative multi-head finishing module and inspection sensor. | Tooling order/count is symbolic; no optical pass/fail or reject stream. |
| Beverage and can production with filling can be co-located. [Red Bull] | Three sanitary process/buffer tanks, manways, agitator motors, valve skid and supply pipe to filler. | Exact preparation equipment, ingredients, formulations and piping topology are not established. |
| Rotary filler and adjacent can seamer can form a linked block. [Krones] | Circular valve array, rotating cans, transfer wheel, seamer heads and stacked end magazine. | 24 visible filling positions and 6 seam heads are design choices. No real valve timing, fluid fill, gas cycle or double-seam formation. Guards are cut away for visibility. |
| Automated grouping, packing and palletising are documented industrial operations. [Krones; Red Bull packaging section] | Grouping conveyor, tray/wrap enclosure with film roll, articulated arm, fenced cell and loaded pallet. | No claim about which vendors or packing machines Red Bull uses. Packs are geometric; no wrap physics or actual pick/grip cycle. |
| Finished product moves onward for distribution. [Red Bull] | Pallet rollers, two storage bays, beams, bracing, pallets and cartons. | Rack layout, capacity, automation, dimensions, pallet and carton patterns invented for composition. No real logistics model. |

## Scene-wide assumptions

- All dimensions, routing and spacing are composed for legibility. No scale, safety clearance, guard arrangement or maintenance access should be interpreted as engineering guidance.
- The line is visually connected but simplified; all manufacturing substeps, pallet buffers and hygienic zone separations are not modeled.
- Visible silver cans indicate representative movement. They do not physically change from cups into bodies, acquire decoration, fill, seal, or become packs. Decorative cans on the rotary filler are separate geometry.
- 100 moving conveyor markers, a 24-position carousel and approximately 0.013 conveyor-route cycles per second are presentation parameters only. They have no relationship to a real plant's cans/minute.
- Robot and carousel speeds, shadow/light placement, station positions, camera moves and a 6.5-second tour stop are illustrative.
- Warehouse contents are static. No inventory, production total, efficiency, utilization or simulated economic metric is asserted.

## Full modeled-equipment inventory

**Can forming:** coil roll and hub, uncoiler base, sheet feed, press base and crown, four support columns, die table, ram, flywheel, bolts and control panel; horizontal bodymaker, ram, die housing, drive motor and cooling pipe.

**Wash and finish:** integrated wash/curing shell, three service hatches and windows, handles, ventilation strips, two exhaust stacks; finishing head array, supporting gantry, inspection head, indicator light and panel.

**Preparation:** three stainless process/buffer vessels with dished shoulders, lower transitions, support legs, reinforcing bands, side manways, top agitator motors, overhead pipe manifold, transfer pipe, drain/valve skid and control panel.

**Fill and seal:** circular base and bowl, central column, 24 valve/nozzle assemblies and feed pipes, support/guard posts, orange ring, carousel cans, top drive, transfer starwheel, six-head seamer representation, end-feed magazine and control panel.

**Pack and palletise:** grouping conveyor, enclosure frame, packaging hood, film roll and spindle, control panel, articulated arm with base/shoulder/elbow/wrist and vacuum-style tool, yellow safety posts and mesh fences, pallets and cartons.

**Warehouse and infrastructure:** two storage rack bays, uprights, footplates, load beams, shelf supports and diagonal bracing, loaded pallets, pallet roller conveyor; stainless conveyor frames with individually modeled rollers, guide rails, support feet and drive motors; electrical cabinets, pipework, access steps, concrete slab, floor joints, lane markings, low cutaway walls and structural uprights.
