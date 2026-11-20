<script lang="ts">
  import Header from "#lib/components/Header.svelte";
</script>

<svelte:head>
  <title>Page not found · PoB Redux</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<Header links={false} />

<main class="lost">
  <p class="code mono">404</p>
  <h1>This page does not exist.</h1>
  <p class="lede">The link may be old or mistyped. Everything about PoB Redux is on the home page.</p>
  <div class="row">
    <a class="btn primary lg" href="/">Go to the home page</a>
    <a class="btn lg" href="/#download">Download</a>
  </div>
</main>

<style>
  .lost {
    max-width: var(--text-w);
    margin: 0 auto;
    padding: 120px var(--gutter) 160px;
  }
  .code {
    color: var(--fg-2);
    font-size: var(--fs-md);
  }
  h1 {
    margin-top: 12px;
    font-size: clamp(32px, 4.4vw, 48px);
    font-weight: 500;
    line-height: 1.08;
    letter-spacing: -0.03em;
  }
  .lede {
    max-width: 480px;
    margin-top: 16px;
    color: var(--fg-1);
    font-size: var(--fs-lead);
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 32px;
  }
</style>
