# Color Swipe Part 2: Testing & CI/CD Workshop

## Prerequisites

- Completed Part 1 (Color Swipe app deployed to Cloudflare Workers)
- Node.js + pnpm installed
- Docker Desktop or OrbStack installed
- GitHub account
- Your fork of this repository

---

## Step 1: Set up the Part 2 workspace

```bash
cd part-2/apps/web
pnpm install
```

This installs the new test dependencies (Vitest, Playwright) alongside the existing app dependencies.

Verify the app still runs:

```bash
pnpm dev
```

Checkpoint:

- The React app opens at `localhost:5173`
- Colors load from Supabase (if you completed Part 1 Step 3+)

---

## Step 2: Write API unit tests

We use **Vitest** to test the Hono API routes. Tests run in Node.js — no server needed.

### 2a. Test the health endpoint

Open `tests/api/worker.test.ts`. The first test checks the `/api/health` route:

```ts
import { describe, expect, it, vi, beforeEach } from "vitest";
import app from "../../src/worker";

// Mock Supabase so tests don't need a real database
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
```

Key concepts:

- `app.request()` is Hono's built-in test helper — it simulates an HTTP request without starting a server
- `vi.mock()` replaces the Supabase client with a mock so tests run fast and don't need network access
- `describe` and `it` group and define individual test cases

### 2b. Test the colors endpoint

Add a second `describe` block to the same file:

```ts
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
  });

  it("returns empty array when Supabase is not configured", async () => {
    const res = await app.request("/api/colors", {}, {});
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual([]);
  });
});
```

Key concepts:

- The third argument to `app.request()` passes environment bindings (like `c.env` in the worker)
- `beforeEach` + `vi.clearAllMocks()` resets mock state between tests
- We test both the happy path (Supabase configured) and the edge case (no credentials)

### 2c. Run the tests

```bash
pnpm test
```

Checkpoint:

- All 3 tests pass
- Output shows `✓ GET /api/health > returns ok status and service name`
- Output shows `✓ GET /api/colors > returns colors from Supabase`
- Output shows `✓ GET /api/colors > returns empty array when Supabase is not configured`

---

## Step 3: Write API client tests

The `src/lib/api.ts` file has helper functions that the React components use to call the API. Let's test the simplest one: `imageUrl`.

Open `tests/client/api.test.ts`:

```ts
import { describe, expect, it } from "vitest";
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
```

Run all tests again:

```bash
pnpm test
```

Checkpoint:

- All 5 tests pass (3 API + 2 client)

---

## Step 4: Write a Playwright E2E smoke test

Playwright runs a real browser against a real server. Our smoke test:

1. Opens the app
2. Waits for a color card to appear
3. Swipes right (like) once

Open `tests/e2e/smoke.test.ts`:

```ts
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
```

Key concepts:

- `page.goto("/")` navigates to the app
- `waitForSelector` waits for the UI to render before interacting
- `boundingBox` + mouse actions simulate a real drag/swipe gesture
- The `webServer` config in `playwright.config.ts` automatically starts `pnpm dev` before tests

### 4a. Install Playwright browsers

```bash
pnpm exec playwright install --with-deps chromium
```

### 4b. Run the E2E test

```bash
pnpm test:e2e
```

Checkpoint:

- Playwright opens a browser window
- The Color Swipe app loads
- A color card is swiped off-screen
- Test passes

---

## Step 5: Set up CI/CD with GitHub Actions

Now let's automate all of this. Every time you push code, GitHub Actions will run your tests and deploy to Cloudflare.

### 5a. Open the workflow template

Open `.github/workflows/deploy-color-swipe.yml` in the repo root. It has `____` blanks for you to fill in.

### 5b. Fill in the triggers

Replace the `____` in the `on:` section:

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

This means:
- **Push to main**: runs tests + deploys
- **Pull request**: runs tests only (deploy is gated later)

### 5c. Fill in the test steps

Replace the `____` in the test job:

```yaml
      - name: Run tests
        run: pnpm test

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps chromium

      - name: Run E2E tests
        run: pnpm test:e2e
```

### 5d. Fill in the deploy condition and step

Replace the `____` in the deploy job:

```yaml
    if: github.ref == 'refs/heads/main'
```

This ensures the deploy job only runs on pushes to `main`, not on PRs.

```yaml
      - name: Deploy
        run: pnpm deploy
```

### 5e. Commit and push the workflow

```bash
git add .github/workflows/deploy-color-swipe.yml
git commit -m "ci: add CI/CD pipeline for color-swipe"
git push
```

---

## Step 6: Configure GitHub secrets

Your workflow needs credentials to deploy. Add them as repository secrets:

1. Go to your fork on GitHub → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** and add each one:

| Secret name | Value | Where to get it |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | API token with Workers deploy permissions | [Cloudflare dashboard → My Profile → API Tokens](https://dash.cloudflare.com/profile/api-tokens) → Create Token → Edit Cloudflare Workers → Use template |
| `SUPABASE_URL` | Your Supabase project URL | Supabase dashboard → Settings → API |
| `SUPABASE_KEY` | Your Supabase publishable key | Supabase dashboard → Settings → API |

Checkpoint:

- All three secrets are configured in GitHub

---

## Step 7: Trigger the pipeline

Push a change to `main` (or merge a PR):

```bash
git add -A
git commit -m "feat: add tests and CI/CD pipeline"
git push origin main
```

Then go to your fork on GitHub → **Actions** tab.

Checkpoint:

- The workflow appears in the Actions tab
- The `test` job runs and all tests pass
- The `deploy` job runs and deploys to Cloudflare Workers
- Your app is live at the same `workers.dev` URL from Part 1

---

## Scripts reference

| Command | What it does | Needs |
|---|---|---|
| `pnpm test` | Run Vitest (API + client tests) | - |
| `pnpm test:watch` | Run Vitest in watch mode | - |
| `pnpm test:e2e` | Run Playwright E2E tests | Playwright browsers installed |
| `pnpm exec playwright install --with-deps chromium` | Install Playwright browsers | - |
| `pnpm dev` | Start Vite dev server | - |
| `pnpm deploy` | Build + deploy to Workers | wrangler logged in |
