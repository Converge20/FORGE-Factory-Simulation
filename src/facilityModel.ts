import * as T from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { createDemonstration } from "./machinery";
import { explorerStations } from "./facility";

// Each overview station is a batched snapshot of the very same builder used by Guided.
// Only selected machinery instantiates its articulated animation, keeping overview work bounded.
export function createFacility(label: T.Texture) {
  const root = new T.Group();
  const stations = new Map<number, T.Group>();
  const ownedTextures = new Set<T.Texture>();
  for (const s of explorerStations) {
    const demo = createDemonstration(s.chapter, label);
    demo.update(s.chapter === 13 ? 0 : 16, false);
    demo.root.updateMatrixWorld(true);
    const group = new T.Group();
    group.name = s.title;
    group.position.fromArray(s.position);
    if (s.chapter === 11 || s.chapter === 12) group.rotation.y = Math.PI;
    stations.set(s.chapter, group);
    root.add(group);
    const batches = new Map<
      string,
      { material: T.Material; geometry: T.BufferGeometry[] }
    >();
    demo.root.traverse((o) => {
      if (!(o instanceof T.Mesh) || !o.visible) return;
      let ancestor: T.Object3D | null = o;
      while (ancestor) {
        if (!ancestor.visible || ancestor.userData.processProduct) return;
        ancestor = ancestor.parent;
      }
      // The truck's road and dock are built into the common facility instead of duplicated per snapshot.
      if (s.chapter === 13) {
        let a: T.Object3D | null = o;
        while (a) {
          if (a.name === "Illustrative dock and access road") return;
          a = a.parent;
        }
      }
      const material = o.material as T.MeshStandardMaterial;
      const map = material.map;
      const key = [
        material.type,
        material.color?.getHexString(),
        material.metalness,
        material.roughness,
        material.opacity,
        material.transparent,
        material.side,
        material.emissive?.getHexString(),
        map === label ? "can-label" : map?.uuid,
      ].join(":");
      let batch = batches.get(key);
      if (!batch) {
        const clone = material.clone();
        if (map && map !== label) {
          clone.map = map.clone();
          clone.map.needsUpdate = true;
          ownedTextures.add(clone.map);
        }
        batch = { material: clone, geometry: [] };
        batches.set(key, batch);
      }
      const g = o.geometry.clone().applyMatrix4(o.matrixWorld);
      const geo = g.index ? g.toNonIndexed() : g;
      if (!map) geo.deleteAttribute("uv");
      else if (!geo.getAttribute("uv"))
        geo.setAttribute(
          "uv",
          new T.BufferAttribute(
            new Float32Array(geo.getAttribute("position").count * 2),
            2,
          ),
        );
      batch.geometry.push(geo);
    });
    for (const { material, geometry } of batches.values()) {
      const geo = mergeGeometries(geometry);
      if (geo) {
        const mesh = new T.Mesh(geo, material);
        mesh.castShadow = !material.transparent;
        mesh.receiveShadow = true;
        group.add(mesh);
      }
      geometry.forEach((g) => g.dispose());
    }
    demo.dispose();
  }
  const steel = new T.MeshStandardMaterial({
    color: "#7e929c",
    metalness: 0.8,
    roughness: 0.35,
  });
  const floor = new T.MeshStandardMaterial({
    color: "#34484d",
    metalness: 0.25,
    roughness: 0.8,
  });
  const dark = new T.MeshStandardMaterial({
    color: "#1b2b34",
    roughness: 0.85,
  });
  const copper = new T.MeshStandardMaterial({
    color: "#be9163",
    metalness: 0.6,
    roughness: 0.4,
  });
  const white = new T.MeshStandardMaterial({
    color: "#b3bfb4",
    roughness: 0.7,
  });
  const tarmac = new T.MeshStandardMaterial({
    color: "#15232b",
    roughness: 0.95,
  });
  const infra = new Map<T.Material, T.BufferGeometry[]>();
  function add(
    g: T.BufferGeometry,
    m: T.Material,
    x = 0,
    y = 0,
    z = 0,
    rx = 0,
  ) {
    g.applyMatrix4(
      new T.Matrix4().compose(
        new T.Vector3(x, y, z),
        new T.Quaternion().setFromEuler(new T.Euler(rx, 0, 0)),
        new T.Vector3(1, 1, 1),
      ),
    );
    const list = infra.get(m) ?? [];
    list.push(g.index ? g.toNonIndexed() : g);
    infra.set(m, list);
  }
  function box(
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    m: T.Material = steel,
  ) {
    add(new T.BoxGeometry(w, h, d), m, x, y, z);
  }
  function pipe(points: number[][], m: T.Material = steel, r = 0.065) {
    add(
      new T.TubeGeometry(
        new T.CatmullRomCurve3(points.map((p) => new T.Vector3(...p))),
        40,
        r,
        8,
        false,
      ),
      m,
    );
  }
  function conveyor(a: [number, number], b: [number, number]) {
    const dx = b[0] - a[0],
      dz = b[1] - a[1],
      len = Math.hypot(dx, dz),
      v = Math.abs(dz) > Math.abs(dx),
      x = (a[0] + b[0]) / 2,
      z = (a[1] + b[1]) / 2;
    box(x, 0.89, z, v ? 1 : len, 0.2, v ? len : 1, dark);
    for (const side of [-1, 1])
      box(
        x + (v ? side * 0.58 : 0),
        1.31,
        z + (v ? 0 : side * 0.58),
        v ? 0.04 : len,
        0.05,
        v ? len : 0.04,
      );
    for (let t = 0.1; t < len; t += 0.32) {
      const xx = a[0] + (dx * t) / len,
        zz = a[1] + (dz * t) / len;
      const g = new T.CylinderGeometry(0.055, 0.055, 1.02, 12);
      if (v) g.rotateZ(Math.PI / 2);
      else g.rotateX(Math.PI / 2);
      add(g, steel, xx, 1.03, zz);
    }
    for (let t = 0.3; t < len; t += 2.2) {
      const xx = a[0] + (dx * t) / len,
        zz = a[1] + (dz * t) / len;
      for (const side of [-1, 1])
        box(
          xx + (v ? side * 0.45 : 0),
          0.45,
          zz + (v ? 0 : side * 0.45),
          0.06,
          0.9,
          0.06,
        );
    }
  }
  box(0, -0.32, 2, 47, 0.6, 31, floor);
  box(0, -0.01, -13.4, 47, 0.04, 0.12, copper);
  box(0, 1, -13.5, 47, 2, 0.15, dark);
  for (let x = -22; x <= 22; x += 5.5) {
    box(x, 3.3, -13.5, 0.16, 6.6, 0.22, steel);
    box(x, 6.6, -13.5, 0.24, 0.14, 0.3, copper);
  }
  box(0, 6.5, -13.5, 46, 0.16, 0.18, steel);
  for (let x = -22; x <= 22; x += 4) box(x, 0.01, 1, 0.015, 0.015, 29, dark);
  for (let z = -12; z <= 15; z += 4) box(0, 0.012, z, 46, 0.015, 0.015, dark);
  const connections: [[number, number], [number, number]][] = [
    [
      [-13.5, 4],
      [-12.5, 4],
    ],
    [
      [-5.5, 4],
      [-3.5, 4],
    ],
    [
      [3.5, 4],
      [5.5, 4],
    ],
    [
      [8.5, 4],
      [10.5, 4],
    ],
    [
      [17.5, 4],
      [18.5, 4],
    ],
    [
      [18.5, 4],
      [18.5, 12],
    ],
    [
      [18.5, 12],
      [17.5, 12],
    ],
    [
      [10.5, 12],
      [9, 12],
    ],
    [
      [1, 12],
      [-15, 12],
    ],
    [
      [-15, 12],
      [-15, 19],
    ],
  ];
  connections.forEach(([a, b]) => conveyor(a, b));
  // Common ingredient header links the preparation row to blending, carbonation and filling.
  pipe(
    [
      [-16, 1, -6],
      [-16, 2.5, -3.4],
      [-9, 2.5, -3.4],
      [-2, 2.5, -3.4],
      [5, 2.5, -3.4],
      [12, 2.5, -3.4],
    ],
    copper,
    0.085,
  );
  // The shared facility pipes meet the actual sight-glass outlets of each reused module.
  const outlets = [
    { x: -16, end: [-12.85, 0.5, -5.5] },
    { x: -9, end: [-5.9, 0.65, -5.8] },
    { x: -2, end: [-2, 0.9, -5.6] },
    { x: 5, end: [7.3, 1.5, -5.7] },
    { x: 12, end: [14.3, 1.5, -5.7] },
  ];
  for (const { x, end } of outlets)
    pipe([end, [end[0], 2.5, -4.2], [x, 2.5, -3.4]], steel, 0.06);
  pipe(
    [
      [12, 2.5, -3.4],
      [15, 2.5, -3.4],
      [15, 3.8, -1],
      [-2.6, 3.9, -1],
      [-2.6, 3.9, 3.5],
    ],
    steel,
    0.09,
  );
  for (let x = -20; x < 21; x += 0.9) {
    box(x, 0.03, -0.5, 0.45, 0.014, 0.06, copper);
    box(x, 0.03, 8, 0.45, 0.014, 0.06, white);
  }
  // Dispatch dock sits against the factory edge, with the access road immediately beyond it.
  box(-17, 1.5, 19, 4, 3, 5, dark);
  box(-15.1, 1.7, 21, 0.08, 2.8, 3, steel);
  box(-15.1, 3.3, 21, 1.4, 0.12, 4, white);
  box(24, -0.12, 20, 105, 0.18, 8, tarmac);
  for (let x = -25; x < 76; x += 3) box(x, 0.006, 23, 1.4, 0.008, 0.055, white);
  for (const z of [16.1, 24]) box(24, 0.008, z, 105, 0.008, 0.04, white);
  // Low road barriers and bollards provide scale without enclosing or hiding the machinery.
  for (const x of [-21, -18, -15]) {
    box(x, 0.5, 16.5, 0.13, 1, 0.13, copper);
    box(x, 0.05, 16.5, 0.3, 0.08, 0.3, steel);
  }
  for (const [material, geos] of infra) {
    geos.forEach((g) => g.deleteAttribute("uv"));
    const geo = mergeGeometries(geos);
    if (geo) {
      const o = new T.Mesh(geo, material);
      o.castShadow = material !== floor && material !== tarmac;
      o.receiveShadow = true;
      root.add(o);
    }
    geos.forEach((g) => g.dispose());
  }
  const zones: [string, number, number, number][] = [
    ["CAN MANUFACTURING", -17, 0.2, 7],
    ["WASH & DECORATION", -9, 0.2, 7],
    ["WATER & INGREDIENTS", -10, -11.4, 16],
    ["BLENDING & PREPARATION", 9, -11.4, 12],
    ["FILLING & SEALING", 3, 0.2, 12],
    ["INSPECTION", 15, 0.2, 6],
    ["PACK & LOGISTICS", 9, 15.6, 14],
    ["DISPATCH", -11, 15.6, 9],
  ];
  for (const [text, x, z, width] of zones) {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 128;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#a9bbc1";
    ctx.textAlign = "center";
    ctx.font = "54px Arial";
    ctx.fillText(text, 512, 78);
    const tex = new T.CanvasTexture(c);
    tex.colorSpace = T.SRGBColorSpace;
    ownedTextures.add(tex);
    const m = new T.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });
    const mesh = new T.Mesh(new T.PlaneGeometry(width, width / 8), m);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, 0.025, z);
    root.add(mesh);
  }
  return {
    root,
    stations,
    dispose: () => {
      const geos = new Set<T.BufferGeometry>(),
        mats = new Set<T.Material>();
      root.traverse((o) => {
        if (o instanceof T.Mesh) {
          geos.add(o.geometry);
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) =>
            mats.add(m),
          );
        }
      });
      geos.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
      ownedTextures.forEach((t) => t.dispose());
    },
  };
}
