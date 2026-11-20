<script lang="ts">
  import { FEATURES } from "#lib/content.js";
</script>

<section class="features wrap" id="features" aria-labelledby="features-title">
  <h2 class="section-title" id="features-title">Same engine as Path of Building. Same numbers.</h2>
  <dl>
    {#each FEATURES as f (f.title)}
      <div>
        <dt>{f.title}</dt>
        <dd>{f.body}</dd>
      </div>
    {/each}
  </dl>
</section>

<style>
  .features {
    padding-top: 112px;
    padding-bottom: 24px;
  }
  h2 {
    max-width: 18ch;
  }
  dl {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0 32px;
    margin: 40px 0 0;
  }
  div {
    padding: 18px 0 22px;
    border-top: 1px solid var(--line-1);
  }
  dt {
    color: var(--fg-0);
    font-size: var(--fs-body);
    font-weight: 500;
  }
  dd {
    margin: 4px 0 0;
    color: var(--fg-2);
    font-size: 14px;
    line-height: 1.5;
    text-wrap: pretty;
  }

  @media (max-width: 960px) {
    dl {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
  @media (max-width: 720px) {
    .features {
      padding-top: 80px;
    }
    dl {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0 20px;
    }
  }
</style>
