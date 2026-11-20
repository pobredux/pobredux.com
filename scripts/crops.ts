// Writes static/assets/shots/row-<name>.webp (and -700) detail crops for the feature rows from 2x app captures.
// Run from the site folder: bun scripts/crops.ts <folder with the 2x PNG captures>; missing captures are skipped.
import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const src = process.argv[2];
if (!src) throw new Error("usage: bun scripts/crops.ts <capture folder>");
const out = join(import.meta.dir, "..", "static", "assets", "shots");

// [capture, left, top, width, height] in capture pixels, each 4:3. themes-row is a 1100x825 viewport, assistant-row has the panel at 700 px.
const CROPS: Record<string, [string, number, number, number, number]> = {
  power: ["power", 1000, 130, 1600, 1200],
  optimize: ["optimize", 1490, 534, 1520, 1140],
  assistant: ["assistant-row", 1643, 147, 1397, 1048],
  themes: ["themes-row", 1048, 430, 1100, 825],
  games: ["poe1", 360, 0, 2400, 1800],
};

for (const [name, [file, left, top, width, height]] of Object.entries(CROPS)) {
  if (!existsSync(join(src, `${file}.png`))) continue;
  for (const [w, suffix] of [[1200, ""], [700, "-700"]] as const) {
    const info = await sharp(join(src, `${file}.png`))
      .extract({ left, top, width, height })
      .resize({ width: Math.min(w, width) })
      .webp({ quality: 84 })
      .toFile(join(out, `row-${name}${suffix}.webp`));
    console.log(`row-${name}${suffix}.webp`, info.width, "x", info.height, Math.round(info.size / 1024), "KB");
  }
}
