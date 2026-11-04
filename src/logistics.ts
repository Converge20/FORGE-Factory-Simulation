import * as T from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { departureState } from "./truckMotion";

/** Original generic tractor-trailer. No lettering, maps, graphics or brand assets. */
export function createLogistics() {
  const root = new T.Group();
  root.name = "Generic loading dock and white semi-truck";
  const white = new T.MeshPhysicalMaterial({
    color: "#edf0f2",
    metalness: 0.3,
    roughness: 0.27,
    clearcoat: 0.6,
  });
  const steel = new T.MeshStandardMaterial({
    color: "#687d8d",
    metalness: 0.85,
    roughness: 0.3,
  });
  const dark = new T.MeshStandardMaterial({
    color: "#15212c",
    metalness: 0.45,
    roughness: 0.4,
  });
  const rubber = new T.MeshStandardMaterial({
    color: "#13171c",
    roughness: 0.9,
  });
  const glass = new T.MeshStandardMaterial({
    color: "#24414f",
    metalness: 0.65,
    roughness: 0.15,
  });
  const red = new T.MeshStandardMaterial({
    color: "#a82825",
    emissive: "#6e120b",
    emissiveIntensity: 0.7,
  });
  const light = new T.MeshStandardMaterial({
    color: "#f3e9cf",
    emissive: "#f3e9cf",
    emissiveIntensity: 1.5,
  });
  const concrete = new T.MeshStandardMaterial({
    color: "#35434c",
    roughness: 0.9,
  });
  const roadMat = new T.MeshStandardMaterial({
    color: "#152029",
    roughness: 0.92,
  });
  const paint = new T.MeshStandardMaterial({
    color: "#b6b7aa",
    roughness: 0.8,
  });
  const brown = new T.MeshStandardMaterial({
    color: "#a38c69",
    roughness: 0.9,
  });
  function box(
    p: T.Object3D,
    x: number,
    y: number,
    z: number,
    w: number,
    h: number,
    d: number,
    m: T.Material = white,
    r = 0.04,
  ) {
    const o = new T.Mesh(
      new RoundedBoxGeometry(w, h, d, 1, Math.min(r, w / 5, h / 5, d / 5)),
      m,
    );
    o.position.set(x, y, z);
    o.castShadow = true;
    o.receiveShadow = true;
    p.add(o);
    return o;
  }
  function cylinder(
    p: T.Object3D,
    x: number,
    y: number,
    z: number,
    r: number,
    h: number,
    m: T.Material,
  ) {
    const o = new T.Mesh(new T.CylinderGeometry(r, r, h, 24), m);
    o.position.set(x, y, z);
    o.castShadow = true;
    p.add(o);
    return o;
  }
  const truck = new T.Group();
  truck.name = "Plain white unbranded tractor-trailer";
  root.add(truck);
  const tractor = new T.Group();
  tractor.name = "White tractor";
  truck.add(tractor);
  box(tractor, 2.5, 0.88, 0, 8.1, 0.23, 1.6, dark);
  box(tractor, 2.6, 1.26, 0, 2.3, 0.32, 1.95, steel);
  box(tractor, 3.9, 2.05, 0, 3.2, 2.45, 2.25, white, 0.16);
  box(tractor, 2.6, 2.8, 0, 1.7, 1.65, 2.2, white, 0.12);
  box(tractor, 4.6, 3.02, 0, 1.8, 0.38, 2.2, white, 0.12);
  box(tractor, 5.5, 1.72, 0, 2.1, 1.15, 2.03, white, 0.12);
  // Front (+X) and side glazing, separate from the white bodywork.
  box(tractor, 5.53, 2.75, 0, 0.025, 0.75, 1.95, glass, 0.01).rotation.z =
    -0.18;
  for (const side of [-1, 1]) {
    box(tractor, 4.72, 2.77, side * 1.14, 1.15, 0.76, 0.025, glass, 0.03);
    box(tractor, 3.27, 2.5, side * 1.15, 0.68, 0.8, 0.025, glass, 0.035);
    box(tractor, 4.52, 1.75, side * 1.14, 1.7, 0.82, 0.035, white, 0.02);
    box(tractor, 4.05, 2.1, side * 1.18, 0.26, 0.045, 0.035, steel, 0.01);
    box(tractor, 4.15, 0.95, side * 1.25, 1.15, 0.16, 0.35, steel);
    box(tractor, 4.15, 0.75, side * 1.21, 0.95, 0.1, 0.27, steel);
    box(tractor, 5.13, 2.76, side * 1.45, 0.06, 0.08, 0.57, steel);
    box(tractor, 5.15, 2.55, side * 1.73, 0.19, 0.42, 0.08, dark);
    box(tractor, 5.15, 2.55, side * 1.78, 0.14, 0.34, 0.015, steel, 0.01);
    box(tractor, 6.58, 1.38, side * 0.77, 0.06, 0.23, 0.42, light, 0.025);
    box(tractor, 5.4, 3.3, side * 0.8, 0.16, 0.05, 0.16, light);
  }
  box(tractor, 6.65, 0.91, 0, 0.18, 0.28, 2.23, white);
  box(tractor, 6.61, 1.56, 0, 0.03, 0.42, 0.92, dark);
  for (let i = 0; i < 6; i++)
    box(tractor, 6.64, 1.38 + i * 0.065, 0, 0.025, 0.018, 0.86, steel, 0.005);
  const trailerPivot = new T.Group();
  trailerPivot.position.x = -1;
  trailerPivot.name = "Articulated white box trailer";
  truck.add(trailerPivot);
  box(trailerPivot, -4.4, 2.45, 0, 10.65, 3.35, 2.48, white, 0.09);
  box(trailerPivot, -4.4, 0.76, 0, 10.7, 0.15, 2.5, steel);
  box(trailerPivot, -4.4, 4.16, 0, 10.7, 0.06, 2.5, white);
  for (const side of [-1, 1]) {
    box(trailerPivot, -4.4, 1.05, side * 1.28, 10.4, 0.065, 0.07, steel);
    for (let i = 0; i < 12; i++)
      box(
        trailerPivot,
        -9.2 + i * 0.85,
        2.5,
        side * 1.247,
        0.022,
        3.1,
        0.016,
        white,
        0.003,
      );
    box(trailerPivot, -3.8, 0.65, side * 0.85, 4, 0.1, 0.09, steel);
  }
  // Closed rear doors, hinges and lights; no graphics or text.
  box(trailerPivot, -9.76, 2.45, 0, 0.04, 3.18, 2.33, white);
  box(trailerPivot, -9.8, 2.45, 0, 0.035, 3.1, 0.035, steel);
  for (const side of [-1, 1]) {
    box(trailerPivot, -9.81, 2.45, side * 0.7, 0.025, 2.75, 0.027, steel);
    box(trailerPivot, -9.83, 0.94, side * 0.94, 0.055, 0.16, 0.23, red);
    for (const y of [1.5, 2.5, 3.5])
      box(trailerPivot, -9.81, y, side * 1.11, 0.045, 0.11, 0.15, steel);
  }
  box(trailerPivot, -9.83, 0.6, 0, 0.13, 0.17, 2.3, steel);
  const wheels: T.Group[] = [],
    steer: T.Group[] = [];
  function wheel(parent: T.Group, x: number, z: number, front = false) {
    const steering = new T.Group();
    steering.position.set(x, 0.54, z);
    parent.add(steering);
    if (front) steer.push(steering);
    const spin = new T.Group();
    spin.name = "Distance-driven wheel";
    steering.add(spin);
    wheels.push(spin);
    const tire = cylinder(spin, 0, 0, 0, 0.52, 0.33, rubber);
    tire.rotation.x = Math.PI / 2;
    const side = Math.sign(z);
    const rim = cylinder(spin, 0, 0, side * 0.18, 0.3, 0.035, steel);
    rim.rotation.x = Math.PI / 2;
    const hub = cylinder(spin, 0, 0, side * 0.21, 0.11, 0.09, dark);
    hub.rotation.x = Math.PI / 2;
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      const lug = cylinder(
        spin,
        Math.cos(a) * 0.2,
        Math.sin(a) * 0.2,
        side * 0.205,
        0.025,
        0.035,
        steel,
      );
      lug.rotation.x = Math.PI / 2;
    }
    const tread = new T.Mesh(new T.TorusGeometry(0.47, 0.03, 5, 32), rubber);
    tread.position.z = side * 0.16;
    spin.add(tread);
    // A short hub spoke makes distance-consistent rotation visible even at a distance.
    box(spin, 0.14, 0, side * 0.235, 0.22, 0.035, 0.018, steel, 0.005);
  }
  for (const z of [-1.05, 1.05]) {
    wheel(tractor, 5.33, z, true);
    for (const x of [0.85, -0.55]) wheel(tractor, x, z);
    for (const x of [-7.3, -8.7]) wheel(trailerPivot, x, z);
  }
  const environment = new T.Group();
  environment.name = "Illustrative dock and access road";
  root.add(environment);
  box(environment, 23, -0.12, -1, 94, 0.2, 8, roadMat);
  for (let x = -22; x < 70; x += 3)
    box(environment, x, 0.003, 2.45, 1.5, 0.009, 0.055, paint, 0.001);
  for (const z of [-4.9, 2.95])
    box(environment, 23, 0.007, z, 94, 0.01, 0.05, paint, 0.001);
  box(environment, -14, 0.5, 0, 6, 1, 6, concrete);
  box(environment, -16.8, 3.6, 0, 0.25, 6.2, 8, concrete);
  box(environment, -16.63, 2.9, 0, 0.06, 4.5, 3.1, dark);
  for (const z of [-1.8, 1.8])
    box(environment, -16.3, 2.3, z, 0.18, 3.6, 0.18, steel);
  for (let i = 0; i < 9; i++)
    box(environment, -16.48, 1.1 + i * 0.45, 0, 0.025, 0.06, 2.9, steel, 0.005);
  box(environment, -16.3, 5.1, 0, 1.9, 0.12, 4.4, white);
  box(environment, -11, 1, -2.2, 8, 0.14, 1.2, steel);
  for (let i = 0; i < 20; i++) {
    const roll = cylinder(
      environment,
      -14.7 + i * 0.36,
      1.13,
      -2.2,
      0.07,
      1.08,
      steel,
    );
    roll.rotation.x = Math.PI / 2;
  }
  const cartons: T.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const o = box(
      environment,
      -10 + i * 1.8,
      1.49,
      -2.2,
      0.9,
      0.7,
      0.85,
      brown,
    );
    o.userData.processProduct = true;
    cartons.push(o);
  }
  // Dispatch cartons move toward the dock; finite loop returns remain inside end guards.
  for (const x of [-14.3, -8]) {
    box(environment, x, 2.3, -2.2, 1.5, 0.12, 1.35, dark);
    for (const z of [-2.87, -1.53])
      box(environment, x, 1.72, z, 1.5, 1.16, 0.06, dark);
  }
  const staticParents = [...wheels, tractor, trailerPivot, environment];
  // Batch non-articulated surfaces while preserving tires, steering, and trailer articulation.
  const dynamic = new Set<T.Object3D>([...wheels, ...steer, ...cartons]);
  for (const parent of staticParents) {
    parent.updateMatrixWorld(true);
    const sets = new Map<T.Material, T.BufferGeometry[]>(),
      remove: T.Mesh[] = [];
    const inverse = parent.matrixWorld.clone().invert();
    parent.traverse((o) => {
      if (!(o instanceof T.Mesh)) return;
      let p: T.Object3D | null = o;
      while (p && p !== parent) {
        if (dynamic.has(p)) return;
        p = p.parent;
      }
      const m = o.material as T.Material;
      const geo = o.geometry
        .clone()
        .applyMatrix4(inverse.clone().multiply(o.matrixWorld));
      const g = geo.index ? geo.toNonIndexed() : geo;
      g.deleteAttribute("uv");
      const list = sets.get(m) ?? [];
      list.push(g);
      sets.set(m, list);
      remove.push(o);
    });
    remove.forEach((o) => {
      o.removeFromParent();
      o.geometry.dispose();
    });
    for (const [m, g] of sets) {
      const merged = mergeGeometries(g);
      if (merged) {
        const o = new T.Mesh(merged, m);
        o.castShadow = true;
        o.receiveShadow = true;
        parent.add(o);
      }
      g.forEach((v) => v.dispose());
    }
  }
  return {
    root,
    truck,
    wheels,
    update: (t: number, reduced = false) => {
      const s = departureState(t, reduced);
      truck.position.set(s.x, 0, s.z);
      truck.rotation.y = s.yaw;
      trailerPivot.rotation.y = s.trailerYaw;
      wheels.forEach((w) => (w.rotation.z = s.wheelAngle));
      steer.forEach((w) => (w.rotation.y = s.steering));
      cartons.forEach(
        (c, i) =>
          (c.position.x = -8 - (((reduced ? 3 : t) * 0.45 + i * 2.1) % 6.3)),
      );
      root.userData.departure = s;
    },
    dispose: () => {
      const geo = new Set<T.BufferGeometry>(),
        mat = new Set<T.Material>();
      root.traverse((o) => {
        if (o instanceof T.Mesh) {
          geo.add(o.geometry);
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) =>
            mat.add(m),
          );
        }
      });
      geo.forEach((g) => g.dispose());
      mat.forEach((m) => m.dispose());
    },
  };
}
