// Renders the 1200x630 Open Graph cards in static/assets with Takumi. Run from the site folder: bun scripts/og.ts
import { join } from "node:path";
import sharp from "sharp";
import { render } from "takumi-js";
import { CODE_SIGNING, PRIVACY, type LegalPage } from "../src/lib/legal.ts";

const root = join(import.meta.dir, "..");
const bytes = (p: string) => Bun.file(join(root, p)).bytes();
const dataUrl = async (p: string, mime: string) => `data:${mime};base64,${Buffer.from(await bytes(p)).toString("base64")}`;

const logo = await dataUrl("static/assets/logo.png", "image/png");
const shot = await dataUrl("scripts/og-shot.jpg", "image/jpeg");
const mono = await bytes("static/assets/fonts/geist-mono-latin-wght-normal.woff2");

// Same mapping as the dot field in Backdrop.svelte: brighter statue pixels get bigger dots.
async function halftone(size: number, cells: number) {
  const { data } = await sharp(join(root, "static/assets/bw-divine.png"))
    .resize(cells, cells, { kernel: "lanczos3" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const step = size / cells;
  let dots = "";
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const i = (y * cells + x) * 4;
      const l = ((0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255) * (data[i + 3] / 255);
      const t = Math.min(1, Math.max(0, (l - 0.1) / 0.75));
      const r = 0.45 * step * t * t * (3 - 2 * t);
      if (r > 0.4) dots += `<circle cx="${((x + 0.5) * step).toFixed(1)}" cy="${((y + 0.5) * step).toFixed(1)}" r="${r.toFixed(2)}"/>`;
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><g fill="#a9b0c8">${dots}</g></svg>`;
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return `data:image/png;base64,${png.toString("base64")}`;
}

const face = await halftone(720, 96);

const brand = `
  <div style="display:flex;align-items:center;gap:12px">
    <img src="${logo}" width="22" height="22" />
    <div style="display:flex;font-size:16px;letter-spacing:0.14em">
      <span style="font-weight:600;color:#f2f2f4">POB</span>
      <span style="width:8px"></span>
      <span style="font-weight:400;color:#80808a">REDUX</span>
    </div>
  </div>`;

const glow = "background-image:radial-gradient(circle at 22% 38%, #141b38 0%, #0b0b0c 62%)";
const pill = "display:flex;align-items:center;height:28px;padding:0 12px;border:1px solid #27272d;border-radius:4px;background:#151518;color:#b9b9c1";
const site = (path = "") => `
  <div style="display:flex;align-items:center;gap:8px">
    <div style="width:6px;height:6px;border-radius:3px;background:#67d38a"></div>
    <span>pobredux.com${path ? `/${path}` : ""}</span>
  </div>`;

const home = `
<div style="display:flex;width:100%;height:100%;background:#0b0b0c;${glow};position:relative;overflow:hidden;font-family:Geist">
  <img src="${face}" width="720" height="720" style="position:absolute;left:-150px;top:-40px;opacity:0.2" />
  <div style="display:flex;flex-direction:column;justify-content:space-between;width:600px;height:100%;padding:56px 0 56px 64px">
    ${brand}
    <div style="display:flex;flex-direction:column;gap:20px;width:520px">
      <div style="font-size:12px;font-weight:600;letter-spacing:0.14em;color:#80808a">PATH OF EXILE 1 &amp; 2 BUILD PLANNER</div>
      <div style="font-size:58px;font-weight:500;letter-spacing:-0.02em;line-height:1.04;color:#f2f2f4">Path of Building, built for modern times.</div>
      <div style="font-size:22px;line-height:1.4;color:#b9b9c1">Runs Path of Building Community's own engine, so every number matches.</div>
    </div>
    <div style="display:flex;align-items:center;gap:10px;font-family:'Geist Mono';font-size:14px;color:#80808a">
      <div style="${pill}">Windows</div>
      <div style="${pill}">Linux</div>
      <div style="${pill}">macOS</div>
      <div style="display:flex;margin-left:14px">${site()}</div>
    </div>
  </div>
  <div style="position:absolute;left:664px;top:72px;width:760px;height:600px;border:1px solid #27272d;border-radius:6px;overflow:hidden;background:#0b0b0c;display:flex">
    <img src="${shot}" width="1050" height="683" />
  </div>
</div>`;

const legal = (page: LegalPage) => `
<div style="display:flex;width:100%;height:100%;background:#0b0b0c;${glow};position:relative;overflow:hidden;font-family:Geist">
  <img src="${face}" width="720" height="720" style="position:absolute;left:560px;top:-45px;opacity:0.45" />
  <div style="display:flex;flex-direction:column;justify-content:space-between;width:680px;height:100%;padding:56px 0 56px 64px">
    ${brand}
    <div style="display:flex;flex-direction:column;gap:20px;width:600px">
      <div style="font-size:12px;font-weight:600;letter-spacing:0.14em;color:#80808a">${page.note.toUpperCase()}</div>
      <div style="font-size:64px;font-weight:500;letter-spacing:-0.025em;line-height:1.04;color:#f2f2f4">${page.title}</div>
      <div style="font-size:22px;line-height:1.4;color:#b9b9c1">${page.description}</div>
    </div>
    <div style="display:flex;font-family:'Geist Mono';font-size:14px;color:#80808a">${site(page.path)}</div>
  </div>
</div>`;

const cards: [string, string][] = [
  ["og.png", home],
  [`og-${PRIVACY.path}.png`, legal(PRIVACY)],
  [`og-${CODE_SIGNING.path}.png`, legal(CODE_SIGNING)],
];

for (const [name, html] of cards) {
  const png = await render(html, { width: 1200, height: 630, format: "png", fonts: [mono] });
  await Bun.write(join(root, "static/assets", name), png);
  console.log(`wrote static/assets/${name}`, png.byteLength, "bytes");
}
