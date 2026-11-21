export const APP_W = 1520;
export const APP_H = 960;

export type Pt = [x: number, y: number];
export type Box = [x: number, y: number, w: number, h: number];

interface Step {
  at: Pt;
  frame: string;
  hold: number;
  view?: Box | null;
  then?: Box | null;
  paste?: boolean;
}

interface Chapter {
  id: string;
  label: string;
  alt: string;
  slide: string;
  still: string;
  start: string;
  steps: Step[];
}

// Coordinates are app pixels in a 1520 x 960 window, the size the frames were captured at.
export const CHAPTERS: Chapter[] = [
  {
    id: "follow",
    label: "Follow other players' builds.",
    alt: "PoB Redux importing Fubgun's Flameblast build from a Mobalytics link",
    slide: "overview",
    still: "follow-3",
    start: "follow-1",
    steps: [
      { view: [1060, 40, 455, 200], at: [1285, 126], frame: "follow-2", hold: 700, paste: true },
      { at: [1100, 197], frame: "follow-3", hold: 1300, then: [470, 260, 580, 430] },
      { at: [1001, 350], frame: "follow-4", hold: 2400, then: [313, 52, 706, 280] },
    ],
  },
  {
    id: "theory",
    label: "Theorycraft your own.",
    alt: "PoB Redux ranking passives with Power, then allocating Ignite Duration for 6.6% more DPS",
    slide: "tree",
    still: "theory-4",
    start: "follow-4",
    steps: [
      { at: [481, 19], frame: "theory-1", hold: 800 },
      { at: [949, 87], frame: "theory-2", hold: 1300 },
      { at: [1276, 86], frame: "theory-3", hold: 900, then: [1100, 110, 420, 330] },
      { at: [1155, 220], frame: "theory-4", hold: 1900, then: [820, 470, 480, 320] },
      { at: [907, 521], frame: "theory-5", hold: 2600, then: [0, 150, 960, 420] },
    ],
  },
  {
    id: "learn",
    label: "Compare builds.",
    alt: "PoB Redux comparing the changed build with the original, then finding gear upgrades with Optimize",
    slide: "optimize",
    still: "learn-4",
    start: "theory-5",
    steps: [
      { at: [1025, 19], frame: "learn-1", hold: 500 },
      { at: [545, 54], frame: "learn-2", hold: 500 },
      { at: [882, 102], frame: "learn-3", hold: 600, paste: true },
      { at: [1474, 102], frame: "learn-4", hold: 2400, then: [300, 30, 1220, 200] },
      { at: [941, 19], frame: "learn-5", hold: 700, then: null },
      { at: [804, 256], frame: "learn-6", hold: 3000, then: [740, 270, 560, 340] },
    ],
  },
];

export const FRAMES = [...new Set(CHAPTERS.flatMap((c) => [c.start, ...c.steps.map((s) => s.frame)]))];

export const frameSrc = (id: string, light = false) => {
  const dir = light ? "/assets/demo/light" : "/assets/demo";
  return {
    src: `${dir}/${id}-1840.webp`,
    srcset: `${dir}/${id}-1200.webp 1200w, ${dir}/${id}-1840.webp 1840w, ${dir}/${id}.webp 2560w`,
  };
};

export interface Cam {
  s: number;
  x: number;
  y: number;
}

const MAX_ZOOM = 1.6;
const FILL = 0.9;
const CAM_MS = 900;
const PRESS_MS = 170;
const PASTE_MS = 350;
const START_MS = 600;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export function camera(box: Box | null): Cam {
  if (!box) return { s: 1, x: 0, y: 0 };
  const [bx, by, bw, bh] = box;
  const s = clamp(Math.min(APP_W / bw, APP_H / bh) * FILL, 1, MAX_ZOOM);
  const cx = (bx + bw / 2) / APP_W;
  const cy = (by + bh / 2) / APP_H;
  return { s, x: clamp(50 - cx * s * 100, 100 - 100 * s, 0), y: clamp(50 - cy * s * 100, 100 - 100 * s, 0) };
}

interface Timeline {
  duration: number;
  frames: { t: number; id: string }[];
  moves: { t0: number; t1: number; from: Pt; to: Pt }[];
  presses: { t: number; at: Pt }[];
  cams: { t: number; cam: Cam }[];
  start: { pos: Pt; cam: Cam };
}

function compile(c: Chapter, pos: Pt, cam: Cam): Timeline {
  const full = camera(null);
  const tl: Timeline = { duration: 0, frames: [{ t: 0, id: c.start }], moves: [], presses: [], cams: [{ t: 0, cam: full }], start: { pos, cam } };
  let t = START_MS;
  for (const s of c.steps) {
    if (s.view !== undefined) {
      tl.cams.push({ t, cam: camera(s.view) });
      t += CAM_MS * 0.6;
    }
    const dist = Math.hypot(s.at[0] - pos[0], s.at[1] - pos[1]);
    const dur = clamp(320 + dist * 0.55, 450, 1000);
    tl.moves.push({ t0: t, t1: t + dur, from: pos, to: s.at });
    t += dur + 120;
    tl.presses.push({ t, at: s.at });
    t += PRESS_MS + (s.paste ? PASTE_MS : 0);
    tl.frames.push({ t, id: s.frame });
    if (s.then !== undefined) tl.cams.push({ t: t + 250, cam: camera(s.then) });
    t += s.hold;
    pos = s.at;
  }
  tl.duration = t;
  return tl;
}

function camAt(tl: Timeline, t: number): Cam {
  let from = tl.start.cam;
  let to: Cam | null = null;
  let t0 = 0;
  for (const k of tl.cams) {
    if (k.t > t) break;
    if (to) from = to;
    to = k.cam;
    t0 = k.t;
  }
  if (!to) return from;
  const p = ease(clamp((t - t0) / CAM_MS, 0, 1));
  return { s: lerp(from.s, to.s, p), x: lerp(from.x, to.x, p), y: lerp(from.y, to.y, p) };
}

function endCam(tl: Timeline) {
  return tl.cams.length ? tl.cams[tl.cams.length - 1].cam : tl.start.cam;
}

export const TIMELINES: Timeline[] = (() => {
  const out: Timeline[] = [];
  let pos: Pt = [760, 560];
  let cam = camera(null);
  for (const c of CHAPTERS) {
    const tl = compile(c, pos, cam);
    out.push(tl);
    pos = c.steps[c.steps.length - 1].at;
    cam = endCam(tl);
  }
  out[0].start.pos = pos;
  out[0].moves[0].from = pos;
  return out;
})();

export interface Shot {
  frame: string;
  prev: string | null;
  next: string | null;
  pos: Pt;
  cam: Cam;
  press: number;
  pressAt: Pt | null;
}

export function at(tl: Timeline, t: number): Shot {
  let i = 0;
  while (i + 1 < tl.frames.length && tl.frames[i + 1].t <= t) i++;
  let pos = tl.start.pos;
  for (const m of tl.moves) {
    if (t >= m.t1) pos = m.to;
    else if (t > m.t0) {
      const p = ease((t - m.t0) / (m.t1 - m.t0));
      pos = [lerp(m.from[0], m.to[0], p), lerp(m.from[1], m.to[1], p)];
      break;
    } else break;
  }
  let press = -1;
  tl.presses.forEach((p, k) => {
    if (t >= p.t && t < p.t + 600) press = k;
  });
  return {
    frame: tl.frames[i].id,
    prev: i > 0 ? tl.frames[i - 1].id : null,
    next: tl.frames[i + 1]?.id ?? null,
    pos,
    cam: camAt(tl, t),
    press,
    pressAt: press >= 0 ? tl.presses[press].at : null,
  };
}

export const isDown = (tl: Timeline, t: number) => tl.presses.some((p) => t >= p.t && t < p.t + PRESS_MS);
