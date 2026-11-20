// Writes static/assets/demo/<name>.webp (2560 px) plus -1840 and -1200 copies of the hero simulation frames.
// Run from the site folder: bun scripts/demo.ts <folder with follow-1.png, theory-1.png, ...>
import { mkdirSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import sharp from "sharp";

const src = process.argv[2];
if (!src) throw new Error("usage: bun scripts/demo.ts <capture folder>");
const out = join(import.meta.dir, "..", "static", "assets", "demo");
mkdirSync(out, { recursive: true });

for (const file of readdirSync(src).filter((f) => f.endsWith(".png"))) {
  const name = basename(file, ".png");
  for (const [width, suffix] of [[2560, ""], [1840, "-1840"], [1200, "-1200"]] as const) {
    const info = await sharp(join(src, file)).resize({ width }).webp({ quality: 80 }).toFile(join(out, `${name}${suffix}.webp`));
    console.log(`${name}${suffix}.webp`, info.width, "x", info.height, Math.round(info.size / 1024), "KB");
  }
}
