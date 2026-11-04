import type { Vec3 } from "./process";
export const sources = {
  lifecycle: {
    title: "Red Bull · Can lifecycle (Namibia, English)",
    url: "https://www.redbull.com/na-en/energydrink/red-bull-can-lifecycle",
  },
  ingredients: {
    title: "Red Bull · Original ingredients (international English)",
    url: "https://www.redbull.com/int-en/energydrink/products/red-bull-energy-drink-ingredients-list",
  },
  locations: {
    title: "Red Bull · Where is it produced? (Namibia, English)",
    url: "https://www.redbull.com/na-en/energydrink/questions/where-is-red-bull-energy-drink-produced",
  },
  list: {
    title: "Red Bull · Ingredients Q&A (international English)",
    url: "https://www.redbull.com/int-en/energydrink/questions/what-are-the-ingredients-of-red-bull-energy-drink",
  },
  ball: {
    title: "Ball · Inside a Ball Beverage Can Plant",
    url: "https://www.ball.com/getmedia/4db64513-133d-4fa8-9de0-89fd7c2724f9/How_a_Ball_Metal_Beverage_Can_Is_Made.pdf",
  },
  mixer: {
    title: "Krones · Contiflow mixer",
    url: "https://www.krones.com/en/products/process-technology/single-lines/contiflow-mixer/",
  },
  sugar: {
    title: "GEA · DISUGAR dissolving systems",
    url: "https://www.gea.com/en/products/liquid-processing/sugar-dissolvers/disugar-sugar-dissolving-systems/",
  },
  filler: {
    title: "Krones · Modulfill Bloc FS-C",
    url: "https://www.krones.com/en/products/filling-and-packing-technology/block-synchronised-systems/can-filler-seamer-block-modulfill-bloc-fs-c/",
  },
  inspection: {
    title: "Krones · Checkmat SLD can leakage detection",
    url: "https://www.krones.com/en/products/filling-and-packing-technology/single-machines/inspection-technology/checkmat-sld-leakage-detection-for-beverage-cans/",
  },
  packing: {
    title: "Krones · Palletising technology",
    url: "https://www.krones.com/en/products/filling-and-packing-technology/single-machines/palletising-technology/",
  },
};
export type SourceKey = keyof typeof sources;
export interface Chapter {
  id: string;
  part: string;
  title: string;
  subtitle: string;
  explanation: string;
  summary?: string;
  fact: string;
  factSource: SourceKey;
  practice: string;
  practiceSource: SourceKey;
  assumption: string;
  eye: Vec3;
  look: Vec3;
}
const baseChapters: Chapter[] = [
  {
    id: "connected",
    part: "THE CONNECTED FACTORY",
    title: "One can.\nA world of making.",
    subtitle: "THE ORIGINAL · 250 ML",
    explanation:
      "Follow aluminium and ingredients through fourteen chapters, from the first sheet to the finished can.",
    fact: "Red Bull describes making cans, producing the beverage and filling on the same site.",
    factSource: "lifecycle",
    practice: "Production streams converge at the filling line.",
    practiceSource: "filler",
    assumption: "An imagined factory, not a documented Red Bull plant layout.",
    eye: [27, 19, 28],
    look: [0, 1, 0],
  },
  {
    id: "forming",
    part: "MAKE THE CAN",
    title: "Strength,\ndrawn thin.",
    subtitle: "02 / ALUMINIUM CAN FORMATION",
    explanation:
      "A blank becomes a shallow cup. A punch then redraws and irons it through dies into a thin, seamless body.",
    fact: "Red Bull uses aluminium packaging that can be recycled repeatedly.",
    factSource: "lifecycle",
    practice:
      "Cupping, drawing and ironing, then trimming are documented can-making operations.",
    practiceSource: "ball",
    assumption:
      "Exposed tooling, geometry and motion illustrate the principle; they are not Red Bull equipment.",
    eye: [8, 5, 10],
    look: [-0.7, 1.5, 0],
  },
  {
    id: "printing",
    part: "MAKE THE CAN",
    title: "A surface\nwith a purpose.",
    subtitle: "03 / WASH, COAT & PRINT",
    explanation:
      "The body is washed, decorated and coated. Curing prepares it for necking and flanging, before it can be filled.",
    fact: "Red Bull describes its aluminium cans as light-proof and light in weight.",
    factSource: "lifecycle",
    practice:
      "Washing, printing, internal coating and curing precede necking and inspection.",
    practiceSource: "ball",
    assumption:
      "A cutaway wash-and-decoration module compresses several separate industrial steps.",
    eye: [7, 4.8, 9],
    look: [-0.8, 1.4, 0],
  },
  {
    id: "water",
    part: "MAKE THE DRINK",
    title: "It begins\nwith water.",
    subtitle: "04 / WATER PREPARATION",
    explanation:
      "A sanitary water-treatment skid illustrates filtration and a clean transfer stream toward beverage preparation.",
    fact: "Water is a main ingredient of Red Bull Energy Drink.",
    factSource: "ingredients",
    practice:
      "Beverage mixing equipment can include water deaeration and controlled transfer.",
    practiceSource: "mixer",
    assumption:
      "Filter types and treatment sequence are illustrative; Red Bull’s exact water-treatment system is not documented here.",
    eye: [7, 5.2, 10],
    look: [-0.6, 1.7, 0],
  },
  {
    id: "sugar",
    part: "MAKE THE DRINK",
    title: "Crystals\ninto solution.",
    subtitle: "05 / SUGAR PREPARATION",
    explanation:
      "A hopper meters crystals into a dissolving vessel. Agitation illustrates how a sugar solution can be prepared.",
    fact: "The international English reference lists 27 g of sugars in an original 250 ml can.",
    factSource: "ingredients",
    practice:
      "Industrial sugar dissolvers mix crystals with water, in batch or continuous systems.",
    practiceSource: "sugar",
    assumption:
      "The visible feed and cycle are symbolic. The label value is not a plant dosing instruction.",
    eye: [7.4, 5.2, 10],
    look: [-0.7, 1.6, 0],
  },
  {
    id: "functional",
    part: "MAKE THE DRINK",
    title: "Small additions.\nDistinct character.",
    subtitle: "06 / FUNCTIONAL INGREDIENTS",
    explanation:
      "Separate ingredient vessels feed a representative metering manifold. No proprietary recipe or manufacturing dose is shown.",
    fact: "Red Bull identifies caffeine, taurine and B-group vitamins among its ingredients.",
    factSource: "list",
    practice:
      "Metering and mixing can combine ingredient streams before filling.",
    practiceSource: "mixer",
    assumption:
      "Vessel count, ingredient order and dosing hardware are artistic reconstruction.",
    eye: [7, 5, 10],
    look: [-0.6, 1.5, 0],
  },
  {
    id: "blending",
    part: "MAKE THE DRINK",
    title: "Many streams.\nOne beverage.",
    subtitle: "07 / BEVERAGE BLENDING",
    explanation:
      "Water and prepared ingredients converge. A cutaway vessel makes the mixing action visible.",
    fact: "The listed ingredients include sugar, water, caffeine, taurine and B-group vitamins.",
    factSource: "list",
    practice: "Mixers combine beverage streams under controlled conditions.",
    practiceSource: "mixer",
    assumption:
      "Agitator, liquid colour and pipe routing are illustrative; no ingredient ratios are modeled.",
    eye: [7, 5.5, 10],
    look: [-0.7, 1.6, 0],
  },
  {
    id: "carbonation",
    part: "MAKE THE DRINK",
    title: "A little\neffervescence.",
    subtitle: "08 / CARBONATION & PREPARATION",
    explanation:
      "A gas-contact vessel illustrates carbonation before transfer to the filler. Rising bubbles are deliberately enlarged so the process can be seen.",
    fact: "The supplied Red Bull references do not specify its carbonation equipment or operating settings.",
    factSource: "list",
    practice:
      "Public beverage equipment documentation combines mixing, deaeration and carbonation.",
    practiceSource: "mixer",
    assumption:
      "Gas contact, pressure, temperature and residence time are not a reconstruction of Red Bull settings.",
    eye: [7, 4.7, 10],
    look: [-0.8, 1.5, 0],
  },
  {
    id: "filling",
    part: "CLOSE THE LOOP",
    title: "The moment\nthey meet.",
    subtitle: "09 / CAN FILLING",
    explanation:
      "Open bodies index beneath filling valves. This enlarged cutaway lets you see the beverage level rise before the next transfer.",
    fact: "Red Bull documents filling alongside on-site can and beverage production.",
    factSource: "lifecycle",
    practice:
      "Linked rotary filler and seamer blocks are publicly documented beverage equipment.",
    practiceSource: "filler",
    assumption:
      "Valve timing and the exposed cross-section are explanatory, not Red Bull production settings.",
    eye: [6.5, 4.4, 9],
    look: [-0.7, 1.5, 0],
  },
  {
    id: "sealing",
    part: "CLOSE THE LOOP",
    title: "One final\nconnection.",
    subtitle: "10 / CAN SEALING",
    explanation:
      "An end is positioned on the filled body. Seaming rollers illustrate the closure operation around the rim.",
    fact: "Red Bull describes cans being filled at its main production sites.",
    factSource: "locations",
    practice: "A can seamer can be synchronised with its filler.",
    practiceSource: "filler",
    assumption:
      "The enlarged tooling and lid motion are symbolic, not a validated double-seam cross-section.",
    eye: [6, 5, 8],
    look: [-0.7, 1.3, 0],
  },
  {
    id: "inspection",
    part: "CLOSE THE LOOP",
    title: "Look closer.\nThen move on.",
    subtitle: "11 / QUALITY INSPECTION",
    explanation:
      "Cans pass through an inspection arch. A visible scan and a side reject lane explain a representative end-of-line check.",
    fact: "Red Bull emphasises consistent product quality in its production information.",
    factSource: "lifecycle",
    practice:
      "Public inspection systems detect leakage in beverage-can closures.",
    practiceSource: "inspection",
    assumption:
      "The scan light and reject logic are illustrative. No Red Bull test protocol or acceptance limit is claimed.",
    eye: [7.5, 4.5, 10],
    look: [-0.7, 1.2, 0],
  },
  {
    id: "packaging",
    part: "READY TO TRAVEL",
    title: "From individual\nto together.",
    subtitle: "12 / CASE PACKAGING",
    explanation:
      "A pick-and-place gantry groups finished cans into a beverage carton. The flaps close to prepare the pack for handling.",
    fact: "Red Bull reports using recyclable cardboard for its cardboard packaging.",
    factSource: "lifecycle",
    practice: "Automated grouping and palletising handle beverage packs.",
    practiceSource: "packing",
    assumption:
      "Carton geometry, can arrangement and packing motion are original illustrative assets.",
    eye: [7.2, 5, 10],
    look: [-0.7, 1.3, 0],
  },
  {
    id: "distribution",
    part: "READY TO TRAVEL",
    title: "The journey\ncontinues.",
    subtitle: "13 / SHIPPING & DISTRIBUTION",
    explanation:
      "A finished carton moves toward a loading platform. The next destination reaches beyond this factory.",
    fact: "Red Bull lists Austria, Switzerland and the US as main production locations, with rail and ship used for onward transport.",
    factSource: "locations",
    practice: "Pallet handling moves finished packs toward dispatch.",
    practiceSource: "packing",
    assumption:
      "Loading dock, rail wagon and route are illustrative rather than a real distribution network.",
    eye: [9, 5.5, 12],
    look: [-0.6, 1.3, 0],
  },
  {
    id: "departure",
    part: "READY FOR THE ROAD",
    title: "Ready for\nwhat comes next.",
    subtitle: "14 / THE DEPARTURE",
    explanation:
      "A completed shipment meets a generic white tractor-trailer at the loading dock. Follow its departure along the access road.",
    fact: "Red Bull describes onward distribution by rail and ship after filling at its main production sites.",
    factSource: "locations",
    practice:
      "Completed packs can move through pallet handling toward dispatch.",
    practiceSource: "packing",
    assumption:
      "The unbranded truck, loading dock and road are generic illustrations, not a Red Bull fleet, carrier or route.",
    eye: [22, 13, 25],
    look: [-1, 1.3, 0],
  },
];
const expandedExplanations: Record<string, string> = {
  connected:
    "This connected factory brings two material streams together: aluminium becomes empty cans, while water and prepared ingredients become a beverage. Conveyors carry the cans between forming, finishing, filling and packaging. Pipes connect the preparation vessels to the blending and filling areas. Finished packs move toward a loading dock for distribution. Keeping the streams connected helps explain how separate operations contribute to one finished product. The layout is deliberately compact so you can see these relationships. Red Bull describes co-located production and filling, but this arrangement, its machines and their timing are an illustrative reconstruction rather than a documented plant floor plan.",
  forming:
    "Aluminium sheet enters from a coil and passes into a forming press. In standard can manufacture, a press cuts circular blanks and draws them into shallow cups. A bodymaker then pushes each cup through tooling that redraws and irons its walls, producing a taller, thinner can body with an integral base. Trimming prepares a consistent open edge for later operations. The exposed ram and tooling rings make that mechanical transformation easier to follow here. The emerging bodies move toward washing and finishing. Their changing geometry is simplified, and neither the tooling dimensions nor the visible cycle represents Red Bull's actual equipment or operating settings.",
  printing:
    "Newly formed can bodies need preparation before they can carry a drink. Standard can-making lines wash away residues, dry the metal and apply decoration and protective coatings. Curing stages set the applied inks and coatings; later necking and flanging prepare the opening for an end. The wash enclosure, spray and printing rollers shown here combine several separate operations into one readable cutaway. Clean, finished bodies continue toward the filling stream. This sequence explains common can manufacture, rather than identifying a particular Red Bull printer, coating formulation, washing chemistry or production arrangement. Internal coating protects the beverage-facing surface; the decoration identifies the finished package.",
  water:
    "Water enters a preparation area before joining the other beverage ingredients. The illustrated skid has filter housings, a buffer vessel and sanitary transfer pipes, making the route of this incoming liquid visible. Public beverage equipment documentation also describes deaeration, which removes dissolved gas from water before subsequent mixing. Consistent preparation gives the downstream equipment a suitable incoming stream. From this area, pipework leads toward blending rather than onto the can conveyor. Red Bull identifies water as a main ingredient, but the filter media, treatment sequence, vessel count and quality targets shown here are not established Red Bull procedures. They are explanatory machinery choices.",
  sugar:
    "In this illustration, sugar enters a preparation vessel through a hopper. A feed route carries the crystals toward water, where mixing helps them dissolve into a more uniform liquid. Public sugar-dissolving equipment uses controlled sugar and water addition and mixing to prepare solutions for downstream beverage production. Preparing a transferable liquid makes the next blending stage easier to explain than adding loose crystals directly to individual cans. The solution then leaves through the tank's pipework. The hopper, vessel and visible movement are illustrative: they do not establish Red Bull's exact preparation process. The separately cited product sugar content is a label fact, not a manufacturing dosing instruction.",
  functional:
    "Separate small vessels represent the preparation and metering of functional ingredients. Their labels identify caffeine, taurine and B-group vitamins, which Red Bull lists among the original product's ingredients. In a beverage plant, prepared ingredient streams can be measured and transferred through a manifold toward mixing equipment. The moving valve illustrates a controlled transfer path, not a particular amount or recipe. These streams join water and sugar preparation before the beverage reaches filling. Dividing the demonstration into vessels makes the role of ingredient preparation visible. Red Bull's actual vessel arrangement, ingredient addition order, concentrations and control settings are not established by this reconstruction.",
  blending:
    "Prepared liquid streams arrive through pipes and join in a blending area. The cutaway vessel exposes an impeller, showing how mechanical circulation can bring incoming liquids together. Public beverage mixers also use controlled dosing and mixing arrangements to combine water and ingredients. A consistent outgoing stream is important before further preparation and filling, because each can should receive the intended beverage rather than separate ingredient layers. The mixture leaves through the lower transfer line and continues toward the next process. The impeller design, liquid appearance, piping route and proportions in this scene are illustrative. No proprietary Red Bull formulation or mixing setting is reproduced.",
  carbonation:
    "A prepared beverage stream enters a gas-contact demonstration before continuing toward filling. Enlarged rising bubbles make the addition of gas visible, while the vessel and transfer pipe suggest how liquid can move through this part of a beverage line. Public mixer and carbonator documentation describes dosing, deaeration and carbonation as related operations; gas must dissolve into the liquid under suitable conditions. Those principles explain the scene, but the bubbles are explanatory geometry rather than a fluid simulation. The supplied Red Bull pages do not establish its carbonation equipment, gas quantity, pressure, temperature or residence time. None of those plant-specific settings is asserted here.",
  filling:
    "Open can bodies arrive beneath filling valves, bringing the packaging stream together with the prepared beverage. The enlarged sectioned cans let you see the liquid level rise while the valve assembly supplies the illustrated flow. In standard industrial equipment, a filler manages the transfer before each container moves onward to closure; linked rotary filling and seaming blocks are publicly documented. This stage turns an empty body into a filled container ready to receive its end. The visible stations are deliberately simplified for teaching. Their valve timing, fill-height motion and exposed surfaces do not represent Red Bull settings or a practical hygienic machine design.",
  sealing:
    "A filled can needs a closure before it can be handled as a finished package. An end approaches the open body, and the orbiting tooling illustrates how a seaming operation works around the rim. In standard equipment, the end and body flange are mechanically joined; filler and seamer can operate as a synchronised block. The closed container then continues toward inspection and packaging. This view enlarges the important moving parts so their relationship is easy to see. It does not show a validated double-seam cross-section, actual roller profiles or a Red Bull closure specification. The motion is an explanation of the operation, not engineering guidance.",
  inspection:
    "Closed cans travel through an inspection arch before entering packaging. The visible scan and side lane show the general idea of checking containers and separating a suspect item. Public can-inspection documentation describes a contact-free system that uses a laser and camera to measure lid shape and infer leak tightness. This provides an industry example of why closure checks matter. Acceptable containers can proceed toward grouping and packing, while inspection protects the next handling steps from passing on an identified problem. The blue scan, rejection action, timing and criteria shown here are illustrative; no Red Bull testing protocol or acceptance limit is reproduced.",
  packaging:
    "Finished cans reach a grouping conveyor and are collected into a transportable pack. The existing gantry carries a small group into a carton, then the carton flaps close around the load. This changes the handling unit from individual containers to a pack that can move through warehouse operations. Public beverage-handling equipment supports grouping, palletising and the transfer of finished packs. From here, cartons continue along the logistics route toward dispatch. The displayed carton style, pack arrangement, gripping tool and timing are original illustrations, not claims about Red Bull's chosen equipment. This useful Phase 2 packing movement is retained in both experience modes.",
  distribution:
    "Packed cartons leave the manufacturing line and move toward storage and dispatch. The roller conveyor and loading route connect packaging to the shipping area, showing that production ends with a handling task rather than an isolated finished can. A load can be organised into larger transport units before leaving a site. Red Bull lists main production locations in Austria, Switzerland and the US, and describes rail and ship transport for much of its onward distribution. This compact warehouse arrangement and road connection are illustrative. The scene does not identify an actual shipping route, logistics contractor, pallet specification or Red Bull facility loading procedure.",
  departure:
    "The completed shipment reaches an illustrative loading dock, where a plain white tractor-trailer is ready to leave. Cartons continue along the retained logistics route while the camera establishes the vehicle and its connection to dispatch. The tractor then accelerates onto an industrial access road; its wheels rotate with the distance travelled, and gentle steering follows the road. A rear three-quarter camera follows the departure before the closing message appears. This unbranded vehicle is a generic distribution example, not a Red Bull fleet or carrier claim. The loading arrangement, road, driving trajectory and presentation timing are artistic choices, with a static reduced-motion alternative.",
};
export const chapters: Chapter[] = baseChapters.map((c) => ({
  ...c,
  summary: c.explanation,
  explanation: expandedExplanations[c.id],
}));
export const TRANSITION_MS = 1200;
export interface StoryState {
  index: number;
  lockedUntil: number;
  revision: number;
}
export function navigate(
  state: StoryState,
  action: "next" | "previous" | "restart",
  now: number,
  reduced = false,
): StoryState {
  if (now < state.lockedUntil) return state;
  const index =
    action === "restart"
      ? 0
      : Math.max(
          0,
          Math.min(
            chapters.length - 1,
            state.index + (action === "next" ? 1 : -1),
          ),
        );
  if (index === state.index && action !== "restart") return state;
  return {
    index,
    lockedUntil: now + (reduced ? 180 : TRANSITION_MS),
    revision: state.revision + 1,
  };
}
export function eased(t: number) {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}
/** Historical Phase 2 timeline; retained for snapshot/test compatibility only. Not rendered in Phase 3. */
export function revealTimeline(time: number, reduced = false) {
  const t = reduced ? 16 : Math.max(0, time);
  return {
    travel: eased(t / 3),
    open: eased((t - 3) / 2.5),
    rise: eased((t - 5.5) / 3),
    hero: eased((t - 9) / 3),
    close: t >= 12,
  };
}
