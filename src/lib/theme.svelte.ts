export type ThemeChoice = "system" | "light" | "dark";

const KEY = "pobredux:theme";
const COLORS = { dark: "#0b0b0c", light: "#fbfaf7" };

class ThemeState {
  choice = $state<ThemeChoice>("dark");

  init() {
    const t = document.documentElement.dataset.theme;
    this.choice = t === "light" || t === "dark" ? t : "system";
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
  }

  set(choice: ThemeChoice) {
    const same = this.#resolved(choice) === this.#resolved(this.choice);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (same || reduce || !document.startViewTransition) {
      this.#apply(choice);
      return;
    }
    document
      .startViewTransition(() => this.#apply(choice))
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
