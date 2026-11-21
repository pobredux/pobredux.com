<script lang="ts">
  import Icon from "./Icon.svelte";
  import { SLIDES } from "#lib/content.js";
  import { theme } from "#lib/theme.svelte.js";

  let {
    open = $bindable(false),
    index = $bindable(0),
    onstep,
  }: { open?: boolean; index?: number; onstep: (i: number) => void } = $props();

  let dialog: HTMLDialogElement;
  let body = $state<HTMLElement>();
  let zoom = $state<boolean | null>(null);
  const slide = $derived(SLIDES[index]);
  const actual = $derived(zoom ?? (open && matchMedia("(max-width: 700px)").matches));

  $effect(() => {
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  });

  function step(n: number) {
    onstep(index + n);
    body?.scrollTo(0, 0);
  }

  function onkeydown(e: KeyboardEvent) {
    const n = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!n) return;
    e.preventDefault();
    step(n);
  }
</script>

<dialog
  class="viewer"
  aria-label="Screenshot"
  bind:this={dialog}
  onclose={() => {
    open = false;
    zoom = null;
  }}
  onclick={(e) => e.target === body && (open = false)}
  {onkeydown}
>
  {#if open}
    <div class="bar">
      <p class="cap">{slide.caption}</p>
      <span class="count mono">{index + 1} / {SLIDES.length}</span>
      <button type="button" class="btn icon" aria-label="Previous screenshot" onclick={() => step(-1)}><Icon name="prev" /></button>
      <button type="button" class="btn icon" aria-label="Next screenshot" onclick={() => step(1)}><Icon name="next" /></button>
      <button type="button" class="btn icon" aria-label="Close" onclick={() => (open = false)}><Icon name="close" /></button>
    </div>
    <div class="body" class:actual bind:this={body}>
      <button type="button" class="img" aria-label={actual ? "Fit to window" : "Show actual size"} onclick={() => (zoom = !actual)}>
        <img src="/assets/shots/{theme.isLight ? 'light/' : ''}{slide.id}.webp" alt={slide.alt} width="1840" height="1162" />
      </button>
    </div>
  {/if}
</dialog>

<style>
  .viewer {
    width: 100vw;
    height: 100dvh;
    max-width: none;
    max-height: none;
    margin: 0;
    padding: 0;
    border: 0;
    background: var(--bg-0);
    color: var(--fg-0);
  }
  .viewer[open] {
    display: flex;
    flex-direction: column;
    animation: fade 180ms ease;
  }
  .viewer::backdrop {
    background: var(--bg-0);
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
  }
  .bar {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: none;
    height: var(--top-h);
    padding: 0 var(--gutter);
    border-bottom: 1px solid var(--line-0);
  }
  .cap {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: var(--fg-1);
    font-size: var(--fs-md);
    line-height: 1.4;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .count {
    margin-right: 6px;
    color: var(--fg-2);
    font-size: var(--fs-xs);
  }
  .body {
    display: flex;
    flex: 1;
    min-height: 0;
    overflow: auto;
    overscroll-behavior: contain;
    padding: 16px;
  }
  .img {
    appearance: none;
    display: block;
    max-width: 100%;
    max-height: 100%;
    margin: auto;
    padding: 0;
    border: 0;
    background: none;
    cursor: zoom-in;
  }
  .img img {
    display: block;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: calc(100dvh - var(--top-h) - 32px);
    border-radius: var(--r-2);
    box-shadow: 0 0 0 1px var(--line-1);
  }
  .actual .img {
    max-width: none;
    max-height: none;
    cursor: zoom-out;
  }
  .actual .img img {
    width: 1840px;
    max-width: none;
    max-height: none;
  }
  @media (max-width: 700px) {
    .actual .img img {
      width: 1200px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .viewer[open] {
      animation: none;
    }
  }
</style>
