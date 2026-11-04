import * as T from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { makeCan, makeCarton } from "./product";
import { eased } from "./story";
import { createLogistics } from "./logistics";
import {
  BELT_TOP,
  fillingState,
  sealingState,
  packagingState,
  inspectionState,
  smooth,
  wrap,
} from "./productionMotion";

export function createDemonstration(index: number, label: T.Texture) {
  if (index === 13) return createLogistics();
  const root = new T.Group();
  const animated: T.Object3D[] = [];
  const mats = {
    steel: new T.MeshStandardMaterial({
      color: "#aabac7",
      metalness: 0.94,
      roughness: 0.24,
    }),
    dark: new T.MeshStandardMaterial({
      color: "#162732",
      metalness: 0.65,
      roughness: 0.4,
    }),
    paint: new T.MeshStandardMaterial({
      color: "#244450",
      metalness: 0.6,
      roughness: 0.3,
    }),
    copper: new T.MeshStandardMaterial({
      color: "#d6965d",
      metalness: 0.7,
      roughness: 0.28,
    }),
    black: new T.MeshStandardMaterial({ color: "#0a121a", roughness: 0.5 }),
    gold: new T.MeshStandardMaterial({
      color: "#c6a571",
      metalness: 0.6,
      roughness: 0.3,
    }),
    liquid: new T.MeshStandardMaterial({
      color: "#b6a064",
      metalness: 0.15,
      roughness: 0.15,
      transparent: true,
      opacity: 0.8,
    }),
    water: new T.MeshStandardMaterial({
      color: "#67b4c7",
      metalness: 0.3,
      roughness: 0.15,
      transparent: true,
      opacity: 0.65,
    }),
    glass: new T.MeshPhysicalMaterial({
      color: "#90bfd2",
      metalness: 0.12,
      roughness: 0.12,
      transparent: true,
      opacity: 0.19,
      side: T.DoubleSide,
      depthWrite: false,
    }),
    light: new T.MeshStandardMaterial({
      color: "#c2e9ee",
      emissive: "#7bd4ee",
      emissiveIntensity: 3,
    }),
    red: new T.MeshStandardMaterial({
      color: "#c93a42",
      metalness: 0.4,
      roughness: 0.35,
    }),
    paper: new T.MeshStandardMaterial({ color: "#ded9c7", roughness: 0.8 }),
  };
  type Mat = keyof typeof mats;
  function mesh(
    geo: T.BufferGeometry,
    mat: Mat,
    x = 0,
    y = 0,
    z = 0,
    parent: T.Object3D = root,
  ) {
    const o = new T.Mesh(geo, mats[mat]);
    o.position.set(x, y, z);
    o.castShadow = true;
    o.receiveShadow = true;
    parent.add(o);
    return o;
  }
  function box(
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    m: Mat = "steel",
    p: T.Object3D = root,
  ) {
    return mesh(
      new RoundedBoxGeometry(w, h, d, 1, Math.min(0.045, w / 8, h / 8, d / 8)),
      m,
      x,
      y,
      z,
      p,
    );
  }
  function cyl(
    x: number,
    y: number,
    z: number,
    r: number,
    h: number,
    m: Mat = "steel",
    p: T.Object3D = root,
    rTop = r,
  ) {
    return mesh(new T.CylinderGeometry(rTop, r, h, 48), m, x, y, z, p);
  }
  function ring(
    x: number,
    y: number,
    z: number,
    r: number,
    m: Mat = "steel",
    p: T.Object3D = root,
  ) {
    const o = mesh(new T.TorusGeometry(r, 0.035, 8, 64), m, x, y, z, p);
    o.rotation.x = Math.PI / 2;
    return o;
  }
  function pipe(
    points: number[][],
    m: Mat = "steel",
    r = 0.055,
    p: T.Object3D = root,
  ) {
    return mesh(
      new T.TubeGeometry(
        new T.CatmullRomCurve3(points.map((v) => new T.Vector3(...v))),
        28,
        r,
        10,
        false,
      ),
      m,
      0,
      0,
      0,
      p,
    );
  }
  function support(x: number, z: number, w: number, d: number, h = 0.65) {
    for (const a of [-1, 1])
      for (const b of [-1, 1]) {
        box(x + (a * w) / 2, h / 2, z + (b * d) / 2, 0.1, h, 0.1);
        cyl(x + (a * w) / 2, 0.08, z + (b * d) / 2, 0.16, 0.08, "black");
      }
  }
  function boltCircle(x: number, y: number, z: number, r: number, n = 12) {
    for (let i = 0; i < n; i++) {
      const a = (i * Math.PI * 2) / n;
      cyl(x + Math.cos(a) * r, y, z + Math.sin(a) * r, 0.027, 0.04, "dark");
    }
  }
  function dial(x: number, y: number, z: number) {
    const o = cyl(x, y, z, 0.16, 0.06, "black");
    o.rotation.x = Math.PI / 2;
    const face = cyl(x, y, z + 0.04, 0.135, 0.025, "paper");
    face.rotation.x = Math.PI / 2;
    box(x + 0.025, y + 0.025, z + 0.06, 0.015, 0.14, 0.015, "red").rotation.z =
      -0.6;
  }
  function panel(x: number, z: number) {
    box(x, 1.65, z, 0.65, 0.9, 0.2, "dark");
    box(x, 1.8, z + 0.11, 0.5, 0.38, 0.015, "black");
    for (let i = 0; i < 3; i++)
      box(
        x - 0.17,
        1.9 - i * 0.1,
        z + 0.125,
        0.3 - i * 0.05,
        0.02,
        0.01,
        "light",
      );
    cyl(x + 0.17, 1.42, z + 0.13, 0.04, 0.02, "red").rotation.x = Math.PI / 2;
    box(x, 0.75, z, 0.09, 0.9, 0.09);
  }
  function vessel(
    x: number,
    z: number,
    r = 0.83,
    h = 2.1,
    open = false,
    cutaway = false,
  ) {
    support(x, z, r * 1.2, r * 1.2, 0.6);
    if (cutaway) {
      const shell = mesh(
        new T.CylinderGeometry(
          r,
          r,
          h,
          48,
          1,
          true,
          Math.PI * 0.65,
          Math.PI * 1.5,
        ),
        "steel",
        x,
        h / 2 + 0.8,
        z,
      );
      const material = mats.steel.clone();
      material.side = T.DoubleSide;
      shell.material = material;
    } else cyl(x, h / 2 + 0.8, z, r, h, "steel");
    cyl(x, 0.65, z, r, 0.32, "steel", root, r * 0.4);
    ring(x, 0.8, z, r);
    ring(x, h + 0.8, z, r);
    if (!open) {
      cyl(x, h + 0.95, z, r, 0.3, "steel", root, 0.3);
      cyl(x, h + 1.24, z, 0.18, 0.26, "paint");
    }
    pipe(
      [
        [x, 0.65, z],
        [x, 0.35, z + 0.4],
        [x, 0.35, z + 1.2],
      ],
      "steel",
      0.07,
    );
    dial(x, 1.8, z + r + 0.03);
  }
  function belt(x: number, z: number, len = 7) {
    box(x, 0.85, z, len, 0.3, 1.2, "dark");
    for (let i = 0; i < len / 0.24; i++) {
      const roller = cyl(x - len / 2 + 0.13 + i * 0.24, 1.025, z, 0.065, 1.08);
      roller.rotation.x = Math.PI / 2;
    }
    for (const a of [-1, 1]) {
      if (index === 10 && a === 1) {
        // The reject gate has an actual opening in the side rail.
        box(-1.55, 1.25, z + 0.64, 4.1, 0.045, 0.04);
        box(3.0, 1.25, z + 0.64, 1, 0.045, 0.04);
      } else box(x, 1.25, z + a * 0.64, len, 0.045, 0.04);
      support(x + a * len * 0.32, z, 0.1, 0.95, 0.8);
    }
  }
  function canAt(
    x: number,
    y: number,
    z: number,
    scale = 0.43,
    branded = true,
    open = false,
  ) {
    const c = makeCan(label, branded, open);
    c.name = "Conveyor can";
    c.userData.processProduct = true;
    c.position.set(x, y, z);
    c.scale.setScalar(scale);
    root.add(c);
    animated.push(c);
    return c;
  }
  function sign(text: string, x: number, y: number, z: number, w = 0.68) {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 128;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#10212c";
    ctx.fillRect(0, 0, 512, 128);
    ctx.fillStyle = "#b9d3df";
    ctx.textAlign = "center";
    ctx.font = "bold 33px Arial";
    ctx.fillText(text, 256, 78);
    const tex = new T.CanvasTexture(c);
    tex.colorSpace = T.SRGBColorSpace;
    const m = new T.MeshStandardMaterial({ map: tex, roughness: 0.5 });
    const o = new T.Mesh(new T.PlaneGeometry(w, w / 4), m);
    o.position.set(x, y, z);
    root.add(o);
  }
  const updates: ((t: number) => void)[] = [];
  // Guarded returns conceal finite demonstration loops. Products never wrap in the open work area.
  function guard(x: number, z = 0, width = 1.5, height = 2.32) {
    box(x, height, z, width, 0.12, 1.3, "paint");
    box(x, 1.7, z - 0.65, width, 1.24, 0.06, "paint");
    box(x, 1.7, z + 0.65, width, 1.24, 0.06, "paint");
  }
  function guardedBelt() {
    belt(0, 0, 7);
    guard(-3.25, 0, 0.7);
    guard(3.25, 0, 0.7);
  }
  function product(group: T.Object3D, name: string) {
    group.name = name;
    group.userData.processProduct = true;
    animated.push(group);
    return group;
  }
  function transfer(
    points: number[][],
    kind: "water" | "liquid" = "liquid",
    speed = 0.16,
  ) {
    const curve = new T.CatmullRomCurve3(
      points.map((v) => new T.Vector3(...v)),
    );
    pipe(points, "glass", 0.085);
    const beads = new T.InstancedMesh(
      new T.SphereGeometry(0.042, 8, 6),
      mats[kind],
      8,
    );
    root.add(beads);
    animated.push(beads);
    product(beads, "Flow inside transfer sight glass");
    const m = new T.Matrix4();
    updates.push((t) => {
      for (let i = 0; i < 8; i++) {
        const v = curve.getPointAt(wrap(t * speed + i / 8, 1));
        m.makeTranslation(v.x, v.y, v.z);
        beads.setMatrixAt(i, m);
      }
      beads.instanceMatrix.needsUpdate = true;
    });
  }
  function cutawayCan() {
    const c = new T.Group();
    root.add(c);
    product(c, "Moving open cutaway can");
    const body = mesh(
      new T.CylinderGeometry(
        0.29,
        0.29,
        1.04,
        40,
        1,
        true,
        Math.PI * 0.65,
        Math.PI * 1.45,
      ),
      "steel",
      0,
      0.55,
      0,
      c,
    );
    // A sectioned rear shell leaves the front and rising liquid visible.
    const interiorMaterial = mats.steel.clone();
    interiorMaterial.side = T.DoubleSide;
    body.material = interiorMaterial;
    cyl(0, 0.025, 0, 0.29, 0.04, "steel", c);
    ring(0, 1.075, 0, 0.29, "steel", c);
    const fill = cyl(0, 0.045, 0, 0.267, 0.94, "liquid", c);
    animated.push(fill);
    const surface = ring(0, 0.05, 0, 0.26, "gold", c);
    animated.push(surface);
    c.position.y = BELT_TOP;
    return { root: c, fill, surface };
  }
  // Both modes use this exact machinery and these exact update callbacks.
  if (index === 1) {
    box(0, 0.25, 0, 5, 0.4, 3, "dark");
    support(0, 0, 4.5, 2.4, 0.3);
    box(0.45, 0.65, 0, 3.6, 0.45, 2, "paint");
    for (const x of [-1, 1.8])
      for (const z of [-0.8, 0.8]) cyl(x, 2, z, 0.1, 2.7);
    box(0.4, 3.35, 0, 3.4, 0.5, 2, "paint");
    boltCircle(0.4, 3.62, 0, 0.65);
    const ram = new T.Group();
    animated.push(ram);
    root.add(ram);
    box(0.4, 2.45, 0, 2.7, 0.28, 1.6, "steel", ram);
    cyl(0.4, 2.95, 0, 0.22, 0.9, "steel", ram);
    cyl(0.4, 2.1, 0, 0.29, 0.55, "steel", ram);
    for (const r of [0.34, 0.47, 0.61]) ring(0.4, 1.18, 0, r, "dark");
    cyl(0.4, 0.98, 0, 0.65, 0.25, "steel");
    const workpiece = mesh(
      new T.CylinderGeometry(0.17, 0.17, 0.12, 40, 1, true),
      "steel",
      0.4,
      1.15,
      0,
    );
    workpiece.material.side = T.DoubleSide;

    product(workpiece, "Workpiece being formed");
    const coil = cyl(-2.6, 1.25, 0, 0.8, 0.9);
    coil.rotation.x = Math.PI / 2;
    for (let r = 0.22; r < 0.8; r += 0.05) {
      const o = ring(-2.6, 1.25, 0.47, r, "dark");
      o.rotation.x = 0;
    }
    const feed = box(-1.8, 1.2, 0, 1.5, 0.025, 0.8);
    const marks = new T.Group();
    root.add(marks);
    animated.push(marks);
    for (let i = 0; i < 6; i++)
      box(-2.45 + i * 0.24, 1.218, 0, 0.014, 0.004, 0.7, "dark", marks);
    belt(2.9, 0, 3.2);
    guard(4.25);
    const formed = canAt(1.8, BELT_TOP, 0, 0.43, false, true);
    updates.push((t) => {
      const p = wrap(t, 4) / 4;
      const release = smooth((p - 0.75) / 0.24);
      formed.position.x = 1.8 + release * 3;
      formed.visible = p >= 0.75;
      marks.position.x = wrap(t * 0.14, 0.24);

      feed.userData.feeding = true;
    });
    panel(2.65, 0.5);
    updates.push((t) => {
      const p = (t % 4) / 4;
      ram.position.y = -0.85 * Math.pow(Math.sin(p * Math.PI), 4);
      workpiece.scale.y = 1 + eased((p - 0.2) / 0.35) * 6;
      workpiece.position.x = 0.4 + eased((p - 0.55) / 0.2) * 1.4;
      workpiece.visible = p < 0.75;
      workpiece.position.y = 1.15 + (workpiece.scale.y - 1) * 0.06;
    });
  } else if (index === 2) {
    belt(0, 0, 7);
    box(-1.9, 1.7, -0.8, 1.6, 1.3, 0.12, "paint");
    box(-1.9, 2.45, 0, 1.8, 0.18, 2, "steel");
    for (let i = 0; i < 5; i++) {
      pipe(
        [
          [-2.45 + i * 0.25, 2.2, -0.7],
          [-2.45 + i * 0.25, 2.2, 0],
        ],
        "steel",
        0.025,
      );
      const spray = cyl(-2.45 + i * 0.25, 1.6, 0, 0.025, 0.7, "water");
      product(spray, "Rinse water inside washing chamber");
      updates.push((t) => (spray.scale.y = 0.7 + Math.sin(t * 8 + i) * 0.3));
    }
    for (const z of [-0.8, 0.8]) box(0.6, 1.85, z, 2, 0.12, 0.1);
    for (const x of [0.25, 0.95])
      for (const z of [-0.5, 0.5]) {
        const roller = cyl(x, 1.55, z, 0.3, 0.9, z > 0 ? "copper" : "paint");
        animated.push(roller);
        updates.push((t) => (roller.rotation.y = t * (z > 0 ? -2 : 2)));
      }
    // Contact rollers perform the illustrative decoration change.
    guard(-3.25, 0, 0.7);
    guard(3.25, 0, 0.7);
    for (let i = 0; i < 7; i++) {
      const bare = canAt(0, BELT_TOP, 0, 0.43, false, true);
      const printed = canAt(0, BELT_TOP, 0, 0.43, true, true);
      updates.push((t) => {
        const x = wrap(t * 0.65 + i, 7) - 3.5;
        bare.position.x = printed.position.x = x;
        bare.visible = x < 0.8;
        printed.visible = x >= 0.8;
      });
    }
    panel(2.6, -1.2);
  } else if (index === 3) {
    box(0, 0.2, 0, 5.6, 0.25, 3, "dark");
    for (let i = 0; i < 4; i++) {
      const x = -1.7 + i * 0.9;
      cyl(x, 1.6, -0.3, 0.3, 2.6);
      ring(x, 0.4, -0.3, 0.31);
      ring(x, 2.85, -0.3, 0.31);
      pipe(
        [
          [x, 3, -0.3],
          [x, 3.3, -0.3],
          [1.8, 3.3, -0.3],
          [1.8, 2.5, 0.8],
        ],
        "steel",
        0.06,
      );
      dial(x, 1.8, 0.04);
    }
    cyl(1.9, 1.4, 0.5, 0.6, 2.3, "glass");
    ring(1.9, 0.3, 0.5, 0.6);
    ring(1.9, 2.55, 0.5, 0.6);

    transfer(
      [
        [-2.5, 0.5, 0],
        [-2.5, 0.5, 1],
        [1.9, 0.5, 1],
        [1.9, 0.65, 0.5],
      ],
      "water",
      0.13,
    );
    transfer(
      [
        [1.9, 0.5, 0.5],
        [2.6, 0.5, 0.5],
        [2.6, 0.5, 1.5],
        [3.15, 0.5, 1.5],
      ],
      "water",
    );
    const waterLevel = cyl(1.9, 1.3, 0.5, 0.57, 1.7, "water");
    animated.push(waterLevel);
    updates.push((t) => (waterLevel.scale.y = 1 + Math.sin(t * 0.45) * 0.018));
    panel(-2.7, 1);
    sign("WATER", 1.9, 1.8, 1.11, 0.8);
  } else if (index === 4) {
    vessel(0.8, 0, 1, 2.1, false, true);
    const sight = mesh(
      new T.CylinderGeometry(
        0.92,
        0.92,
        1.15,
        32,
        1,
        false,
        Math.PI * 0.9,
        Math.PI * 0.32,
      ),
      "liquid",
      0.8,
      1.35,
      0,
    );
    sight.name = "Sugar solution sight section";
    const hopper = cyl(-1.6, 3.1, 0, 0.12, 1.05, "steel", root, 0.75);
    hopper.material = mats.steel;
    cyl(-1.6, 3.68, 0, 0.75, 0.1, "steel");
    for (const z of [-0.5, 0.5]) box(-1.6, 1.8, z, 0.08, 2.2, 0.08);
    pipe(
      [
        [-1.6, 2.55, 0],
        [-1.6, 1.5, 0],
        [0.8, 1.5, 0],
      ],
      "glass",
      0.13,
    );
    pipe(
      [
        [-1.6, 2.55, 0],
        [-1.6, 1.5, 0],
      ],
      "glass",
      0.15,
    );
    const chute = box(-0.4, 1.5, 0, 1.8, 0.36, 0.4, "glass");
    chute.renderOrder = 2;
    for (let i = 0; i < 16; i++) {
      const crystal = box(0, 0, 0, 0.045, 0.045, 0.045, "paper");
      product(crystal, "Sugar in feed chute");
      updates.push((t) => {
        const p = wrap(t * 0.28 + i / 16, 1);
        crystal.position.set(
          p < 0.3 ? -1.6 : -1.6 + ((p - 0.3) / 0.7) * 2.4,
          p < 0.3 ? 2.55 - (p / 0.3) * 1.05 : 1.5,
          Math.sin(i * 12) * 0.1,
        );
        crystal.rotation.set(t + i, t * 0.5, 0);
      });
    }
    transfer([
      [0.8, 0.65, 0],
      [0.8, 0.35, 1.2],
      [2.5, 0.35, 1.2],
      [3.1, 0.65, 1.2],
    ]);
    const shaft = new T.Group();
    shaft.position.set(0.8, 0, 0);
    root.add(shaft);
    animated.push(shaft);
    cyl(0, 1.45, 0, 0.045, 1.7, "steel", shaft);
    box(0, 1.05, 0, 0.95, 0.07, 0.14, "steel", shaft);
    updates.push((t) => (shaft.rotation.y = t * 0.9));
    panel(2.5, 1.1);
    sign("SUGAR", -1.6, 3.2, 0.72, 0.85);
  } else if (index === 5) {
    box(0, 0.45, 0, 5, 0.2, 2.6, "dark");
    support(0, 0, 4.6, 2.2, 0.4);
    for (let i = 0; i < 3; i++) {
      const x = -1.65 + i * 1.65;
      vessel(x, -0.25, 0.46, 1.25);
      cyl(x, 2.65, -0.25, 0.16, 0.4, "copper");
      pipe(
        [
          [x, 0.65, -0.25],
          [x, 0.45, 0.9],
          [0, 0.45, 0.9],
          [0, 0.9, 1.4],
        ],
        "glass",
        0.045,
      );
      transfer(
        [
          [x, 0.65, -0.25],
          [x, 0.45, 0.9],
          [0, 0.45, 0.9],
          [0, 0.9, 1.4],
        ],
        "liquid",
        0.09 + i * 0.015,
      );
      ring(x, 1.1, 0.3, 0.14, "copper").rotation.x = 0;
      dial(x, 1.4, 0.25);
      sign(["CAFFEINE", "TAURINE", "B VITAMINS"][i], x, 1.8, 0.24, 0.7);
    }
    const valve = cyl(0, 0.75, 1.4, 0.14, 0.22, "copper");
    animated.push(valve);
    updates.push((t) => (valve.rotation.y = t * 0.6));
    panel(2.8, 1.3);
  } else if (index === 6 || index === 7) {
    // Sectioned vessel keeps the impeller and liquid visible rather than hiding them inside an opaque shell.
    support(0, 0, 1.8, 1.8, 0.6);
    const shell = mesh(
      new T.CylinderGeometry(
        1.18,
        1.18,
        2.5,
        64,
        1,
        true,
        Math.PI * 0.65,
        Math.PI * 1.5,
      ),
      "steel",
      0,
      1.9,
      0,
    );
    shell.material.side = T.DoubleSide;
    cyl(0, 0.62, 0, 1.18, 0.18);
    ring(0, 3.15, 0, 1.18);
    boltCircle(0, 3.2, 0, 1.12, 20);
    cyl(0, 3.4, 0, 0.22, 0.5, "paint");
    cyl(0, 1.9, 0, 0.065, 2.6);
    const liquid = cyl(
      0,
      1.35,
      0,
      1.08,
      1.25,
      index === 7 ? "water" : "liquid",
    );
    liquid.material.side = T.DoubleSide;
    const impeller = new T.Group();
    impeller.position.y = 1.8;
    root.add(impeller);
    animated.push(impeller);
    for (let i = 0; i < 4; i++)
      box(
        Math.cos((i * Math.PI) / 2) * 0.45,
        0,
        Math.sin((i * Math.PI) / 2) * 0.45,
        0.7,
        0.08,
        0.2,
        "steel",
        impeller,
      ).rotation.y = (-i * Math.PI) / 2;
    for (let i = 0; i < 3; i++)
      pipe(
        [
          [-2.4 + i * 0.4, 2.9, -0.6],
          [-1.5, 2.9, -0.6],
          [-1, 2.7, -0.6],
        ],
        i ? "steel" : "copper",
        0.06,
      );
    pipe(
      [
        [0, 0.5, 0],
        [0, 0.3, 1.3],
        [2.3, 0.3, 1.3],
        [2.3, 1.5, 1.3],
      ],
      "glass",
      0.09,
    );
    transfer(
      [
        [0, 0.5, 0],
        [0, 0.3, 1.3],
        [2.3, 0.3, 1.3],
        [2.3, 1.5, 1.3],
      ],
      index === 7 ? "water" : "liquid",
    );
    if (index === 6) {
      const circulation = new T.InstancedMesh(
        new T.SphereGeometry(0.035, 8, 6),
        mats.gold,
        12,
      );
      root.add(circulation);
      product(circulation, "Liquid circulation in tank");
      const m = new T.Matrix4();
      updates.push((t) => {
        for (let i = 0; i < 12; i++) {
          const a = t * 0.8 + (i * Math.PI) / 6;
          m.makeTranslation(
            Math.cos(a) * 0.77,
            1.25 + Math.sin(a * 2) * 0.28,
            Math.sin(a) * 0.77,
          );
          circulation.setMatrixAt(i, m);
        }
        circulation.instanceMatrix.needsUpdate = true;
      });
    }
    panel(2.4, 0);
    if (index === 7) {
      for (let i = 0; i < 36; i++) {
        const b = mesh(
          new T.SphereGeometry(0.025 + (i % 3) * 0.009, 8, 6),
          "water",
        );
        product(b, "Gas in beverage cutaway");
        updates.push((t) => {
          b.position.set(
            Math.sin(i * 5) * 0.8,
            0.8 + wrap(t * 0.28 + i * 0.035, 1.08),
            Math.cos(i * 7) * 0.75,
          );
        });
      }
      cyl(-2, 1.1, 0, 0.35, 1.7, "dark");
      ring(-2, 1.8, 0, 0.35, "copper");
      transfer(
        [
          [-2, 1.95, 0],
          [-1.5, 1.9, 0],
          [-1.4, 0.85, 0],
          [0, 0.85, 0],
        ],
        "water",
        0.1,
      );
    }
    updates.push((t) => {
      impeller.rotation.y = t * (index === 6 ? 1.5 : 0.3);
      liquid.position.y = 1.35 + Math.sin(t) * 0.015;
    });
  } else if (index === 8) {
    guardedBelt();
    for (const x of [-2.1, 2.1])
      for (const z of [-0.72, 0.72]) box(x, 2, z, 0.1, 2.4, 0.1);
    box(0, 3.1, 0, 4.6, 0.3, 1.7, "paint");
    cyl(0, 3.4, 0, 0.6, 0.35);
    pipe(
      [
        [0, 3.55, 0],
        [0, 3.9, -0.5],
        [-2.6, 3.9, -0.5],
      ],
      "steel",
      0.13,
    );
    for (let lane = 0; lane < 7; lane++) {
      const c = cutawayCan();
      c.root.userData.lane = lane;
      updates.push((t) => {
        const state = fillingState(t, lane);
        c.root.position.x = state.x;
        const height = Math.max(0.008, 0.94 * state.fill);
        c.fill.scale.y = height / 0.94;
        c.fill.position.y = 0.05 + height / 2;
        c.surface.position.y = 0.05 + height;
        c.fill.visible = c.surface.visible = state.fill > 0.001;
        c.root.userData.fill = state.fill;
      });
    }
    for (const x of [-1, 0, 1]) {
      const valve = cyl(x, 2.63, 0, 0.09, 0.62);
      animated.push(valve);
      const tip = cyl(x, 2.3, 0, 0.04, 0.16);
      animated.push(tip);
      const stream = cyl(x, 2.15, 0, 0.018, 0.5, "liquid");
      product(stream, "Dispensed beverage stream");
      updates.push((t) => {
        const state = fillingState(t, 0);
        const fill = smooth((state.phase - 1.9) / 2.6);
        valve.position.y = 2.63 - 0.13 * state.valve;
        tip.position.y = 2.3 - 0.13 * state.valve;
        const low = BELT_TOP + 0.05 + 0.94 * fill,
          high = 2.22 - 0.13 * state.valve;
        stream.visible = state.filling;
        stream.scale.y = Math.max(0.001, high - low) / 0.5;
        stream.position.y = (high + low) / 2;
      });
    }
    updates.push((t) => {
      root.userData.filling = {
        phase: wrap(t, 6),
        cans: Array.from({ length: 7 }, (_, i) => fillingState(t, i)),
        nozzles: [-1, 0, 1],
      };
    });
    panel(2.9, 1.3);
  } else if (index === 9) {
    guardedBelt();
    for (const x of [-1.4, 1.4])
      for (const z of [-0.75, 0.75]) cyl(x, 2, z, 0.08, 2.7);
    box(0, 3.4, 0, 3.2, 0.28, 1.7, "paint");
    for (let lane = 0; lane < 7; lane++) {
      const c = canAt(0, BELT_TOP, 0, 0.43, true, true);
      cyl(0, 1.89, 0, 0.337, 0.035, "liquid", c);
      const end = cyl(0, 2.5, 0, 0.151, 0.016);
      product(end, "End carried with moving can");
      updates.push((t) => {
        const state = sealingState(t, lane);
        c.position.x = end.position.x = state.x;
        const onHead = Math.abs(state.x) < 0.02 && state.phase >= 1.1;
        end.position.y = state.sealed
          ? BELT_TOP + 0.87
          : 2.7 - 0.74 * state.endDrop;
        end.visible = state.sealed || onHead;
        c.rotation.y = state.engagement && onHead ? t * 5 : Math.PI;
      });
    }
    const tooling = new T.Group();
    tooling.position.set(0, 2.75, 0);
    root.add(tooling);
    animated.push(tooling);
    cyl(0, 0.28, 0, 0.13, 0.55, "steel", tooling);
    for (let i = 0; i < 3; i++) {
      const a = (i * Math.PI * 2) / 3;
      cyl(
        Math.cos(a) * 0.24,
        0,
        Math.sin(a) * 0.24,
        0.08,
        0.13,
        "copper",
        tooling,
      );
    }
    updates.push((t) => {
      const state = sealingState(t, 0);
      tooling.position.y = 2.75 - 0.72 * state.engagement;
      tooling.rotation.y = t * 5 * state.engagement;
    });
    for (let i = 0; i < 12; i++) cyl(-1, 2.6 + i * 0.025, -0.3, 0.15, 0.015);
    panel(2, 1.1);
  } else if (index === 10) {
    guardedBelt();
    for (const x of [-0.85, 0.85]) box(x, 2, 0, 0.14, 2.2, 1.9, "paint");
    box(0, 3.12, 0, 1.85, 0.2, 1.9);
    box(0, 2.85, 0, 0.6, 0.2, 0.7, "dark");
    for (const z of [-0.7, 0.7]) box(0, 2.3, z, 1.55, 0.03, 0.06, "light");
    // Fixed inspection beam: the product passes through the sensor.
    box(0, 1.9, 0, 0.025, 1.5, 1.1, "water");
    box(2.6, 0.94, 1.05, 3.8, 0.26, 2.7, "dark");
    for (let x = 0.85; x < 3.6; x += 0.24) {
      const r = cyl(x, 1.025, 1.6, 0.065, 2.0);
      r.rotation.x = Math.PI / 2;
    }
    for (const z of [2.6]) box(2.8, 1.3, z, 3.2, 0.04, 0.04);
    guard(3.25, 2, 0.7);
    const rejector = box(0.9, 1.45, -0.7, 0.3, 0.18, 0.25, "copper");
    animated.push(rejector);
    let rejectActive = false;
    for (let lane = 0; lane < 5; lane++) {
      const c = canAt(0, BELT_TOP, 0, 0.43);
      updates.push((t) => {
        const state = inspectionState(t, lane);
        c.position.set(state.x, BELT_TOP, state.z);
        c.userData.rejected = state.rejected;
        if (lane === 3) rejectActive = state.rejecting;
      });
    }
    updates.push(
      () => (rejector.position.z = -0.7 + (rejectActive ? 0.45 : 0)),
    );
    panel(2.5, -1.4);
  } else if (index === 11) {
    belt(0, 0, 10);
    guard(-4.35);
    guard(4.35);
    // A small incoming group is carried by the actual gantry, lowered into the carton, then leaves inside it.
    // Empty cartons enter on a supported perpendicular feed, hidden at the finite loop boundary.
    box(1.55, 0.85, -2.1, 1.6, 0.3, 4.2, "dark");
    for (let z = -4.2; z < 0; z += 0.24) {
      const roller = cyl(1.55, 1.025, z, 0.065, 1.5);
      roller.rotation.z = Math.PI / 2;
    }
    box(1.55, 2.32, -3.9, 1.8, 0.12, 1.5, "paint");
    for (const x of [0.65, 2.45]) box(x, 1.7, -3.9, 0.06, 1.24, 1.5, "paint");
    const carton = makeCarton();
    carton.root.scale.setScalar(0.55);
    root.add(carton.root);
    product(carton.root, "Moving packaging carton");
    for (const x of [-2, 2])
      for (const z of [-1.25, 1.25]) box(x, 2.15, z, 0.13, 3.6, 0.13, "paint");
    box(0, 3.9, 0, 4.5, 0.2, 2.8, "paint");
    const gantry = new T.Group();
    root.add(gantry);
    animated.push(gantry);
    box(0, 0, 0, 1.12, 0.1, 0.85, "dark", gantry);
    cyl(0, 0.5, 0, 0.08, 1, "steel", gantry);
    for (const x of [-0.4, 0.4])
      for (const z of [-0.2, 0.2])
        cyl(x, -0.04, z, 0.045, 0.1, "black", gantry);
    const pack = new T.Group();
    root.add(pack);
    product(pack, "Grouped cans carried into carton");
    for (let i = 0; i < 6; i++) {
      const c = makeCan(label);
      c.scale.setScalar(0.27);
      c.position.set(((i % 3) - 1) * 0.28, 0, (Math.floor(i / 3) - 0.5) * 0.3);
      pack.add(c);
    }
    updates.push((t) => {
      const state = packagingState(t);
      pack.position.set(state.packX, state.packY, 0);
      gantry.position.set(state.toolX, state.toolY, 0);
      carton.root.position.set(state.cartonX, BELT_TOP, state.cartonZ);
      carton.open(state.open);
      root.userData.packaging = state;
    });
    panel(2.8, -1.5);
  } else if (index === 12) {
    guardedBelt();
    for (let i = 0; i < 4; i++) {
      const c = makeCarton();
      c.open(0);
      c.root.scale.setScalar(0.5);
      root.add(c.root);
      product(c.root, "Dispatch carton on conveyor");
      updates.push((t) =>
        c.root.position.set(wrap(t * 0.5 + i * 1.75, 7) - 3.5, BELT_TOP, 0),
      );
    }
    // Existing rail context remains an illustrative background dispatch vehicle.
    box(0, 0.1, -3, 9, 0.12, 1.8, "dark");
    for (const z of [-3.5, -2.5]) box(0, 0.18, z, 12, 0.07, 0.1);
    for (let x = -5; x <= 5; x += 0.5)
      box(x, 0.09, -3, 0.15, 0.08, 1.6, "gold");
    box(0.7, 0.9, -3, 7, 0.8, 1.5, "paint");
    box(0.7, 2, -3, 7, 1.5, 1.5, "dark");
    for (let x = -2.3; x < 4; x += 0.7) box(x, 2, -2.23, 0.03, 1.5, 0.04);
    for (const x of [-1.8, 3.2]) {
      const wheel = cyl(x, 0.45, -2.25, 0.35, 0.15, "black");
      wheel.rotation.x = Math.PI / 2;
    }
  }
  // Collapse static submeshes into material batches. Preserve articulated parts separately.
  const dynamic = new Set(animated);
  const byMat = new Map<T.Material, T.BufferGeometry[]>();
  const remove: T.Object3D[] = [];
  root.updateMatrixWorld(true);
  root.traverse((o) => {
    if (!(o instanceof T.Mesh)) return;
    let p: T.Object3D | null = o;
    while (p && p !== root) {
      if (dynamic.has(p)) return;
      p = p.parent;
    }
    if (Array.isArray(o.material) || o.material.transparent || o.material.map)
      return;
    const g = o.geometry.clone();
    g.applyMatrix4(o.matrixWorld);
    const geo = g.index ? g.toNonIndexed() : g;
    geo.deleteAttribute("uv");
    const list = byMat.get(o.material) ?? [];
    list.push(geo);
    byMat.set(o.material, list);
    remove.push(o);
  });
  remove.forEach((o) => {
    o.removeFromParent();
    if (o instanceof T.Mesh) o.geometry.dispose();
  });
  for (const [material, geos] of byMat) {
    const geo = mergeGeometries(geos);
    if (geo) {
      const m = new T.Mesh(geo, material);
      m.castShadow = true;
      m.receiveShadow = true;
      root.add(m);
    }
    geos.forEach((g) => g.dispose());
  }
  return {
    root,
    update: (t: number, reduced = false) =>
      updates.forEach((fn) => fn(reduced ? 16 : t)),
    dispose: () => {
      const gs = new Set<T.BufferGeometry>(),
        ms = new Set<T.Material>();
      root.traverse((o) => {
        if (o instanceof T.Mesh) {
          gs.add(o.geometry);
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) =>
            ms.add(m),
          );
        }
      });
      gs.forEach((g) => g.dispose());
      ms.forEach((m) => {
        if (m instanceof T.MeshStandardMaterial && m.map && m.map !== label)
          m.map.dispose();
        m.dispose();
      });
      Object.values(mats).forEach((m) => m.dispose());
    },
  };
}
