import { test, expect } from "@playwright/test";

test("smoke test: load page, verify color card, swipe once", async ({ page }) => {
	await page.goto("/");

	await page.waitForSelector('[class*="swipe"]', { timeout: 10_000 });

	const card = page.locator('[class*="swipe-card"]').first();
	await expect(card).toBeVisible();

	const box = await card.boundingBox();
	if (!box) throw new Error("Card not found");

	await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
	await page.mouse.down();
	await page.mouse.move(box.x + box.width + 300, box.y + box.height / 2, {
		steps: 10,
	});
	await page.mouse.up();

	await page.waitForTimeout(500);
});
