import { flushSync } from "svelte";

export type ThemeChoice = "system" | "light" | "dark";

const KEY = "pobredux:theme";
const COLORS = { dark: "#0b0b0c", light: "#fbfaf7" };

function ready(img: HTMLImageElement | null) {
  if (!img || !img.src) return Promise.resolve();
  const wait = img.complete
    ? img.decode().catch(() => {})
    : new Promise<void>((res) => {
        const done = () => img.decode().catch(() => {}).finally(res);
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", () => res(), { once: true });
      });
  return Promise.race([wait, new Promise<void>((res) => setTimeout(res, 200))]);
}

class ThemeState {
  choice = $state<ThemeChoice>("dark");
  #systemLight = $state(false);
  #initialized = false;

  get isLight() {
    return this.choice === "light" || (this.choice === "system" && this.#systemLight);
  }

  init() {
    if (this.#initialized) return;
    this.#initialized = true;
    const t = document.documentElement.dataset.theme;
    this.choice = t === "light" || t === "dark" ? t : "system";
    const mq = matchMedia("(prefers-color-scheme: light)");
    this.#systemLight = mq.matches;
    mq.addEventListener("change", (e) => (this.#systemLight = e.matches));
  }

  #resolved(choice: ThemeChoice) {
    if (choice !== "system") return choice;
    return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  #apply(choice: ThemeChoice) {
    const root = document.documentElement;
    if (choice === "system") delete root.dataset.theme;
    else root.dataset.theme = choice;
    try {
      localStorage.setItem(KEY, choice);
    } catch {}
    for (const m of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
      m.content = COLORS[choice === "system" ? (m.media.includes("light") ? "light" : "dark") : choice];
    }
    this.choice = choice;
    dispatchEvent(new Event("pobredux:theme"));
  }

  set(choice: ThemeChoice) {
    const same = this.#resolved(choice) === this.#resolved(this.choice);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (same || reduce || !document.startViewTransition) {
      this.#apply(choice);
      return;
    }
    document
      .startViewTransition(async () => {
        flushSync(() => this.#apply(choice));
        const active =
          document.querySelector<HTMLImageElement>("dialog.viewer[open] img") ??
          document.querySelector<HTMLImageElement>(".hero img.frame.on");
        await ready(active);
        dispatchEvent(new Event("pobredux:theme"));
      })
      .ready.then(dissolve)
      .catch(() => {});
  }
}

function dissolve() {
  const noise = document.querySelector("#theme-dissolve feTurbulence");
  noise?.setAttribute("seed", String(Math.floor(Math.random() * 1000)));
  document.querySelectorAll<SVGAnimateElement>("#theme-dissolve animate").forEach((a) => a.beginElement());
}

export const theme = new ThemeState();
