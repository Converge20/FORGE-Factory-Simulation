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
