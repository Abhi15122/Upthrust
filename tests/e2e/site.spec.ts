import { test, expect } from "@playwright/test";
test("homepage is responsive, has no FAQ and matches the supplied navigation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "BOLD DESIGN",
  );
  for (const width of [1440, 768, 390, 360]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await expect(page.locator("header a")).toHaveCount(2);
  await expect(page.locator("header")).not.toContainText("Our expertise");
  await expect(page.locator("header")).not.toContainText("Our approach");
  await expect(
    page
      .locator("header")
      .getByRole("link", { name: "CONTACT US", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Good questions. Straight answers." }),
  ).toHaveCount(0);
  expect(errors).toEqual([]);
});
test("successful form persists a matching record and emits one event without email", async ({
  page,
}) => {
  await page.goto("/demo");
  const email = `interview-${Date.now()}@example.com`;
  await page.getByRole("textbox", { name: "Email address" }).fill(email);
  await page.locator("input[name=consent]").check();
  await page.getByRole("button", { name: "Submit", exact: false }).click();
  await expect(page.getByRole("status")).toContainText("received", {
    timeout: 15000,
  });
  await expect(
    page.getByRole("cell", { name: email, exact: true }),
  ).toBeVisible();
  const events = await page.evaluate(() =>
    window.dataLayer.filter((e) => e.event === "form_submit"),
  );
  expect(events).toHaveLength(1);
  expect(events[0]).not.toHaveProperty("email");
  expect(events[0].form_id).toBe("newsletter");
  await expect(
    page.getByRole("cell", {
      name: String(events[0].submission_id),
      exact: true,
    }),
  ).toBeVisible();
});
test("storage failure displays an error and never emits conversion", async ({
  page,
}) => {
  await page.goto("/");
  await page.route("**/api/newsletter", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ error: "Storage unavailable. Please try again." }),
    }),
  );
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("failure@example.com");
  await page.locator("input[name=consent]").check();
  await page.getByRole("button", { name: "Submit", exact: false }).click();
  await expect(page.getByRole("status")).toContainText("Storage unavailable");
  expect(
    await page.evaluate(() =>
      (window.dataLayer || []).filter((e) => e.event === "form_submit"),
    ),
  ).toHaveLength(0);
  await expect(
    page.getByRole("textbox", { name: "Email address" }),
  ).toHaveValue("failure@example.com");
});
