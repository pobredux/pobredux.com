// Renders static/assets/og.png (1200x630) with Takumi. Run from the site folder: bun scripts/og.ts
import { join } from "node:path";
import { render } from "takumi-js";

const root = join(import.meta.dir, "..");
const bytes = (p: string) => Bun.file(join(root, p)).bytes();
const dataUrl = async (p: string, mime: string) => `data:${mime};base64,${Buffer.from(await bytes(p)).toString("base64")}`;

const logo = await dataUrl("static/assets/logo.png", "image/png");
const shot = await dataUrl("scripts/og-shot.jpg", "image/jpeg");
const mono = await bytes("static/assets/fonts/geist-mono-latin-wght-normal.woff2");

const pill = "display:flex;align-items:center;height:28px;padding:0 12px;border:1px solid #27272d;border-radius:4px;background:#151518;color:#b9b9c1";

const html = `
<div style="display:flex;width:100%;height:100%;background:#0b0b0c;position:relative;overflow:hidden;font-family:Geist">
  <div style="display:flex;flex-direction:column;justify-content:space-between;width:600px;height:100%;padding:56px 0 56px 64px">
    <div style="display:flex;align-items:center;gap:12px">
      <img src="${logo}" width="22" height="22" />
      <div style="display:flex;font-size:16px;letter-spacing:0.14em">
        <span style="font-weight:600;color:#f2f2f4">POB</span>
        <span style="width:8px"></span>
        <span style="font-weight:400;color:#80808a">REDUX</span>
      </div>
    </div>
    <div style="display:flex;flex-direction:column;gap:20px;width:520px">
      <div style="font-size:12px;font-weight:600;letter-spacing:0.14em;color:#80808a">PATH OF EXILE 1 &amp; 2 BUILD PLANNER</div>
      <div style="font-size:58px;font-weight:500;letter-spacing:-0.02em;line-height:1.04;color:#f2f2f4">Path of Building, built for modern times.</div>
      <div style="font-size:22px;line-height:1.4;color:#b9b9c1">Runs Path of Building Community's own engine, so every number matches.</div>
    </div>
    <div style="display:flex;align-items:center;gap:10px;font-family:'Geist Mono';font-size:14px;color:#80808a">
      <div style="${pill}">Windows</div>
      <div style="${pill}">Linux</div>
      <div style="${pill}">macOS</div>
      <div style="display:flex;align-items:center;gap:8px;margin-left:14px">
        <div style="width:6px;height:6px;border-radius:3px;background:#67d38a"></div>
        <span>pobredux.com</span>
      </div>
    </div>
  </div>
  <div style="position:absolute;left:664px;top:72px;width:760px;height:600px;border:1px solid #27272d;border-radius:6px;overflow:hidden;background:#0b0b0c;display:flex">
    <img src="${shot}" width="1050" height="683" />
  </div>
</div>`;

const png = await render(html, { width: 1200, height: 630, format: "png", fonts: [mono] });
await Bun.write(join(root, "static/assets/og.png"), png);
console.log("wrote static/assets/og.png", png.byteLength, "bytes");
