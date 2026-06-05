import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

loadDevVars();

const COLORS = [
  { name: "Sunset Orange", hex: "#FF6B35" },
  { name: "Ocean Blue", hex: "#004E89" },
  { name: "Forest Green", hex: "#2D6A4F" },
  { name: "Lavender", hex: "#9B5DE5" },
  { name: "Coral Pink", hex: "#F15BB5" },
  { name: "Midnight", hex: "#1A1A2E" },
  { name: "Sunshine Yellow", hex: "#FEE440" },
  { name: "Teal", hex: "#00BBB4" },
  { name: "Crimson", hex: "#D00000" },
  { name: "Sage", hex: "#8DB580" },
  { name: "Electric Purple", hex: "#7209B7" },
  { name: "Sky Blue", hex: "#48BFE3" },
  { name: "Burnt Sienna", hex: "#E07A5F" },
  { name: "Mint", hex: "#80FFDB" },
  { name: "Navy", hex: "#001219" },
  { name: "Rose", hex: "#FF70A6" },
  { name: "Amber", hex: "#FFBA08" },
  { name: "Slate", hex: "#6C757D" },
  { name: "Emerald", hex: "#06D6A0" },
  { name: "Wine", hex: "#6A0572" },
];

function loadDevVars() {
  const path = join(import.meta.dirname, "..", ".dev.vars");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  const ref = supabaseUrl ? new URL(supabaseUrl).hostname.split(".")[0] : "";

  if (!supabaseUrl || !supabaseKey) {
    console.error("ERROR: SUPABASE_URL and SUPABASE_KEY not found in .dev.vars");
    console.error("");
    console.error("  Go to Supabase dashboard → Settings → API Keys:");
    console.error("    SUPABASE_URL  = Project URL (https://xxx.supabase.co)");
    console.error("    SUPABASE_KEY  = Publishable key (sb_publishable_...)");
    console.error("");
    console.error("  Then add them to .dev.vars:");
    console.error("    SUPABASE_URL=https://xxx.supabase.co");
    console.error("    SUPABASE_KEY=sb_publishable_...");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { error } = await supabase.from("colors").select("id").limit(1);

  if (error) {
    console.log("");
    console.log("The 'colors' table isn't accessible yet.");
    console.log("Open the SQL Editor, paste the SQL below, and click Run:");
    console.log("");
    console.log(`  https://supabase.com/dashboard/project/${ref}/sql/new`);
    console.log("");
    const sql = readFileSync(join(import.meta.dirname, "schema.sql"), "utf-8");
    sql.split("\n").forEach((l) => console.log(`  ${l}`));
    console.log("");
    console.log("Then re-run: pnpm migrate");
    process.exit(1);
  }

  console.log("Clearing existing data...");
  await supabase.from("colors").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  console.log("Inserting 20 colors...");
  let count = 0;
  for (const color of COLORS) {
    const { error: insertError } = await supabase.from("colors").insert({
      name: color.name,
      hex: color.hex,
      upvotes: 0,
      downvotes: 0,
    });
    if (insertError) {
      console.error(`  FAILED: ${color.name} — ${insertError.message}`);
    } else {
      console.log(`  ✓ ${color.name} (${color.hex})`);
      count++;
    }
  }

  console.log(`\nDone! ${count} colors seeded.`);
  console.log("");
  console.log("Next: set wrangler secrets and deploy:");
  console.log("  pnpm wrangler secret put SUPABASE_URL");
  console.log("  pnpm wrangler secret put SUPABASE_KEY");
  console.log("  pnpm deploy");
}

main();
