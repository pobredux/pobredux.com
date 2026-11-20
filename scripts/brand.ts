// Writes the logo mark and icons from one geometry. Run from the site folder: bun scripts/brand.ts
import { join } from "node:path";
import sharp from "sharp";

const root = join(import.meta.dir, "..");
const BRAND = "#457cfd";
const BG = "#0c0c0e";
const PATHS = {
  tl: "M338 142H702V282H422V422H282V198A56 56 0 0 1 338 142Z",
  sq: "M742 142H882V282H742Z",
  br: "M742 322H882V546A56 56 0 0 1 826 602H462V462H742Z",
  rp: "M142 462H366A56 56 0 0 1 422 518V882H282V602H142Z",
};

const mark = (fg: string, blue: string) =>
  `<path fill="${fg}" d="${PATHS.tl}"/><path fill="${fg}" d="${PATHS.sq}"/><path fill="${fg}" d="${PATHS.br}"/><path fill="${blue}" d="${PATHS.rp}"/>`;

const markSvg = (fg: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="142 142 740 740">${mark(fg, BRAND)}</svg>`;

const iconSvg = (rounded: boolean) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><rect x="${rounded ? 1 : 0}" y="${rounded ? 1 : 0}" width="${rounded ? 1022 : 1024}" height="${rounded ? 1022 : 1024}" rx="${rounded ? 140 : 0}" fill="${BG}"/><g transform="translate(124.5 124.5) scale(0.7568)">${mark("#ffffff", BRAND)}</g></svg>`;

const png = (svg: string, size: number) => sharp(Buffer.from(svg), { density: 300 }).resize(size, size).png().toBuffer();

await Bun.write(join(root, "static/assets/logo.svg"), markSvg("#ffffff"));
await Bun.write(join(root, "static/assets/logo.png"), await png(markSvg("#ffffff"), 512));
await Bun.write(join(root, "static/assets/icon.png"), await png(iconSvg(false), 512));
await Bun.write(join(root, "static/assets/favicon-32.png"), await png(iconSvg(true), 32));
await Bun.write(join(root, "static/assets/favicon.svg"), iconSvg(true));

// favicon.ico with PNG entries at 16, 32 and 48.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((s) => png(iconSvg(true), s)));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(s, e);
  header.writeUInt8(s, e + 1);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(images[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += images[i].length;
});
await Bun.write(join(root, "static/favicon.ico"), Buffer.concat([header, ...images]));
console.log("wrote logo.svg, logo.png, icon.png, favicon-32.png, favicon.svg, favicon.ico");
