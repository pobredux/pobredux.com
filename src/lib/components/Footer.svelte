<script lang="ts">
  import Brand from "./Brand.svelte";
  import Icon, { type IconName } from "./Icon.svelte";
  import { DISCORD_URL, ISSUES_URL, KOFI_URL, POB_URL, REPO_URL } from "#lib/content.js";

  const LINKS: { href: string; label: string; icon: IconName }[] = [
    { href: DISCORD_URL, label: "Discord", icon: "discord" },
    { href: REPO_URL, label: "GitHub", icon: "github" },
    { href: ISSUES_URL, label: "Report a bug", icon: "bug" },
    { href: KOFI_URL, label: "Support on Ko-fi", icon: "coffee" },
  ];
</script>

<footer class="foot">
  <div class="in">
    <div class="top">
      <div class="who">
        <Brand />
        <p>Path of Building, built for modern times.</p>
      </div>
      <nav aria-label="Community">
        <ul>
          {#each LINKS as l (l.href)}
            <li><a href={l.href}><Icon name={l.icon} />{l.label}</a></li>
          {/each}
        </ul>
      </nav>
    </div>
    <div class="legal mono">
      <p>MIT licence. Calculations by <a class="link nowrap" href={POB_URL}>Path of Building Community</a>.</p>
      <p>Not affiliated with Grinding Gear Games.</p>
      <nav aria-label="Policies">
        <a class="link" href="/code-signing">Code signing policy</a>
        <a class="link" href="/privacy">Privacy policy</a>
      </nav>
    </div>
  </div>
</footer>

<style>
  .foot {
    border-top: 1px solid var(--line-0);
    background: var(--bg-1);
  }
  .in {
    max-width: var(--wide-w);
    margin: 0 auto;
    padding: 40px var(--gutter) env(safe-area-inset-bottom);
  }
  .top {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 28px 40px;
    padding-bottom: 36px;
  }
  .who p {
    max-width: 320px;
    margin-top: 12px;
    color: var(--fg-2);
    font-size: var(--fs-md);
    text-wrap: balance;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 24px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  ul a {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--fg-1);
    font-size: var(--fs-md);
    transition: color 120ms linear;
  }
  ul a :global(svg) {
    color: var(--fg-2);
    font-size: 15px;
    transition: color 120ms linear;
  }
  ul a:hover,
  ul a:hover :global(svg) {
    color: var(--fg-0);
  }
  .legal {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 6px 16px;
    padding: 14px 0 16px;
    border-top: 1px solid var(--line-0);
    color: var(--fg-2);
    font-size: var(--fs-xs);
  }
  .legal nav {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 20px;
  }
  .nowrap {
    white-space: nowrap;
  }

  @media (max-width: 600px) {
    .in {
      padding-top: 32px;
    }
    .top {
      flex-direction: column;
      gap: 24px;
      padding-bottom: 24px;
    }
    nav[aria-label="Community"] {
      width: 100%;
    }
    ul {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 16px;
    }
    li {
      border-top: 1px solid var(--line-0);
    }
    ul a {
      display: flex;
      width: 100%;
      height: 44px;
    }
    .legal {
      flex-direction: column;
      gap: 8px;
      padding: 16px 0 24px;
      line-height: 1.6;
    }
    .legal nav {
      margin-top: 6px;
    }
    .legal nav a {
      display: inline-flex;
      align-items: center;
      min-height: 32px;
    }
  }
</style>
