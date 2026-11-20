<script lang="ts">
  import Brand from "./Brand.svelte";
  import Icon from "./Icon.svelte";
  import ThemeSwitch from "./ThemeSwitch.svelte";
  import { DISCORD_URL, REPO_URL } from "#lib/content.js";

  let { download = false, links = true }: { download?: boolean; links?: boolean } = $props();
</script>

<header class="top">
  <div class="in">
    <Brand />
    {#if links}
      <nav aria-label="Links">
        <a class="icon-link" href={REPO_URL} aria-label="GitHub" title="GitHub"><Icon name="github" /></a>
        <a class="icon-link" href={DISCORD_URL} aria-label="Discord" title="Discord"><Icon name="discord" /></a>
        <ThemeSwitch />
        <a class="btn primary sm dl" class:on={download} href="/#download" tabindex={download ? 0 : -1} aria-hidden={!download}>
          <Icon name="download" />
          Download
        </a>
      </nav>
    {/if}
  </div>
</header>

<style>
  .top {
    position: sticky;
    top: 0;
    z-index: 10;
    border-bottom: 1px solid var(--line-0);
    background: color-mix(in srgb, var(--bg-0) 82%, transparent);
    -webkit-backdrop-filter: blur(14px) saturate(1.2);
    backdrop-filter: blur(14px) saturate(1.2);
  }
  .in {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    max-width: var(--wide-w);
    height: var(--top-h);
    margin: 0 auto;
    padding: 0 var(--gutter);
  }
  nav {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .icon-link {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: var(--r-2);
    color: var(--fg-1);
    font-size: 18px;
    transition:
      background-color 120ms linear,
      color 120ms linear;
  }
  .icon-link:hover {
    background: var(--bg-2);
    color: var(--fg-0);
  }
  nav :global(.seg) {
    margin-left: 6px;
  }
  .dl {
    max-width: 0;
    margin-left: 0;
    padding-inline: 0;
    border-width: 0;
    overflow: hidden;
    opacity: 0;
    visibility: hidden;
    transition:
      max-width 240ms cubic-bezier(0.2, 0.7, 0.2, 1),
      margin-left 240ms cubic-bezier(0.2, 0.7, 0.2, 1),
      padding 240ms cubic-bezier(0.2, 0.7, 0.2, 1),
      opacity 160ms ease,
      visibility 0s linear 240ms;
  }
  .dl.on {
    max-width: 140px;
    margin-left: 10px;
    padding-inline: 12px;
    border-width: 1px;
    opacity: 1;
    visibility: visible;
    transition:
      max-width 240ms cubic-bezier(0.2, 0.7, 0.2, 1),
      margin-left 240ms cubic-bezier(0.2, 0.7, 0.2, 1),
      padding 240ms cubic-bezier(0.2, 0.7, 0.2, 1),
      opacity 200ms ease 60ms;
  }
  @media (prefers-reduced-motion: reduce) {
    .dl,
    .dl.on {
      transition: none;
    }
  }
  :global(html[data-os="other"]) .dl {
    display: none;
  }
  @media (max-width: 600px) {
    .dl {
      display: none;
    }
  }
</style>
