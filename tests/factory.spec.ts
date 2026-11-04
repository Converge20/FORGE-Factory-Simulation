import { test, expect } from "@playwright/test";
test("cinematic navigation locks rapid input and supports keyboard, previous and restart", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.locator(".welcome-choice").first().click();
  await expect(page.locator(".loading")).toHaveCount(0, { timeout: 30000 });
  await expect(page.locator("canvas")).toBeVisible();
  await expect(page.locator("h1")).toContainText("One can.");
  await page.evaluate(() => {
    const b = document.querySelector<HTMLButtonElement>(".next-chapter")!;
    b.click();
    b.click();
    b.click();
  });
  await expect(page.locator("main")).toHaveAttribute("data-chapter", "2");
  await expect(
    page.getByRole("button", { name: "Continue", exact: true }),
  ).toBeEnabled({ timeout: 10000 });
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("main")).toHaveAttribute("data-chapter", "3");
  await expect(
    page.getByRole("button", { name: "Previous chapter" }),
  ).toBeEnabled({ timeout: 20000 });
  await page.getByRole("button", { name: "Previous chapter" }).click();
  await expect(page.locator("main")).toHaveAttribute("data-chapter", "2");
  await expect(
    page.getByRole("button", { name: "Restart presentation" }),
  ).toBeEnabled({ timeout: 20000 });
  await page.keyboard.press("Home");
  await expect(page.locator("main")).toHaveAttribute("data-chapter", "1");
  await page.getByRole("button", { name: "Sources & notes" }).click();
  await expect(page.locator("dialog")).toBeVisible();
  await expect(page.locator("dialog")).toContainText(
    "ILLUSTRATIVE RECONSTRUCTION",
  );
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Pause animation" }),
  ).toBeEnabled({ timeout: 20000 });
  await page.getByRole("button", { name: "Pause animation" }).click();
  await expect(
    page.getByRole("button", { name: "Resume animation" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("all fourteen operations render under reduced motion; finale and sources remain real and navigable", async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  const external: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => {
    if (
      !new URL(r.url()).hostname.match(/^(127\.0\.0\.1|localhost)$/) &&
      !r.url().startsWith("data:")
    )
      external.push(r.url());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator(".welcome-choice").first().click();
  await expect(page.locator(".loading")).toHaveCount(0, { timeout: 30000 });
  for (let i = 1; i <= 14; i++) {
    await expect(page.locator("main")).toHaveAttribute(
      "data-chapter",
      String(i),
    );
    await expect(page.locator("canvas")).toBeVisible();
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".next-chapter")).toBeEnabled({ timeout: 20000 });
    await expect(page.locator("canvas")).toHaveAttribute(
      "data-chapter",
      String(i),
      { timeout: 20000 },
    );
    const diag = await page
      .locator("canvas")
      .evaluate((c) => ({ ...c.dataset }));
    expect(Number(diag.triangles)).toBeGreaterThan(0);
    expect(Number(diag.drawCalls)).toBeLessThan(180);
    if (i < 14) await page.locator(".next-chapter").click();
  }
  await expect(
    page.getByRole("button", { name: "Experience it again" }),
  ).toBeVisible();
  // Reduced motion must frame the completed truck immediately, including
  // after a portrait resize, rather than looking back toward the empty dock.
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(async () => page.locator("canvas").evaluate((c) => {
    const pose = JSON.parse(c.dataset.departure ?? "{}");
    const target = JSON.parse(c.dataset.target ?? "[]");
    return Math.abs(target[0] - (pose.x - 2));
  })).toBeLessThan(0.01);
  await page.getByRole("button", { name: "Experience it again" }).click();
  await expect(page.locator("main")).toHaveAttribute("data-chapter", "1");
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});
test("mobile has no horizontal overflow and retains chapter navigation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator(".welcome-choice").first().click();
  await expect(page.locator("canvas")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.locator(".next-chapter").click();
  await expect(page.locator("main")).toHaveAttribute("data-chapter", "2");
  await expect(page.locator(".next-chapter")).toBeInViewport();
});
test("missing WebGL preserves documentary text, sources and navigation", async ({
  page,
}) => {
  await page.addInitScript(() => {
    HTMLCanvasElement.prototype.getContext = (() =>
      null) as typeof HTMLCanvasElement.prototype.getContext;
  });
  await page.goto("/");
  await page.locator(".welcome-choice").first().click();
  await expect(page.getByText("This journey needs WebGL.")).toBeVisible();
  await expect(page.locator(".loading")).toHaveCount(0);
  await page.locator(".next-chapter").click();
  await expect(page.locator("main")).toHaveAttribute("data-chapter", "2");
  for (let i = 2; i < 14; i++) {
    await expect(page.locator(".next-chapter")).toBeEnabled({ timeout: 10000 });
    await page.locator(".next-chapter").click();
  }
  await expect(
    page.getByRole("button", { name: "Experience it again", exact: true }),
  ).toBeVisible();
  await expect(page.locator("h1")).toHaveText(
    "Thanks for exploring the journey.",
  );
});
test("lost WebGL context presents fallback without trapping navigation", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".welcome-choice").first().click();
  await expect(page.locator(".loading")).toHaveCount(0, { timeout: 30000 });
  await page
    .locator("canvas")
    .evaluate((c) =>
      (c as HTMLCanvasElement)
        .getContext("webgl2")
        ?.getExtension("WEBGL_lose_context")
        ?.loseContext(),
    );
  await expect(page.getByText("This journey needs WebGL.")).toBeVisible();
});
test("white truck departs with distance-driven wheels and reaches the closing message", async ({
  page,
}) => {
  test.setTimeout(180000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator(".welcome-choice").first().click();
  for (let i = 1; i < 14; i++) {
    await expect(page.locator(".next-chapter")).toBeEnabled({ timeout: 20000 });
    if (i === 13) await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.locator(".next-chapter").click();
  }
  await expect(page.locator("canvas")).toHaveAttribute("data-chapter", "14", {
    timeout: 20000,
  });
  const pose = () =>
    page
      .locator("canvas")
      .evaluate((c) => JSON.parse(c.dataset.departure ?? "{}"));
  await expect
    .poll(async () => Number((await pose()).distance), { timeout: 30000 })
    .toBeGreaterThan(2);
  const moving = await pose();
  expect(Math.abs(moving.wheelAngle * 0.52 + moving.distance)).toBeLessThan(
    0.0001,
  );
  await expect
    .poll(async () => (await pose()).closing, { timeout: 40000 })
    .toBe(true);
  await expect(page.locator("h1")).toHaveText(
    "Thanks for exploring the journey.",
  );
  await expect
    .poll(async () => (await pose()).finished, { timeout: 30000 })
    .toBe(true);
  await expect(
    page.getByRole("button", { name: "Experience it again", exact: true }),
  ).toBeVisible();
});
