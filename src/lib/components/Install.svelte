<script lang="ts">
  import { onMount } from "svelte";
  import Icon from "./Icon.svelte";
  import RichText from "./RichText.svelte";
  import { BUILD_FOLDERS, INSTALL_STEPS, LINUX_NOTES, LINUX_PACKAGES, OS_LABEL, type Os } from "#lib/content.js";

  const ORDER: Os[] = ["windows", "mac", "linux"];
  let os = $state<Os>("windows");
  let list: HTMLElement;

  function onkeydown(e: KeyboardEvent) {
    const at = ORDER.indexOf(os);
    const n = { ArrowRight: at + 1, ArrowLeft: at - 1, Home: 0, End: ORDER.length - 1 }[e.key];
    if (n === undefined) return;
    e.preventDefault();
    os = ORDER[(n + ORDER.length) % ORDER.length];
    list.querySelector<HTMLElement>(`[data-os="${os}"]`)?.focus();
  }

  onMount(() => {
    const detected = document.documentElement.dataset.os;
    if (detected === "mac" || detected === "linux") os = detected;
  });
</script>

<section class="install wrap" id="install" aria-labelledby="install-title">
  <div class="head">
    <h2 class="section-title" id="install-title">Install</h2>
    <div class="tabs" role="tablist" aria-label="Operating system" bind:this={list}>
      {#each ORDER as o (o)}
        <button
          type="button"
          role="tab"
          id="install-tab-{o}"
          data-os={o}
          aria-selected={os === o}
          aria-controls="install-panel"
          tabindex={os === o ? 0 : -1}
          onclick={() => (os = o)}
          {onkeydown}
        >
          <Icon name={o} />
          {OS_LABEL[o]}
        </button>
      {/each}
    </div>
  </div>

  <div class="panel" id="install-panel" role="tabpanel" aria-labelledby="install-tab-{os}">
    {#if os === "linux"}
      <dl class="pkgs">
        {#each LINUX_PACKAGES as p (p.distro)}
          <dt>{p.distro}</dt>
          <dd><RichText parts={p.how} /></dd>
        {/each}
      </dl>
      {#each LINUX_NOTES as n, i (i)}
        <p class="note"><RichText parts={n} /></p>
      {/each}
    {:else if INSTALL_STEPS[os].length === 1}
      <p><RichText parts={INSTALL_STEPS[os][0]} /></p>
    {:else}
      <ol class="steps">
        {#each INSTALL_STEPS[os] as s, i (i)}
          <li><RichText parts={s} /></li>
        {/each}
      </ol>
    {/if}
    <p class="builds">
      Builds stay in Path of Building's folders: <code>{BUILD_FOLDERS[0]}</code> and <code>{BUILD_FOLDERS[1]}</code>.
    </p>
  </div>
</section>

<style>
  .install {
    display: grid;
    grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
    gap: 32px 56px;
    padding-top: 96px;
    padding-bottom: 96px;
  }
  .head {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .tabs {
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: fit-content;
    min-width: 180px;
  }
  .tabs button {
    appearance: none;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 38px;
    padding: 0 12px;
    border: 1px solid transparent;
    border-radius: var(--r-2);
    background: transparent;
    color: var(--fg-2);
    font: inherit;
    font-size: var(--fs-body);
    text-align: left;
    cursor: pointer;
    transition:
      background-color 120ms linear,
      color 120ms linear;
  }
  .tabs button :global(svg) {
    font-size: 15px;
  }
  .tabs button:hover {
    color: var(--fg-0);
  }
  .tabs button[aria-selected="true"] {
    border-color: var(--line-1);
    background: var(--bg-2);
    color: var(--fg-0);
  }

  .panel {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 6px;
    color: var(--fg-1);
  }
  .steps {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin: 0;
    padding: 0;
    list-style: none;
    counter-reset: step;
  }
  .steps li {
    position: relative;
    padding-left: 40px;
    counter-increment: step;
  }
  .steps li::before {
    content: counter(step);
    position: absolute;
    top: 0;
    left: 0;
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    border: 1px solid var(--line-1);
    border-radius: 50%;
    color: var(--fg-1);
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
  }
  .pkgs {
    display: grid;
    grid-template-columns: max-content 1fr;
    margin: 0;
    border-top: 1px solid var(--line-0);
  }
  .pkgs dt,
  .pkgs dd {
    padding: 11px 0;
    border-bottom: 1px solid var(--line-0);
  }
  .pkgs dt {
    padding-right: 32px;
    color: var(--fg-0);
    font-weight: 500;
  }
  .pkgs dd {
    margin: 0;
  }
  .note {
    font-size: 14px;
  }
  .builds {
    margin-top: 12px;
    padding-top: 20px;
    border-top: 1px solid var(--line-0);
    color: var(--fg-2);
    font-size: 14px;
  }
  .builds code {
    white-space: normal;
  }

  @media (max-width: 860px) {
    .install {
      grid-template-columns: 1fr;
      padding-top: 72px;
      padding-bottom: 72px;
    }
    .tabs {
      flex-direction: row;
      width: auto;
      min-width: 0;
    }
  }
  @media (max-width: 480px) {
    .pkgs {
      grid-template-columns: 1fr;
    }
    .pkgs dt {
      padding-bottom: 0;
      border-bottom: 0;
    }
    .pkgs dd {
      padding-top: 2px;
    }
  }
</style>
