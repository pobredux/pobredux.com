<script lang="ts">
  import { onMount } from "svelte";
  import Icon from "./Icon.svelte";
  import { theme, type ThemeChoice } from "#lib/theme.svelte.js";

  const CHOICES: { id: ThemeChoice; label: string }[] = [
    { id: "system", label: "System" },
    { id: "light", label: "Light" },
    { id: "dark", label: "Dark" },
  ];

  onMount(() => theme.init());
</script>

<div class="seg" role="group" aria-label="Theme">
  {#each CHOICES as c (c.id)}
    <button
      type="button"
      aria-pressed={theme.choice === c.id}
      aria-label="{c.label} theme"
      title={c.label}
      onclick={() => theme.set(c.id)}
    >
      <Icon name={c.id} />
    </button>
  {/each}
</div>

<style>
  .seg {
    display: inline-flex;
    padding: 2px;
    gap: 2px;
    border: 1px solid var(--line-1);
    border-radius: var(--r-2);
    background: var(--bg-1);
  }
  button {
    appearance: none;
    display: grid;
    place-items: center;
    width: 26px;
    height: 24px;
    padding: 0;
    border: 0;
    border-radius: var(--r-1);
    background: transparent;
    color: var(--fg-2);
    font-size: 14px;
    cursor: pointer;
    transition:
      background-color 120ms linear,
      color 120ms linear;
  }
  button:hover {
    color: var(--fg-0);
  }
  button[aria-pressed="true"] {
    background: var(--bg-3);
    color: var(--fg-0);
    box-shadow: inset 0 0 0 1px var(--line-1);
  }
  button:focus-visible {
    outline: 2px solid var(--focus);
    outline-offset: 0;
  }
</style>
