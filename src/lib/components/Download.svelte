<script lang="ts">
  import Icon from "./Icon.svelte";
  import { AUR_URL } from "#lib/content.js";
  import { release, RELEASES_URL } from "#lib/release.svelte.js";
</script>

<div class="download">
  <p class="phone if-other">PoB Redux is a desktop app for Windows, Linux and macOS. Open this page on your computer to download it.</p>

  <div class="group win">
    <a class="btn primary lg" href={release.href("exe")}><Icon name="windows" />Download for Windows</a>
    <p class="meta mono">{release.meta("exe")}</p>
  </div>

  <div class="group mac">
    <a class="btn primary lg" href={release.href("dmg")}><Icon name="mac" />Download for macOS</a>
    <p class="meta mono">{release.meta("dmg")}</p>
  </div>

  <div class="group linux">
    <div class="row">
      <a class="btn primary lg" href={release.href("appimage")}><Icon name="linux" />Download for Linux</a>
      <a class="btn lg" href={release.href("deb")}>.deb</a>
      <a class="btn lg" href={release.href("rpm")}>.rpm</a>
      <a class="btn lg" href={AUR_URL}>AUR</a>
    </div>
    <p class="meta mono">{release.meta("appimage")}</p>
    {#if release.hasOtherArch}
      <p class="meta mono">
        {release.otherArchName}:
        <a class="link" href={release.href("appimage-other")}>AppImage</a> ·
        <a class="link" href={release.href("deb-other")}>.deb</a> ·
        <a class="link" href={release.href("rpm-other")}>.rpm</a>
      </p>
    {/if}
  </div>

  <p class="alt">
    <span class="if-windows">Also for <a class="link" href={release.href("dmg")}>macOS</a> and <a class="link" href={release.href("appimage")}>Linux</a>.</span>
    <span class="if-mac">Also for <a class="link" href={release.href("exe")}>Windows</a> and <a class="link" href={release.href("appimage")}>Linux</a>.</span>
    <span class="if-linux">Also for <a class="link" href={release.href("exe")}>Windows</a> and <a class="link" href={release.href("dmg")}>macOS</a>.</span>
    <a class="link" href={RELEASES_URL}>All releases</a>
  </p>
</div>

<style>
  .download {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .meta {
    color: var(--fg-2);
    font-size: var(--fs-xs);
  }
  .alt {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 14px;
    color: var(--fg-2);
    font-size: var(--fs-md);
  }
  .phone {
    max-width: 360px;
    color: var(--fg-1);
    font-size: var(--fs-md);
  }

  :global(html[data-os="windows"]) :is(.mac, .linux),
  :global(html[data-os="mac"]) :is(.win, .linux),
  :global(html[data-os="linux"]) :is(.win, .mac),
  :global(html:not([data-os="windows"])) .if-windows,
  :global(html:not([data-os="mac"])) .if-mac,
  :global(html:not([data-os="linux"])) .if-linux,
  :global(html:not([data-os="other"])) .if-other {
    display: none;
  }
  :global(html[data-os="other"]) .group .btn.primary {
    border-color: var(--line-1);
    background: var(--bg-2);
    color: var(--fg-1);
    font-weight: 400;
  }
  :global(html[data-os="other"]) .group .btn.primary:hover {
    border-color: var(--line-2);
    background: var(--bg-hover);
    color: var(--fg-0);
  }
</style>
