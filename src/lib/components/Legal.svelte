<script lang="ts">
  import Footer from "./Footer.svelte";
  import Header from "./Header.svelte";
  import RichText from "./RichText.svelte";
  import Seo from "./Seo.svelte";
  import type { LegalPage } from "#lib/legal.js";

  let { page }: { page: LegalPage } = $props();

  const slug = (title: string) => `${page.path}-${title.toLowerCase().replace(/\W+/g, "-")}`;
</script>

<Seo
  title="{page.title} · PoB Redux"
  description={page.description}
  path={page.path}
  image="assets/og-{page.path}.png"
  imageAlt="PoB Redux {page.title.toLowerCase()}"
/>

<Header />

<main class="legal wrap">
  <p class="note">{page.note}</p>
  <h1>{page.title}</h1>
  <p class="lede"><RichText parts={page.lede} /></p>

  {#each page.sections as s (s.title)}
    <section aria-labelledby={slug(s.title)}>
      <h2 id={slug(s.title)}>{s.title}</h2>
      <dl>
        {#each s.items as item (item.term)}
          <dt>{item.term}</dt>
          <dd><RichText parts={item.text} /></dd>
        {/each}
      </dl>
    </section>
  {/each}
</main>

<Footer />

<style>
  .legal {
    padding-top: 96px;
    padding-bottom: 120px;
  }
  .note {
    color: var(--fg-2);
    font-size: var(--fs-md);
  }
  h1 {
    margin-top: 10px;
    font-size: clamp(32px, 4.4vw, 48px);
    font-weight: 500;
    line-height: 1.08;
    letter-spacing: -0.03em;
  }
  .lede {
    max-width: 640px;
    margin-top: 16px;
    color: var(--fg-1);
    font-size: var(--fs-lead);
  }
  section {
    display: grid;
    grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
    gap: 16px 56px;
    margin-top: 72px;
  }
  h2 {
    font-size: 20px;
    font-weight: 500;
    letter-spacing: -0.01em;
  }
  dl {
    margin: 0;
    border-top: 1px solid var(--line-0);
  }
  dt {
    padding-top: 16px;
    color: var(--fg-0);
    font-weight: 500;
  }
  dd {
    margin: 4px 0 0;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--line-0);
    color: var(--fg-1);
  }
  dt,
  dd {
    padding-right: max(0px, 100% - 68ch);
  }

  @media (max-width: 860px) {
    .legal {
      padding-top: 64px;
    }
    section {
      grid-template-columns: 1fr;
      margin-top: 48px;
    }
  }
</style>
