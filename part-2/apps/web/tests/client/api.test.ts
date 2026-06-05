import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { imageUrl } from "../../src/lib/api";

describe("imageUrl", () => {
	it("returns the correct API path for a given key", () => {
		const url = imageUrl("red.svg");
		expect(url).toBe("/api/images/red.svg");
	});

	it("handles keys with subdirectories", () => {
		const url = imageUrl("colors/blue.svg");
		expect(url).toBe("/api/images/colors/blue.svg");
	});
});
