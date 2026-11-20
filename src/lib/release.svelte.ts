import { REPO_URL } from "./content.js";

export const RELEASES_URL = `${REPO_URL}/releases`;
export const LATEST_URL = `${RELEASES_URL}/latest`;

const API = "https://api.github.com/repos/pobredux/pob-redux/releases/latest";
const CACHE_KEY = "pobredux:release";
const CACHE_TTL = 10 * 60 * 1000;

interface Asset {
  name: string;
  size: number;
  url: string;
}

interface Release {
  tag: string;
  url: string;
  published: string | null;
  assets: Asset[];
}

type Arch = "x64" | "arm64";

export type Kind = "exe" | "dmg" | "appimage" | "deb" | "rpm" | "appimage-other" | "deb-other" | "rpm-other";

interface Pattern {
  re: RegExp;
  label: string;
}

const LINUX: Record<Arch, Record<"appimage" | "deb" | "rpm", Pattern>> = {
  x64: {
    appimage: { re: /_amd64\.AppImage$/i, label: "AppImage, amd64" },
    deb: { re: /_amd64\.deb$/i, label: "Debian package, amd64" },
    rpm: { re: /\.x86_64\.rpm$/i, label: "RPM package, x86_64" },
  },
  arm64: {
    appimage: { re: /_aarch64\.AppImage$/i, label: "AppImage, arm64" },
    deb: { re: /_arm64\.deb$/i, label: "Debian package, arm64" },
    rpm: { re: /\.aarch64\.rpm$/i, label: "RPM package, aarch64" },
  },
};

const ARCH_NAME: Record<Arch, string> = { x64: "x86_64", arm64: "ARM64" };

function readCache(): Release | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw);
    return c && Date.now() - c.at < CACHE_TTL ? c.data : null;
  } catch {
    return null;
  }
}

function writeCache(data: Release) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch {}
}

const mb = (bytes: number) => `${Math.round(bytes / 1048576)} MB`;

class ReleaseState {
  data = $state<Release | null>(null);
  arch = $state<Arch>("x64");

  #find(re: RegExp) {
    return this.data?.assets.find((a) => re.test(a.name)) ?? null;
  }

  get linuxArch(): Arch {
    return this.#find(LINUX[this.arch].appimage.re) ? this.arch : "x64";
  }

  get otherArch(): Arch {
    return this.linuxArch === "x64" ? "arm64" : "x64";
  }

  get otherArchName() {
    return ARCH_NAME[this.otherArch];
  }

  get hasOtherArch() {
    return this.#find(LINUX[this.otherArch].appimage.re) !== null;
  }

  #pattern(kind: Kind): Pattern {
    if (kind === "exe") return { re: /-setup\.exe$/i, label: "x64 installer" };
    if (kind === "dmg") return { re: /\.dmg$/i, label: "Apple Silicon" };
    if (kind.endsWith("-other")) return LINUX[this.otherArch][kind.replace("-other", "") as "appimage"];
    return LINUX[this.linuxArch][kind as "appimage"];
  }

  href(kind: Kind) {
    return this.#find(this.#pattern(kind).re)?.url ?? LATEST_URL;
  }

  meta(kind: Kind) {
    const p = this.#pattern(kind);
    const a = this.#find(p.re);
    return a ? `${p.label} · ${mb(a.size)}` : p.label;
  }

  get tag() {
    return this.data?.tag ?? null;
  }

  get url() {
    return this.data?.url ?? LATEST_URL;
  }

  get date() {
    if (!this.data?.published) return null;
    return new Date(this.data.published).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  }

  async load() {
    this.arch = document.documentElement.dataset.arch === "arm64" ? "arm64" : "x64";
    const cached = readCache();
    if (cached) {
      this.data = cached;
      return;
    }
    try {
      const r = await fetch(API, { headers: { Accept: "application/vnd.github+json" } });
      if (!r.ok) return;
      const d = await r.json();
      const data: Release = {
        tag: d.tag_name,
        url: d.html_url,
        published: d.published_at,
        assets: (d.assets ?? []).map((a: { name: string; size: number; browser_download_url: string }) => ({
          name: a.name,
          size: a.size,
          url: a.browser_download_url,
        })),
      };
      writeCache(data);
      this.data = data;
    } catch {}
  }
}

export const release = new ReleaseState();
