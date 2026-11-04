import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import ts from "typescript";
const require = createRequire(import.meta.url);
const transpile = (p) =>
  ts.transpileModule(readFileSync(new URL(p, import.meta.url), "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
const url = (s) =>
  "data:text/javascript;base64," + Buffer.from(s).toString("base64");
const storyUrl = url(transpile("../src/story.ts"));
const facilityUrl = url(
  transpile("../src/facility.ts").replace(
    /from ['"]\.\/story['"]/,
    `from '${storyUrl}'`,
  ),
);
const { explorerStations, layout, canRoute, packRoute, routePoint } =
  await import(facilityUrl);
const { chapters } = await import(storyUrl);
const motionUrl = url(transpile("../src/truckMotion.ts"));
const { departureState, pointAtDistance, WHEEL_RADIUS } = await import(
  motionUrl
);
test("all manufacturing stations share chapter content, eight connected zones and bounded focus targets", () => {
  assert.equal(explorerStations.length, 13);
  assert.equal(new Set(layout.map((s) => s.zone)).size, 8);
  assert.equal(new Set(explorerStations.map((s) => s.id)).size, 13);
  for (const s of explorerStations) {
    assert.equal(s.content, chapters[s.chapter]);
    assert.equal(s.animation.demoIndex, s.chapter);
    assert.ok(s.radius >= 3 && s.radius <= 10);
    assert.ok(s.position.every(Number.isFinite));
    assert.ok(s.evidence.includes("industry"));
  }
  assert.equal(chapters.at(-1).id, "departure");
});
test("all detailed explanations are 80–120 words and retain distinct cited evidence", () => {
  for (const c of chapters) {
    const words = c.explanation.split(/\s+/).length;
    assert.ok(words >= 80 && words <= 120, `${c.id}: ${words}`);
    assert.ok(c.summary);
    assert.ok(c.factSource);
    assert.ok(c.practiceSource);
    assert.ok(c.assumption.length > 30);
  }
});
test("can and pack routes connect at packaging and remain finite over repeated cycles", () => {
  const end = canRoute.at(-1);
  assert.equal(end[0], packRoute[0][0]);
  assert.equal(end[2], packRoute[0][2]);
  for (const path of [canRoute, packRoute])
    for (let i = -100; i <= 100; i++) {
      assert.ok(routePoint(path, i / 31).every(Number.isFinite));
    }
  assert.deepEqual(routePoint(packRoute, 0), routePoint(packRoute, 1));
});
test("truck wheels track travelled path length, with smooth acceleration and limited steering", () => {
  let last = 0;
  for (let t = 0; t <= 24; t += 0.1) {
    const s = departureState(t);
    assert.ok(s.distance >= last - 1e-9);
    assert.ok(Math.abs(s.wheelAngle * WHEEL_RADIUS + s.distance) < 1e-9);
    assert.ok(Math.abs(s.steering) < 0.2);
    assert.ok(Math.abs(s.trailerYaw) < 0.2);
    assert.ok([s.x, s.z, s.yaw].every(Number.isFinite));
    last = s.distance;
  }
  assert.equal(departureState(4).distance, 0);
  assert.equal(departureState(6).distance, 0);
  assert.ok(departureState(9).speed < departureState(12).speed);
  assert.equal(departureState(25).speed, 0);
  assert.equal(departureState(18).closing, false);
  assert.equal(departureState(19).closing, true);
  assert.equal(departureState(24).finished, true);
  assert.equal(departureState(0, true).finished, true);
  assert.equal(departureState(0, true).speed, 0);
  assert.ok(Math.abs(pointAtDistance(25).z) > 1);
});
const threePath = require
  .resolve("three")
  .replace("three.cjs", "three.module.js");
const roundPath = pathToFileURL(
  require.resolve("three/examples/jsm/geometries/RoundedBoxGeometry.js"),
).href;
const mergePath = pathToFileURL(
  require.resolve("three/examples/jsm/utils/BufferGeometryUtils.js"),
).href;
const truckCode = transpile("../src/logistics.ts")
  .replace(/from ['"]three['"]/, `from '${pathToFileURL(threePath).href}'`)
  .replace(
    /from ['"]three\/examples\/jsm\/geometries\/RoundedBoxGeometry.js['"]/,
    `from '${roundPath}'`,
  )
  .replace(
    /from ['"]three\/examples\/jsm\/utils\/BufferGeometryUtils.js['"]/,
    `from '${mergePath}'`,
  )
  .replace(/from ['"]\.\/truckMotion['"]/, `from '${motionUrl}'`);
const { createLogistics } = await import(url(truckCode));
test("actual procedural tractor-trailer is white and unbranded, and wheels visibly follow its motion", () => {
  const d = createLogistics();
  let whites = 0;
  d.truck.traverse((o) => {
    assert.ok(!/red.?bull|forge|logo|advertis/i.test(o.name));
    if (o.isMesh) {
      for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
        assert.equal(m.map, null);
        if (m.color && m.color.r > 0.75 && m.color.g > 0.75 && m.color.b > 0.75)
          whites++;
      }
    }
  });
  assert.ok(whites >= 2);
  assert.equal(d.wheels.length, 10);
  d.update(10);
  const state = departureState(10);
  assert.ok(d.truck.position.x > 0);
  for (const w of d.wheels)
    assert.ok(Math.abs(w.rotation.z - state.wheelAngle) < 1e-8);
  d.dispose();
});
