import { test, expect } from "@playwright/test";
test("manufacturing phase survives paused mode switches and filling shows arrival, dispensing and departure", async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator(".welcome-choice").first().click();
  for (let i = 1; i < 9; i++) {
    await page.locator(".next-chapter:enabled").waitFor();
    await page.locator(".next-chapter").click();
  }
  const c = page.locator("canvas");
  await expect(c).toHaveAttribute("data-chapter", "9");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect
    .poll(async () => Number(await c.getAttribute("data-flow-time")))
    .toBeGreaterThan(0.1);
  await page
    .getByRole("button", { name: "Pause animation", exact: true })
    .click();
  await page.waitForTimeout(200);
  const time = Number(await c.getAttribute("data-flow-time"));
  const fillBefore = JSON.parse(
    (await c.getAttribute("data-process-state")) ?? "{}",
  ).filling;
  await page
    .getByRole("button", { name: "Factory Explorer", exact: true })
    .click();
  await page.getByLabel("Find a process").selectOption("8");
  await expect(c).toHaveAttribute("data-selected", "8");
  await expect
    .poll(async () => Number(await c.getAttribute("data-flow-time")))
    .toBe(time);
  const fillAfter = JSON.parse(
    (await c.getAttribute("data-process-state")) ?? "{}",
  ).filling;
  expect(fillAfter).toEqual(fillBefore);
  await page
    .getByRole("button", { name: "Resume animation", exact: true })
    .click();
  for (const [min, max] of [
    [1.9, 3],
    [3.2, 4.4],
    [4.6, 5.9],
    [0.1, 1.4],
  ]) {
    await expect
      .poll(
        async () => {
          const s = JSON.parse(
            (await c.getAttribute("data-process-state")) ?? "{}",
          ).filling;
          return s && s.phase >= min && s.phase <= max;
        },
        { timeout: 45000 },
      )
      .toBe(true);
    const state = JSON.parse(
      (await c.getAttribute("data-process-state")) ?? "{}",
    ).filling;
    expect(state.cans).toHaveLength(7);
    if (min >= 1.9 && min < 4.4) {
      const heads = state.cans.filter(
        (s: { x: number }) => Math.abs(s.x) <= 1.01,
      );
      expect(heads).toHaveLength(3);
      expect(
        heads.every(
          (s: { moving: boolean; fill: number }) =>
            !s.moving && s.fill >= 0 && s.fill <= 1,
        ),
      ).toBe(true);
    }
  }
  expect(errors).toEqual([]);
});
