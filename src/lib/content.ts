export type Rich = string | { code: string } | { lang: string; text: string } | { href: string; text: string };

export const plain = (parts: Rich[]) =>
  parts.map((p) => (typeof p === "string" ? p : "code" in p ? p.code : p.text)).join("");

export const REPO_URL = "https://github.com/pobredux/pob-redux";
export const DISCORD_URL = "https://discord.pobredux.com/";
export const ISSUES_URL = `${REPO_URL}/issues`;
export const KOFI_URL = "https://ko-fi.com/ohitsjudd";
export const AUR_URL = "https://aur.archlinux.org/packages/pob-redux-bin";
export const POB_URL = "https://pathofbuilding.community/";

export interface Slide {
  id: string;
  alt: string;
  caption: string;
}

export const SLIDES: Slide[] = [
  {
    id: "overview",
    alt: "The Overview tab of a Flameblast Gemling Legionnaire build, with 15,263,396 DPS, defences, gear and build health",
    caption: "Damage, defences, gear and skills on one page.",
  },
  {
    id: "tree",
    alt: "The passive tree with Power on: red halos for offence, blue for defence",
    caption: "Power shows what each passive is worth.",
  },
  {
    id: "items",
    alt: "The Items tab with the Mageblood tooltip and what removing it changes",
    caption: "PoB's item tooltips, with what each item changes.",
  },
  {
    id: "calcs",
    alt: "The Calcs tab with skill hit damage, ignite and cast rate sections",
    caption: "Every PoB calc section and breakdown.",
  },
  {
    id: "optimize",
    alt: "The Optimize tab with a gear result that adds 1,365,353 DPS and keeps every resistance at 75%",
    caption: "Optimize designs gear from the real mod pool.",
  },
  {
    id: "skills",
    alt: "The Skills tab with socket groups and the DPS each support gem adds",
    caption: "The DPS each gem adds.",
  },
  {
    id: "assistant",
    alt: "The assistant beside the passive tree, with a before and after table and Keep and Undo buttons",
    caption: "Ask about the open build. Keep or undo the change.",
  },
  {
    id: "poe1",
    alt: "The Path of Exile 1 passive tree of a Righteous Fire Chieftain build, with the game menu set to POE1",
    caption: "Path of Exile 1 runs its own Path of Building.",
  },
];

export const FEATURES: { title: string; body: string }[] = [
  { title: "Passive tree", body: "Full-size game art. Power shows what each node is worth." },
  { title: "Optimize", body: "Finds gear and passive upgrades." },
  { title: "Compare", body: "Two builds, stat by stat." },
  { title: "Crafting", body: "Real mod pool. Pick each affix tier." },
  { title: "Trade", body: "Weighted searches for every slot." },
  { title: "Assistant", body: "Optional. Ask about your build, then keep or undo its change." },
  { title: "Imports", body: "pobb.in, Maxroll, Mobalytics, poe.ninja and more." },
  { title: "PoE 1 and 2", body: "Switch games from the title bar." },
  { title: "Your layout", body: "Seven themes, PoE cursors, sections in any order." },
  { title: "MCP server", body: "Claude Code or Cursor can edit the open build." },
  { title: "Windows, macOS, Linux", body: "No Wine needed." },
  { title: "Free", body: "MIT licence. No account." },
];

const LANGS: Rich[] = [
  "English, ",
  { lang: "de", text: "Deutsch" },
  ", ",
  { lang: "es", text: "Español" },
  ", ",
  { lang: "fr", text: "Français" },
  ", ",
  { lang: "ja", text: "日本語" },
  ", ",
  { lang: "ko", text: "한국어" },
  ", ",
  { lang: "pt-BR", text: "Português (Brasil)" },
  ", ",
  { lang: "ru", text: "Русский" },
  " and ",
  { lang: "th", text: "ไทย" },
];

export type Os = "windows" | "mac" | "linux";

export const OS_LABEL: Record<Os, string> = { windows: "Windows", mac: "macOS", linux: "Linux" };

export const INSTALL_STEPS: Record<Exclude<Os, "linux">, Rich[][]> = {
  windows: [["Run the installer."]],
  mac: [
    ["Drag the app from the ", { code: ".dmg" }, " to Applications."],
    ["Open it. macOS blocks the first launch, because the app is not signed yet."],
    ["Open System Settings, then Privacy & Security, and click Open Anyway. On macOS 14 or older, right-click the app and choose Open."],
  ],
};

export const LINUX_PACKAGES: { distro: string; how: Rich[] }[] = [
  { distro: "Arch", how: [{ code: "pob-redux-bin" }, " from the AUR"] },
  { distro: "Fedora, openSUSE", how: [{ code: ".rpm" }] },
  { distro: "Debian, Ubuntu", how: [{ code: ".deb" }] },
  { distro: "Any distribution", how: ["AppImage. Run ", { code: "chmod +x" }, " first."] },
  { distro: "Chromebook", how: ["Turn on Linux in Settings, then open the ", { code: ".deb" }, "."] },
];

export const LINUX_NOTES: Rich[][] = [
  ["Every download comes in x86_64 and ARM64."],
  ["Black window on Mesa? DMA-BUF rendering is off by default. ", { code: "POB_REDUX_GPU=1" }, " turns it on."],
];

export const BUILD_FOLDERS = ["Documents/Path of Building (PoE2)/Builds", "Documents/Path of Building/Builds"];

export const FAQ: { q: string; a: Rich[] }[] = [
  {
    q: "Are the numbers the same as Path of Building?",
    a: ["Yes. PoB Redux runs Path of Building Community's own code, unchanged."],
  },
  {
    q: "Is it free?",
    a: ["Yes. Open source, MIT licence, no account. The assistant is optional and runs on your own AI plan or on Ollama."],
  },
  {
    q: "Does it run on Mac and Linux?",
    a: [
      "Yes, without Wine. macOS 11 or later on Apple Silicon. Linux on x86_64 and ARM64: AppImage, ",
      { code: ".deb" },
      ", ",
      { code: ".rpm" },
      " and AUR.",
    ],
  },
  {
    q: "Path of Exile 1 or 2?",
    a: ["Both. Switch from the title bar. The PoE 1 assistant is in beta."],
  },
  {
    q: "Which builds can I import?",
    a: [
      "Share codes, PoB XML, and links from pobb.in, pob.codes, Maxroll, Mobalytics, poe.ninja, poe2db, poedb, Pastebin and Rentry. Sign in with Path of Exile to import your characters. PoE 2 also opens GGG planner files.",
    ],
  },
  {
    q: "Where are my builds?",
    a: ["In Path of Building's own folders under Documents. Both apps open the same files."],
  },
  {
    q: "Which sites can the assistant read?",
    a: ["Only poe2db, poedb, the two Path of Exile wikis and pathofexile.com. It asks first."],
  },
  {
    q: "Which languages?",
    a: [...LANGS, ". Item, skill and passive names stay in English."],
  },
  {
    q: "Does it update itself?",
    a: [
      "The Windows installer, the macOS app and the AppImage do. The ",
      { code: ".deb" },
      " and ",
      { code: ".rpm" },
      " link to the new download. AUR updates through your AUR helper.",
    ],
  },
];
