import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";

type Bindings = {
  ASSETS: { fetch: typeof fetch };
  SUPABASE_URL?: string;
  SUPABASE_KEY?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/api/health", (c) => {
  return c.json({ ok: true, service: "color-swipe" });
});

app.get("/api/colors", async (c) => {
  const { SUPABASE_URL, SUPABASE_KEY } = c.env;
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return c.json([], 200);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data, error } = await supabase
    .from("colors")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

app.post("/api/vote", async (c) => {
  const { SUPABASE_URL, SUPABASE_KEY } = c.env;
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return c.json({ ok: true });
  }

  const { colorId, direction } = await c.req.json<{
    colorId: string;
    direction: "up" | "down";
  }>();

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const column = direction === "up" ? "upvotes" : "downvotes";

  const { error } = await supabase.rpc("increment_vote", {
    color_id: colorId,
    column_name: column,
  });

  if (error) {
    const { data: current } = await supabase
      .from("colors")
      .select("*")
      .eq("id", colorId)
      .single();

    if (!current) return c.json({ error: "Color not found" }, 404);

    const count = (current as Record<string, number>)[column] + 1;
    const { error: updateError } = await supabase
      .from("colors")
      .update({ [column]: count })
      .eq("id", colorId);

    if (updateError) return c.json({ error: updateError.message }, 500);
    return c.json({ ok: true });
  }

  return c.json({ ok: true });
});

app.get("/api/results", async (c) => {
  const { SUPABASE_URL, SUPABASE_KEY } = c.env;
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return c.json([], 200);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data, error } = await supabase
    .from("colors")
    .select("*")
    .order("upvotes", { ascending: false });

  if (error) return c.json({ error: error.message }, 500);
  return c.json(data);
});

app.get("/api/images/:key", async (c) => {
  const { SUPABASE_URL, SUPABASE_KEY } = c.env;
  if (!SUPABASE_URL || !SUPABASE_KEY) return c.notFound();

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data, error } = await supabase.storage
    .from("color-swipe-images")
    .download(`colors/${c.req.param("key")}`);

  if (error || !data) return c.notFound();

  return new Response(data, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000",
    },
  });
});

export default app;
