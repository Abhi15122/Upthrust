import { test, expect } from "@playwright/test";

test("desktop scrolling moves through aligned service panels and one continuous ribbon", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const services = page.locator("#services");
  await expect(services).toHaveAttribute("data-enhanced", "true");
  await expect(services.locator("[data-service-ribbon]")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await expect(services.locator("canvas")).toHaveCount(1);
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    const root = document.querySelector("#services")!;
    window.scrollTo(0, root.getBoundingClientRect().top + scrollY);
  });
  await expect.poll(() => services.getAttribute("data-progress")).toBe("0");
  await page.mouse.wheel(0, 720);
  await expect
    .poll(async () => Number(await services.getAttribute("data-progress")))
    .toBeGreaterThan(0.1);
  expect(
    Math.abs(
      await page
        .locator("[data-services-stage]")
        .evaluate((e) => e.getBoundingClientRect().top),
    ),
  ).toBeLessThan(1);
  const boxes = [];
  for (let index = 0; index < 4; index++) {
    await page.evaluate((index) => {
      const root = document.querySelector("#services")!;
      window.scrollTo(
        0,
        root.getBoundingClientRect().top + scrollY + index * innerWidth,
      );
    }, index);
    const panel = page.locator(`[data-service-index="${index}"]`);
    await expect
      .poll(() => panel.evaluate((e) => Math.abs(e.getBoundingClientRect().x)))
      .toBeLessThan(1);
    boxes.push(
      await panel.evaluate((e) => {
        const r = e.getBoundingClientRect();
        return [
          "[data-service-collage]",
          "[data-service-heading]",
          "[data-service-copy]",
          "[data-service-contact]",
        ].map((selector) => {
          const b = e.querySelector(selector)!.getBoundingClientRect();
          return { x: b.x - r.x, y: b.y - r.y };
        });
      }),
    );
  }
  for (const box of boxes)
    box.forEach((point, index) => {
      expect(Math.abs(point.x - boxes[0][index].x)).toBeLessThan(1);
      expect(Math.abs(point.y - boxes[0][index].y)).toBeLessThan(1);
    });
  await page.evaluate(() => {
    location.hash = "title-product";
  });
  await expect
    .poll(() =>
      page
        .locator('[data-service="product"]')
        .evaluate((e) => Math.abs(e.getBoundingClientRect().x)),
    )
    .toBeLessThan(1);
  await page.locator('[data-service="creative"] a').focus();
  await expect
    .poll(() =>
      page
        .locator('[data-service="creative"]')
        .evaluate((e) => Math.abs(e.getBoundingClientRect().x)),
    )
    .toBeLessThan(1);
  await page.evaluate(() => {
    const root = document.querySelector("#services")!;
    window.scrollTo(0, root.getBoundingClientRect().bottom + scrollY);
  });
  await expect
    .poll(() =>
      page
        .locator("[data-services-stage]")
        .evaluate((e) => e.getBoundingClientRect().bottom),
    )
    .toBeLessThan(1);
  expect(errors).toEqual([]);
});

test("services stay stacked on mobile and with reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator("#services")).toHaveAttribute(
    "data-enhanced",
    "false",
  );
  await expect(page.locator("[data-service-ribbon]")).toHaveCount(0);
  const mobileRibbons = page.locator("[data-mobile-ribbon]");
  await expect(mobileRibbons).toHaveCount(4);
  for (const ribbon of await mobileRibbons.all()) {
    await ribbon.scrollIntoViewIfNeeded();
    await expect(ribbon).toBeVisible();
    await ribbon.evaluate((image: HTMLImageElement) => image.decode());
  }
  const top = await page
    .locator("[data-service]")
    .evaluateAll((panels) => panels.map((p) => p.getBoundingClientRect().top));
  for (let index = 1; index < top.length; index++)
    expect(top[index]).toBeGreaterThan(top[index - 1]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("#services")).toHaveAttribute(
    "data-enhanced",
    "false",
  );
  await expect(page.locator("[data-service-ribbon]")).toHaveCount(0);
});
