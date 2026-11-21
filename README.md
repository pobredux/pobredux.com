# pobredux.com

The marketing page for [PoB Redux](https://github.com/pobredux/pob-redux). SvelteKit with `adapter-static`: every page
is prerendered to plain HTML in `dist/`, then hydrated.

```sh
bun install
bun run dev        # http://localhost:5173
bun run check      # svelte-check, warnings fail
bun run build      # writes dist/
bun run preview    # wrangler dev on dist/, with _headers, _redirects and the 404 page
bun run deploy     # build, then wrangler deploy
```

## Layout

- `src/lib/content.ts` holds the copy: the features, the screenshot captions, install steps and the questions.
  The FAQPage JSON-LD in `src/routes/+page.svelte` is built from the same `FAQ` list, so the page and the
  structured data cannot drift. `src/lib/legal.ts` holds the privacy and code signing pages.
- `src/lib/components/Hero.svelte` is the top of the page: the headline, three chapter lines, Download, and an app
  window that plays a scripted session. A drawn cursor moves and clicks while real captures of the app swap
  underneath, and the window zooms on the result of each step. The chapter lines double as controls: each one
  jumps to its chapter, and the line under the current one fills as it plays.
- `src/lib/demo.ts` holds the script. Each chapter lists steps in app pixels (1520 x 960, the capture size): where
  the cursor clicks, the frame that follows, how long it stays, and an optional box to zoom on before the move
  (`view`) or after the click (`then`). The module compiles each chapter into a timeline, and `at(timeline, t)`
  returns the frame, cursor position and camera for any moment, so pausing and jumping need no extra state.
- Playback stops while the window is off screen, the tab is hidden or the screenshot viewer is open, and waits
  for the next frame to load. With reduced motion the window shows one still per chapter, with no cursor, until
  the visitor presses Play.
- An inline script in `src/app.html` sets `data-os`, `data-arch` and the saved theme before the first paint. CSS
  uses `data-os` to show one download group, so the hero does not shift.
- `src/lib/release.svelte.ts` asks the GitHub API for the latest release (cached 10 minutes in `localStorage`) and
  points the download buttons at the Windows installer, the AppImage, `.deb` and `.rpm` for the visitor's
  architecture, and the macOS `.dmg`. Without JavaScript, or if the API fails, every button links to the latest
  release page.
- The site starts in Dark. The header theme switch saves System, Light or Dark in `localStorage` (`pobredux:theme`);
  only System follows the operating system. A change
  runs in a view transition through the `#theme-dissolve` SVG filter, and switches instantly with reduced motion,
  without view transition support, or when the visible theme does not change.
- `src/routes/404` prerenders with no JavaScript. Cloudflare serves it for unknown paths (`not_found_handling` in
  `wrangler.jsonc`). `privacy` and `code-signing` use the same header as the home page.
- `html` reserves the scrollbar gutter (`scrollbar-gutter: stable`), so the header does not move between pages that
  scroll and pages that fit the window.

## Assets

`static/` is copied into `dist/` as is. Keep these paths: the Path of Exile forum thread embeds
`/assets/forum/*`, and the app updater follows `/update/latest.json` in `static/_redirects`.

- `bun scripts/brand.ts` writes the logo, icons and favicons from the same geometry as the app's `LogoMark.svelte`.
- `bun scripts/shots.ts <folder> [--light]` writes each screenshot at 1840, 1200 and 800 px from PNG captures named
  `overview.png`, `tree.png` and so on (`--light` writes to `static/assets/shots/light/`).
- `bun scripts/demo.ts <folder> [--light]` writes the hero frames to `static/assets/demo/` (or `demo/light/`) at 2560, 1840 and 1200 px from
  PNG captures named `follow-1.png`, `theory-1.png` and so on. Capture them from the app at 1520 x 960 with a
  device scale of 2. If a frame changes, check the click points and zoom boxes in `src/lib/demo.ts`.
- `bun scripts/crops.ts <folder>` writes the `row-*` detail crops; the crop boxes are in the script.
- `bun scripts/og.ts` renders the Open Graph cards with Takumi: `static/assets/og.png` from `scripts/og-shot.jpg`, and `og-privacy.png` and `og-code-signing.png` from `src/lib/legal.ts`. All three use a halftone of `bw-divine.png`, like the hero background.
- `static/llms.txt` is a plain-text summary for AI search tools, and `static/sitemap.xml` lists the pages and
  screenshots. Update both when the features or the screenshots change.

## Hosting

A Cloudflare Worker with static assets from `dist/`. The custom domain `pobredux.com` is attached to the Worker;
`www` is a proxied placeholder record with a zone redirect rule to the root.
