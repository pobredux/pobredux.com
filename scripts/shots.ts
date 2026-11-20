// Writes static/assets/shots/<name>.webp (1840 px) plus -1200 and -800 copies from PNG captures of the app.
// Run from the site folder: bun scripts/shots.ts <folder with tree.png, items.png, ...>
import { readdirSync } from "node:fs";
import { basename, join } from "node:path";
import sharp from "sharp";

const src = process.argv[2];
if (!src) throw new Error("usage: bun scripts/shots.ts <capture folder>");
const out = join(import.meta.dir, "..", "static", "assets", "shots");

for (const file of readdirSync(src).filter((f) => f.endsWith(".png"))) {
  const name = basename(file, ".png");
  for (const [width, suffix] of [[1840, ""], [1200, "-1200"], [800, "-800"]] as const) {
    const info = await sharp(join(src, file)).resize({ width }).webp({ quality: 82 }).toFile(join(out, `${name}${suffix}.webp`));
    console.log(`${name}${suffix}.webp`, info.width, "x", info.height, Math.round(info.size / 1024), "KB");
  }
}
