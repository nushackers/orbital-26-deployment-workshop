import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

loadDevVars();

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

function generateSvg(name: string, hex: string): string {
  const textColor = isLight(hex) ? "#1a1a1a" : "#ffffff";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
  <rect width="400" height="600" fill="${hex}" rx="20"/>
  <text x="200" y="520" text-anchor="middle" font-family="system-ui, sans-serif" font-size="28" font-weight="700" fill="${textColor}">${name}</text>
  <text x="200" y="555" text-anchor="middle" font-family="monospace" font-size="16" fill="${textColor}" opacity="0.7">${hex}</text>
</svg>`;
}

function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("ERROR: SUPABASE_URL and SUPABASE_KEY not found in .dev.vars");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("Fetching colors from Supabase...");
  const { data: colors, error } = await supabase
    .from("colors")
    .select("id, name, hex");

  if (error || !colors || colors.length === 0) {
    console.error("No colors found. Run pnpm migrate first.");
    process.exit(1);
  }

  for (const color of colors as { id: string; name: string; hex: string }[]) {
    const svg = generateSvg(color.name, color.hex);
    const path = `colors/${color.id}.svg`;

    const { error: uploadError } = await supabase.storage
      .from("color-swipe-images")
      .upload(path, svg, {
        contentType: "image/svg+xml",
        upsert: true,
      });

    if (uploadError) {
      if (uploadError.message.includes("not found")) {
        const ref = new URL(supabaseUrl).hostname.split(".")[0];
        console.log("");
        console.log("The 'color-swipe-images' bucket doesn't exist yet.");
        console.log("Create it here:");
        console.log(`  https://supabase.com/dashboard/project/${ref}/storage/buckets`);
        process.exit(1);
      }
      if (uploadError.message.includes("row-level security")) {
        const ref = new URL(supabaseUrl).hostname.split(".")[0];
        console.log("");
        console.log("The storage bucket needs a policy for uploads.");
        console.log("Add one here:");
        console.log(`  https://supabase.com/dashboard/project/${ref}/storage/buckets`);
        console.log("");
        console.log("  1. Click 'color-swipe-images'");
        console.log("  2. Go to the 'Policies' tab");
        console.log("  3. Create a policy: SELECT + INSERT for everyone");
        process.exit(1);
      }
      console.error(`  FAILED (upload): ${color.name} — ${uploadError.message}`);
      continue;
    }

    const { error: updateError } = await supabase
      .from("colors")
      .update({ image_key: `${color.id}.svg` })
      .eq("id", color.id);

    if (updateError) {
      console.error(`  FAILED (update): ${color.name} — ${updateError.message}`);
    } else {
      console.log(`  ✓ ${color.name} (${color.hex})`);
    }
  }

  console.log(`\nDone! ${colors.length} images uploaded.`);
  console.log("");
  console.log("Deploy to update: pnpm deploy");
}

main();
