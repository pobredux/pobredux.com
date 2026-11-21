<script lang="ts">
  import { onMount } from "svelte";
  import Download from "./Download.svelte";
  import Icon from "./Icon.svelte";
  import Viewer from "./Viewer.svelte";
  import { SLIDES } from "#lib/content.js";
  import { APP_H, APP_W, CHAPTERS, FRAMES, TIMELINES, at, frameSrc, isDown } from "#lib/demo.js";
  import { release } from "#lib/release.svelte.js";
  import { theme } from "#lib/theme.svelte.js";

  let { past = $bindable(false) }: { past?: boolean } = $props();

  const SIZES = "(min-width: 1080px) calc((100vw - 460px) * 1.5), 150vw";
  const pct = (n: number) => `${n.toFixed(3)}%`;

  let chapter = $state(0);
  let t = $state(0);
  let playing = $state(true);
  let reduce = $state(false);
  let started = $state(false);
  let seen = $state(false);
  let hidden = $state(false);
  let viewing = $state(false);
  let viewIndex = $state(0);
  let load = $state(false);
  let ready = $state<Record<string, boolean>>({});
  let stage: HTMLElement;
  let get: HTMLElement;

  const live = $derived(!reduce || started);
  const light = $derived(theme.isLight);
  const frameKey = (id: string) => `${light ? "l" : "d"}:${id}`;
  const tl = $derived(TIMELINES[chapter]);
  const shot = $derived(live ? at(tl, t) : null);
  const frame = $derived(shot?.frame ?? CHAPTERS[chapter].still);
  const prev = $derived(shot?.prev ?? null);
  const cam = $derived(shot?.cam ?? { s: 1, x: 0, y: 0 });
  const down = $derived(live && isDown(tl, t));
  const running = $derived(live && playing && seen && !hidden && !viewing);

  const place = ([x, y]: [number, number]) => ({
    left: pct(cam.x + (x / APP_W) * 100 * cam.s),
    top: pct(cam.y + (y / APP_H) * 100 * cam.s),
  });
  const pointer = $derived(shot ? place(shot.pos) : null);
  const ripple = $derived(shot?.pressAt ? place(shot.pressAt) : null);

  function progress(i: number) {
    if (!live) return 0;
    if (i < chapter) return 1;
    return i === chapter ? Math.min(1, t / tl.duration) : 0;
  }

  function seek(i: number) {
    chapter = i;
    t = 0;
    if (live) playing = true;
  }

  function toggle() {
    if (!live) {
      started = true;
      playing = true;
      t = 0;
      return;
    }
    playing = !playing;
  }

  function openViewer() {
    viewIndex = SLIDES.findIndex((s) => s.id === CHAPTERS[chapter].slide);
    viewing = true;
  }

  $effect(() => {
    if (!running) return;
    let last = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      const dt = Math.min(now - last, 64);
      last = now;
      const s = at(TIMELINES[chapter], t);
      if (ready[frameKey(s.frame)] && (!s.next || ready[frameKey(s.next)])) {
        t += dt;
        if (t >= TIMELINES[chapter].duration) {
          t = 0;
          chapter = (chapter + 1) % CHAPTERS.length;
        }
      }
      raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  });

  $effect(() => {
    void light;
    if (!stage) return;
    for (const img of stage.querySelectorAll<HTMLImageElement>("img[data-frame]")) {
      if (img.complete && img.naturalWidth) ready[frameKey(img.dataset.frame!)] = true;
    }
  });

  onMount(() => {
    theme.init();
    reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    hidden = document.hidden;
    for (const img of stage.querySelectorAll<HTMLImageElement>("img[data-frame]")) {
      if (img.complete && img.naturalWidth) ready[frameKey(img.dataset.frame!)] = true;
    }

    const seeing = new IntersectionObserver(([e]) => (seen = e.isIntersecting), { threshold: 0.2 });
    seeing.observe(stage);
    const passing = new IntersectionObserver(([e]) => (past = !e.isIntersecting && e.boundingClientRect.top < 0));
    passing.observe(get);

    const start = () => (load = true);
    if (document.readyState === "complete") start();
    else addEventListener("load", start, { once: true });

    return () => {
      seeing.disconnect();
      passing.disconnect();
      removeEventListener("load", start);
    };
  });
</script>

<svelte:document onvisibilitychange={() => (hidden = document.hidden)} />

<section class="hero" aria-labelledby="hero-title">
  <h1 id="hero-title">Path of Building, built for modern times.</h1>

  <ol class="chapters">
    {#each CHAPTERS as c, i (c.id)}
      <li style:--p={progress(i)} class:done={live && i < chapter}>
        <button type="button" aria-current={i === chapter ? "step" : undefined} onclick={() => seek(i)}>
          <span class="node" aria-hidden="true"></span>
          <span class="label">{c.label}</span>
        </button>
      </li>
    {/each}
    <li class="more">
      <span class="node" aria-hidden="true"></span>
      &amp; more!
    </li>
  </ol>

  <div class="get" id="download" bind:this={get}>
    <Download />
    <a class="ver mono" class:ready={release.tag !== null} href={release.url}>
      <span class="dot" aria-hidden="true"></span>{release.tag ?? "Latest"}
      {#if release.date}<span class="date">{release.date}</span>{/if}
    </a>
  </div>

  <div class="stage" bind:this={stage}>
    <div class="window" role="img" aria-label={CHAPTERS[chapter].alt}>
      <div class="canvas" style:transform="translate({pct(cam.x)}, {pct(cam.y)}) scale({cam.s.toFixed(4)})">
        {#each FRAMES as id, i (id)}
          {@const src = frameSrc(id, light)}
          <img
            class="frame"
            class:on={id === frame}
            class:prev={live && id === prev}
            data-frame={id}
            src={load || i === 0 ? src.src : undefined}
            srcset={load || i === 0 ? src.srcset : undefined}
            sizes={SIZES}
            alt=""
            width="1520"
            height="960"
            fetchpriority={i === 0 ? "high" : "auto"}
            decoding="async"
            onload={() => (ready[frameKey(id)] = true)}
          />
        {/each}
      </div>
      {#if ripple}
        {#key `${chapter}-${shot?.press}`}
          <span class="ripple" style:left={ripple.left} style:top={ripple.top}></span>
        {/key}
      {/if}
      {#if pointer}
        <div class="pointer" style:transform="translate({pointer.left}, {pointer.top})">
          <svg class="cursor" class:down viewBox="0 0 13 20" aria-hidden="true">
            <path d="M1.2 1.2v15.4l3.7-3.5 2.5 5.7 2.5-1.1-2.5-5.6h5.2z" />
          </svg>
        </div>
      {/if}
    </div>

    <div class="controls">
      <button type="button" class="ctl" onclick={toggle}>
        <Icon name={live && playing ? "pause" : "play"} />
        {live && playing ? "Pause" : "Play"}
      </button>
      <button type="button" class="ctl" onclick={openViewer}>
        <Icon name="expand" />
        Screenshots
      </button>
    </div>
  </div>
</section>

<Viewer bind:open={viewing} bind:index={viewIndex} onstep={(i) => (viewIndex = (i + SLIDES.length) % SLIDES.length)} />

<style>
  .hero {
    --cobalt: #457cfd;

    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: "title" "get" "stage" "chapters";
    gap: 32px;
    max-width: var(--wide-w);
    margin: 0 auto;
    padding: 48px var(--gutter) 16px;
  }

  h1 {
    grid-area: title;
    max-width: 14ch;
    font-size: clamp(36px, 8vw, 52px);
    font-weight: 500;
    line-height: 1.02;
    letter-spacing: -0.04em;
  }

  .chapters {
    grid-area: chapters;
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .chapters li {
    position: relative;
    padding-bottom: 14px;
  }
  .chapters li:not(:last-child)::before,
  .chapters li:not(:last-child)::after {
    content: "";
    position: absolute;
    top: 21px;
    bottom: 1px;
    left: 5px;
    width: 1px;
    background: var(--line-2);
  }
  .chapters li::after {
    background: var(--cobalt);
    transform: scaleY(var(--p));
    transform-origin: top;
  }
  .more {
    padding: 2px 0 0 26px;
    color: var(--fg-3);
    font-size: 17px;
    line-height: 1.35;
    letter-spacing: -0.01em;
  }
  .more .node {
    border-style: dashed;
  }
  .chapters button {
    appearance: none;
    position: relative;
    display: block;
    width: 100%;
    padding: 2px 0 0 26px;
    border: 0;
    background: none;
    color: var(--fg-2);
    font: inherit;
    font-size: 17px;
    line-height: 1.35;
    letter-spacing: -0.01em;
    text-align: left;
    text-wrap: balance;
    cursor: pointer;
    transition: color 200ms linear;
  }
  .chapters button:hover {
    color: var(--fg-1);
  }
  .chapters button[aria-current="step"] {
    color: var(--bg-0);
  }
  .label {
    margin: 0 -6px;
    padding: 1px 6px 2px;
    background: linear-gradient(var(--fg-0), var(--fg-0)) no-repeat 100% 0 / 0% 100%;
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;
    transition:
      background-size 420ms var(--ease-out),
      color 260ms linear;
  }
  [aria-current="step"] .label {
    background-position: 0 0;
    background-size: 100% 100%;
  }
  .node {
    position: absolute;
    top: 7px;
    left: 0;
    width: 11px;
    height: 11px;
    border: 1px solid var(--line-2);
    border-radius: 50%;
    background: var(--bg-0);
    transition:
      border-color 300ms ease,
      background-color 300ms ease,
      box-shadow 300ms ease;
  }
  .done .node,
  [aria-current="step"] .node {
    border-color: var(--cobalt);
    background: var(--cobalt);
  }
  [aria-current="step"] .node {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--cobalt) 25%, transparent);
  }

  .get {
    grid-area: get;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }
  .ver {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--fg-1);
    font-size: var(--fs-xs);
    visibility: hidden;
  }
  .ver.ready {
    visibility: visible;
  }
  .ver:hover {
    color: var(--fg-0);
  }
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--ok);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ok) 18%, transparent);
  }
  .date {
    color: var(--fg-2);
  }

  .stage {
    grid-area: stage;
    min-width: 0;
  }
  .window {
    container-type: inline-size;
    position: relative;
    aspect-ratio: 1520 / 960;
    overflow: hidden;
    border-radius: var(--r-window);
    background: var(--bg-0);
    box-shadow: var(--shadow-window);
    isolation: isolate;
  }
  .window::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 6;
    border-radius: inherit;
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--fg-0) 8%, transparent);
    pointer-events: none;
  }
  .canvas {
    position: absolute;
    inset: 0;
    transform-origin: 0 0;
    will-change: transform;
  }
  .frame {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  .frame.prev {
    z-index: 1;
    opacity: 1;
  }
  .frame.on {
    z-index: 2;
    opacity: 1;
    transition: opacity 260ms ease;
  }
  .pointer {
    position: absolute;
    inset: 0;
    z-index: 5;
    will-change: transform;
    pointer-events: none;
  }
  .cursor {
    position: absolute;
    top: 0;
    left: 0;
    width: clamp(10px, 1.45cqi, 17px);
    margin: -1px 0 0 -1px;
    overflow: visible;
    fill: #fff;
    stroke: #111;
    stroke-width: 1.1;
    stroke-linejoin: round;
    filter: drop-shadow(0 1px 1.5px rgba(0, 0, 0, 0.55));
    transform-origin: 2px 2px;
    transition: transform 90ms ease;
    pointer-events: none;
  }
  .cursor.down {
    transform: scale(0.85);
  }
  .ripple {
    position: absolute;
    z-index: 4;
    width: clamp(18px, 3.4cqi, 36px);
    aspect-ratio: 1;
    border: 1.5px solid rgba(255, 255, 255, 0.85);
    border-radius: 50%;
    translate: -50% -50%;
    animation: ripple 520ms cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
    pointer-events: none;
  }
  @keyframes ripple {
    from {
      scale: 0.2;
      opacity: 0.9;
    }
    to {
      scale: 1;
      opacity: 0;
    }
  }

  .controls {
    display: flex;
    justify-content: flex-end;
    gap: 4px;
    margin-top: 10px;
  }
  .ctl {
    appearance: none;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    height: 28px;
    padding: 0 10px;
    border: 0;
    border-radius: var(--r-2);
    background: none;
    color: var(--fg-2);
    font: inherit;
    font-size: var(--fs-sm);
    cursor: pointer;
    transition:
      background-color 120ms linear,
      color 120ms linear;
  }
  .ctl :global(svg) {
    font-size: 12px;
  }
  .ctl:hover {
    background: var(--bg-2);
    color: var(--fg-0);
  }

  @media (min-width: 1080px) {
    .hero {
      grid-template-columns: minmax(300px, 360px) minmax(0, 1fr);
      grid-template-rows: 1fr auto auto auto 1fr;
      grid-template-areas: ". stage" "title stage" "chapters stage" "get stage" ". stage";
      gap: 0 clamp(40px, 4.5vw, 80px);
      min-height: calc(100dvh - var(--top-h));
      padding-block: 24px;
    }
    h1 {
      max-width: none;
      font-size: clamp(40px, 3.6vw, 56px);
    }
    .chapters {
      margin: 40px 0 44px;
    }
    .stage {
      align-self: center;
      width: 100%;
      max-width: calc((100dvh - var(--top-h) - 110px) * 1520 / 960);
      justify-self: end;
    }
  }

  @media (max-width: 1079px) {
    .chapters {
      margin-top: -8px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .frame.on,
    .chapters button,
    .label,
    .node {
      transition: none;
    }
  }
</style>
