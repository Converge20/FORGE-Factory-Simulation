import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import ts from "typescript";
const require = createRequire(import.meta.url),
  cache = new Map();
function moduleUrl(file) {
  if (cache.has(file.href)) return cache.get(file.href);
  let js = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  js = js.replace(/from ["']([^"']+)["']/g, (_, name) => {
    let target;
    if (name.startsWith(".")) target = moduleUrl(new URL(name + ".ts", file));
    else {
      const path = require.resolve(name);
      target = pathToFileURL(
        name === "three" ? path.replace("three.cjs", "three.module.js") : path,
      ).href;
    }
    return `from '${target}'`;
  });
  const u = "data:text/javascript;base64," + Buffer.from(js).toString("base64");
  cache.set(file.href, u);
  return u;
}
const {
  fillingState,
  sealingState,
  packagingState,
  inspectionState,
  advanceFlow,
  BELT_TOP,
} = await import(
  moduleUrl(new URL("../src/productionMotion.ts", import.meta.url))
);
// Canvas text in signs/cartons is peripheral to geometry tests; no GPU or image mock is used.
globalThis.document = {
  createElement: () => ({
    width: 0,
    height: 0,
    getContext: () => ({
      fillRect() {},
      fillText() {},
      strokeText() {},
      fillStyle: "",
      font: "",
      textAlign: "",
    }),
  }),
};
const { createDemonstration } = await import(
  moduleUrl(new URL("../src/machinery.ts", import.meta.url))
);
const T = await import(
  pathToFileURL(
    require.resolve("three").replace("three.cjs", "three.module.js"),
  ).href
);

test("indexed filling holds seven evenly spaced cans and fills only beneath the nozzles", () => {
  for (let time = 0; time < 60; time += 0.025) {
    const states = Array.from({ length: 7 }, (_, i) => fillingState(time, i));
    const xs = states.map((s) => s.x).sort((a, b) => a - b);
    for (let i = 1; i < xs.length; i++)
      assert.ok(Math.abs(xs[i] - xs[i - 1] - 1) < 1e-8);
    for (const s of states) assert.ok(s.fill >= 0 && s.fill <= 1);
    if (states[0].filling) {
      const heads = states.filter((s) => Math.abs(s.x) <= 1.01);
      assert.equal(heads.length, 3);
      assert.ok(heads.every((s) => !s.moving));
      assert.ok(heads.every((s) => Math.abs(s.x - Math.round(s.x)) < 1e-8));
    }
  }
  const at = (t) =>
    Array.from({ length: 7 }, (_, i) => fillingState(t, i)).find(
      (s) => Math.abs(s.x) < 0.01,
    );
  assert.equal(at(1.8).fill, 0);
  assert.ok(at(3.2).fill > 0.4 && at(3.2).fill < 0.6);
  assert.equal(at(4.6).fill, 1);
  assert.equal(at(5.5).filling, false);
  assert.equal(at(5.5).valve, 0);
});
test("actual filling geometry transports its cans, keeps liquid inside their shells and closes all streams", () => {
  const d = createDemonstration(8, new T.Texture());
  const cans = d.root.children.filter(
    (o) => o.name === "Moving open cutaway can",
  );
  assert.equal(cans.length, 7);
  assert.equal(
    d.root.children.filter((o) => o.name === "Conveyor can").length,
    0,
  );
  d.update(1.8);
  const can = cans.find((o) => Math.abs(o.position.x) < 0.01);
  const before = can.position.x;
  d.update(3.2);
  assert.ok(can.userData.fill > 0.4 && can.userData.fill < 0.6);
  assert.equal(can.position.y, BELT_TOP);
  const liquid = can.children.find(
    (o) =>
      o.material?.transparent && o.material?.color?.getHexString() === "b6a064",
  );
  assert.ok(liquid);
  liquid.geometry.computeBoundingBox();
  const bounds = liquid.geometry.boundingBox;
  assert.ok(liquid.position.y + bounds.min.y * liquid.scale.y >= 0.049);
  assert.ok(liquid.position.y + bounds.max.y * liquid.scale.y < 1.075);
  d.update(5.5);
  const streams = d.root.children.filter(
    (o) => o.name === "Dispensed beverage stream",
  );
  assert.equal(streams.length, 3);
  assert.ok(streams.every((s) => !s.visible));
  d.update(7.5);
  assert.notEqual(can.position.x, before);
  d.dispose();
});
test("product wraps are confined to guarded belt ends, with no unfilled outlet cans", () => {
  for (let i = 0; i < 7; i++)
    for (let t = 0.01; t < 60; t += 0.01) {
      const a = fillingState(t - 0.01, i),
        b = fillingState(t, i);
      if (Math.abs(a.x - b.x) > 1)
        assert.ok(Math.abs(a.x) > 3.3 && Math.abs(b.x) > 3.3);
      if (b.x > 1.51 && !b.moving) assert.equal(b.fill, 1);
      if (a.fill > 0.99 && b.fill < 0.01 && Math.abs(a.x - b.x) < 1)
        assert.fail("contents reset in open work area");
    }
});
test("sealing seats an end while the can is stopped, then releases the sealed can", () => {
  const head = (t) =>
    Array.from({ length: 7 }, (_, i) => sealingState(t, i)).find(
      (s) => Math.abs(s.x) < 0.01,
    );
  assert.equal(head(1.3).sealed, false);
  assert.ok(head(2.3).engagement > 0.9);
  assert.equal(head(3).sealed, true);
  assert.equal(head(3.8).engagement, 0);
  const lane = Array.from({ length: 7 }, (_, i) => ({
    i,
    ...sealingState(3.8, i),
  })).find((s) => Math.abs(s.x) < 0.01).i;
  assert.ok(sealingState(5.1, lane).x > 0.9);
  assert.equal(sealingState(5.1, lane).sealed, true);
});
test("packaging picks up supported cans, carries them with its tool, lowers and dispatches them inside a closed carton", () => {
  assert.equal(packagingState(0).packY, BELT_TOP);
  assert.ok(packagingState(0).cartonZ < -4);
  for (let t = 2.5; t < 6; t += 0.1) {
    const s = packagingState(t);
    assert.equal(s.attached, true);
    assert.ok(Math.abs(s.toolX - s.packX) < 1e-8);
    assert.ok(Math.abs(s.toolY - s.packY - 0.61) < 1e-8);
  }
  const loaded = packagingState(7.4);
  assert.equal(loaded.open, 0);
  assert.ok(Math.abs(loaded.cartonZ) < 1e-8);
  assert.ok(loaded.packY > BELT_TOP);
  const departing = packagingState(9);
  assert.ok(departing.cartonX > 3);
  assert.equal(departing.packX, departing.cartonX);
  const d = createDemonstration(11, new T.Texture());
  d.update(9);
  assert.ok(d.root.userData.packaging.cartonX > 3);
  d.dispose();
});
test("inspection reject follows a supported branch while accepted cans stay on the main line", () => {
  for (let t = 0; t < 40; t += 0.1)
    for (let i = 0; i < 5; i++) {
      const s = inspectionState(t, i);
      assert.ok(s.x >= -3.5 && s.x < 3.5);
      assert.ok(s.z >= 0 && s.z <= 2);
      if (i !== 3) assert.equal(s.z, 0);
      if (s.z > 0) assert.ok(s.x > 0.65);
    }
});
test("one shared clock retains phase across views and freezes for pause or reduced motion", () => {
  const clock = { time: 3.2 };
  const before = fillingState(clock.time, 1);
  assert.equal(advanceFlow(clock, 0.02, true, false), 3.2);
  assert.equal(advanceFlow(clock, 0.02, false, true), 16);
  assert.equal(clock.time, 3.2);
  assert.deepEqual(fillingState(clock.time, 1), before);
  assert.ok(advanceFlow(clock, 0.02, false, false) > 3.2);
});

test("all twelve manufacturing builders animate their real geometry and remain finite through repeated loops", () => {
  for (let stage = 1; stage <= 12; stage++) {
    const d = createDemonstration(stage, new T.Texture());
    const signature = () => {
      const values = [];
      d.root.traverse((o) => {
        values.push(
          ...o.position.toArray(),
          ...o.rotation.toArray().slice(0, 3),
          ...o.scale.toArray(),
          Number(o.visible),
        );
        if (o.isInstancedMesh) values.push(...o.instanceMatrix.array);
      });
      assert.ok(values.every(Number.isFinite), `stage ${stage}`);
      return values.join(",");
    };
    d.update(0.5);
    const a = signature();
    d.update(2.6);
    assert.notEqual(signature(), a, `stage ${stage} should move`);
    for (const t of [5.9, 6, 9.9, 10, 25, 60]) {
      d.update(t);
      signature();
    }
    d.update(0, true);
    const reduced = signature();
    d.update(20, true);
    assert.equal(signature(), reduced);
    d.dispose();
  }
});
