import { test, expect } from "@playwright/test";
test("welcome offers both modes and switches without reloading or losing guided progress", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".welcome")).toBeVisible();
  await expect(page.locator("main")).toHaveAttribute("data-mode", "welcome");
  await page.evaluate(() => {
    (window as unknown as Record<string, unknown>).__forgeSession = "preserved";
  });
  await page.locator(".welcome-choice").first().click();
  await page.locator(".next-chapter").click();
  await expect(page.locator("main")).toHaveAttribute("data-chapter", "2");
  await page
    .getByRole("button", { name: "Factory Explorer", exact: true })
    .click();
  await expect(page.locator("canvas")).toHaveAttribute(
    "data-mode",
    "explorer",
    { timeout: 30000 },
  );
  await expect(page.locator("canvas")).toHaveAttribute(
    "data-station-count",
    "13",
  );
  await page
    .getByRole("button", { name: "Guided Experience", exact: true })
    .click();
  await expect(page.locator("main")).toHaveAttribute("data-chapter", "2");
  expect(
    await page.evaluate(
      () => (window as unknown as Record<string, unknown>).__forgeSession,
    ),
  ).toBe("preserved");
});
test("Explorer camera orbits, zooms, pans, focuses machines and resets safely", async ({
  page,
}) => {
  test.setTimeout(180000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator(".welcome-choice").nth(1).click();
  const c = page.locator("canvas");
  await expect(c).toHaveAttribute("data-mode", "explorer", { timeout: 30000 });
  await expect(c).toHaveAttribute("data-focus-complete", "true", {
    timeout: 30000,
  });
  let before = await c.getAttribute("data-camera");
  await page.mouse.move(1120, 360);
  await page.mouse.down();
  await page.mouse.move(850, 420, { steps: 10 });
  await page.mouse.up();
  await expect.poll(() => c.getAttribute("data-camera")).not.toBe(before);
  await expect(page.locator("main")).toHaveAttribute(
    "data-selected",
    "overview",
  );
  const azimuth = async () => {
    const eye = JSON.parse((await c.getAttribute("data-camera"))!);
    const target = JSON.parse((await c.getAttribute("data-target"))!);
    return Math.atan2(eye[0] - target[0], eye[2] - target[2]);
  };
  let total = 0,
    last = await azimuth();
  for (let i = 0; i < 4; i++) {
    await page.mouse.move(1200, 350);
    await page.mouse.down();
    await page.mouse.move(750, 350, { steps: 8 });
    await page.mouse.up();
    const next = await azimuth();
    let step = next - last;
    while (step > Math.PI) step -= Math.PI * 2;
    while (step < -Math.PI) step += Math.PI * 2;
    total += step;
    last = next;
  }
  expect(Math.abs(total)).toBeGreaterThan(Math.PI * 2);
  before = await c.getAttribute("data-camera");
  await page.mouse.move(1080, 390);
  await page.mouse.wheel(0, -450);
  await expect.poll(() => c.getAttribute("data-camera")).not.toBe(before);
  const target = await c.getAttribute("data-target");
  await page.mouse.move(1100, 370);
  await page.mouse.down({ button: "right" });
  await page.mouse.move(1000, 420, { steps: 8 });
  await page.mouse.up({ button: "right" });
  await expect.poll(() => c.getAttribute("data-target")).not.toBe(target);
  await page.getByLabel("Find a process").selectOption("4");
  await expect(page.locator(".inspector h1")).toHaveText("sugar preparation");
  await expect(c).toHaveAttribute("data-selected", "4", { timeout: 30000 });
  await expect(c).toHaveAttribute("data-focus-complete", "true", {
    timeout: 30000,
  });
  const aim = JSON.parse((await c.getAttribute("data-target"))!);
  expect(aim[0]).toBeCloseTo(-9, 1);
  expect(aim[2]).toBeCloseTo(-7, 1);
  await page.getByRole("button", { name: "Return to Factory" }).click();
  await expect(page.locator(".inspector")).toHaveCount(0);
  await expect(c).toHaveAttribute("data-selected", "overview");
  await page.getByRole("button", { name: "Reset view" }).click();
  await expect(c).toHaveAttribute("data-focus-complete", "true", {
    timeout: 30000,
  });
  const reset = JSON.parse((await c.getAttribute("data-camera"))!);
  expect(reset[0]).toBeCloseTo(53, 1);
  expect(reset[1]).toBeGreaterThan(0);
});
test("all thirteen shared stations are selectable with bounded Explorer complexity and no page errors", async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator(".welcome-choice").nth(1).click();
  const c = page.locator("canvas");
  await expect(c).toHaveAttribute("data-mode", "explorer", { timeout: 30000 });
  for (let i = 1; i <= 13; i++) {
    await page.getByLabel("Find a process").selectOption(String(i));
    await expect(c).toHaveAttribute("data-selected", String(i), {
      timeout: 20000,
    });
    await expect(c).toHaveAttribute("data-focus-complete", "true");
    await expect(page.locator(".inspector h1")).toBeVisible();
    const stats = await c.evaluate((canvas) => ({ ...canvas.dataset }));
    expect(Number(stats.drawCalls)).toBeLessThan(280);
    expect(Number(stats.triangles)).toBeLessThan(500000);
  }
  expect(errors).toEqual([]);
});
test("expanded education is shared between modes and source interaction cannot advance the chapter", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator(".welcome-choice").nth(1).click();
  await page.getByLabel("Find a process").selectOption("4");
  await page.locator(".inspector .explanation summary").click();
  const text = await page.locator(".inspector .explanation p").innerText();
  expect(text.split(/\s+/).length).toBeGreaterThanOrEqual(80);
  await page
    .getByRole("button", { name: "Guided Experience", exact: true })
    .click();
  for (let i = 0; i < 4; i++) {
    await expect(page.locator(".next-chapter")).toBeEnabled({ timeout: 20000 });
    await page.locator(".next-chapter").click();
  }
  await expect(page.locator(".chapter-content .explanation p")).toHaveText(
    text,
  );
  await page.getByRole("button", { name: "Sources & notes" }).click();
  await expect(page.locator("dialog")).toBeVisible();
  await expect(page.locator("main")).toHaveAttribute("data-chapter", "5");
  await page.keyboard.press("Escape");
  await expect(page.locator("main")).toHaveAttribute("data-chapter", "5");
  const anchors = page.locator(".chapter-content a");
  for (let i = 0; i < (await anchors.count()); i++) {
    await expect(anchors.nth(i)).toHaveAttribute("target", "_blank");
    await expect(anchors.nth(i)).toHaveAttribute("rel", /noopener.*noreferrer/);
    await expect(anchors.nth(i)).toHaveAttribute("href", /^https:\/\//);
  }
});
test("touch users can select machinery and inspect a compact explanation", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(baseURL ?? "http://127.0.0.1:5173");
  await page.locator(".welcome-choice").nth(1).tap();
  await expect(page.locator("canvas")).toHaveAttribute(
    "data-mode",
    "explorer",
    { timeout: 30000 },
  );
  await page.locator('[data-station="8"]').tap();
  await expect(page.locator(".inspector")).toBeVisible();
  await expect(page.locator("main")).toHaveAttribute("data-selected", "8");
  await page.locator(".inspector .explanation summary").tap();
  await expect(page.locator(".inspector .explanation p")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await context.close();
});

test("Guided camera ignores orbit and wheel gestures, and dragging does not advance", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator(".welcome-choice").first().click();
  const canvas = page.locator("canvas");
  await expect(canvas).toHaveAttribute("data-mode", "guided", {
    timeout: 30000,
  });
  await expect(canvas).toHaveAttribute("data-chapter", "1");
  const pose = await canvas.getAttribute("data-camera");
  await page.mouse.move(1120, 350);
  await page.mouse.down();
  await page.mouse.move(900, 430, { steps: 8 });
  await page.mouse.up();
  await page.mouse.wheel(0, -500);
  await expect(page.locator("main")).toHaveAttribute("data-chapter", "1");
  expect(await canvas.getAttribute("data-camera")).toBe(pose);
});
