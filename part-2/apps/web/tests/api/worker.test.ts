import { describe, expect, it, vi, beforeEach } from "vitest";
import app from "../../src/worker";

const mockSelect = vi.fn();
const mockOrder = vi.fn();
const mockFrom = vi.fn(() => ({
	select: mockSelect,
}));

vi.mock("@supabase/supabase-js", () => ({
	createClient: vi.fn(() => ({
		from: mockFrom,
	})),
}));

describe("GET /api/health", () => {
	it("returns ok status and service name", async () => {
		const res = await app.request("/api/health");
		const body = await res.json();

		expect(res.status).toBe(200);
		expect(body).toEqual({ ok: true, service: "color-swipe" });
	});
});

describe("GET /api/colors", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns colors from Supabase", async () => {
		const mockColors = [
			{ id: "1", name: "Red", hex: "#FF0000", upvotes: 5, downvotes: 2 },
			{ id: "2", name: "Blue", hex: "#0000FF", upvotes: 3, downvotes: 1 },
		];

		mockOrder.mockResolvedValue({ data: mockColors, error: null });
		mockSelect.mockReturnValue({ order: mockOrder });

		const res = await app.request("/api/colors", {}, {
			SUPABASE_URL: "https://test.supabase.co",
			SUPABASE_KEY: "test-key",
		});
		const body = await res.json();

		expect(res.status).toBe(200);
		expect(body).toEqual(mockColors);
		expect(mockFrom).toHaveBeenCalledWith("colors");
		expect(mockSelect).toHaveBeenCalledWith("*");
		expect(mockOrder).toHaveBeenCalledWith("created_at", { ascending: true });
	});

	it("returns empty array when Supabase is not configured", async () => {
		const res = await app.request("/api/colors", {}, {});
		const body = await res.json();

		expect(res.status).toBe(200);
		expect(body).toEqual([]);
	});
});
