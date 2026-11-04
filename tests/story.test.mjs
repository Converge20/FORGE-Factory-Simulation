import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
const js = ts.transpileModule(
  readFileSync(new URL("../src/story.ts", import.meta.url), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.ESNext } },
).outputText;
const { chapters, sources, navigate, eased, revealTimeline } = await import(
  "data:text/javascript;base64," + Buffer.from(js).toString("base64")
);
test("fourteen ordered chapters have attributable product facts and explicit reconstruction boundaries", () => {
  assert.equal(chapters.length, 14);
  assert.equal(new Set(chapters.map((c) => c.id)).size, 14);
  for (const c of chapters) {
    assert.ok(c.fact.length > 20);
    assert.ok(sources[c.factSource].url.startsWith("https://"));
    assert.ok(sources[c.practiceSource]);
    assert.ok(c.assumption.length > 30);
    assert.equal(c.eye.length, 3);
  }
  assert.equal(chapters.at(-1).id, "departure");
});
test("rapid input cannot skip a chapter; previous and restart obey the same transition gate", () => {
  let s = { index: 0, lockedUntil: 0, revision: 0 };
  s = navigate(s, "next", 100);
  assert.equal(s.index, 1);
  assert.equal(navigate(s, "next", 101), s);
  assert.equal(navigate(s, "previous", 200), s);
  s = navigate(s, "previous", 1400);
  assert.equal(s.index, 0);
  s = navigate(s, "next", 3000);
  s = navigate(s, "restart", 4400);
  assert.equal(s.index, 0);
});
test("navigation stays within bounds and reduced motion uses a short input guard", () => {
  const s = { index: 13, lockedUntil: 0, revision: 0 };
  assert.equal(navigate(s, "next", 1).index, 13);
  assert.equal(navigate({ ...s, index: 0 }, "previous", 1).index, 0);
  const n = navigate({ ...s, index: 0 }, "next", 10, true);
  assert.equal(n.lockedUntil, 190);
});
test("finale packs travel, opening, extraction and hero views in order", () => {
  assert.equal(revealTimeline(0).travel, 0);
  assert.equal(revealTimeline(2).open, 0);
  assert.equal(revealTimeline(4).rise, 0);
  assert.equal(revealTimeline(7).hero, 0);
  assert.equal(revealTimeline(13).hero, 1);
  assert.equal(revealTimeline(13).close, true);
  assert.deepEqual(revealTimeline(0, true), revealTimeline(16));
  assert.equal(eased(-1), 0);
  assert.equal(eased(2), 1);
});
