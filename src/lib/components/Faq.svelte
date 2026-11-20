<script lang="ts">
  import Icon from "./Icon.svelte";
  import RichText from "./RichText.svelte";
  import { FAQ } from "#lib/content.js";
</script>

<section class="faq wrap" id="questions" aria-labelledby="faq-title">
  <h2 class="section-title" id="faq-title">Questions</h2>
  <div class="list">
    {#each FAQ as item (item.q)}
      <details>
        <summary>
          <span>{item.q}</span>
          <Icon name="next" class="chev" />
        </summary>
        <p><RichText parts={item.a} /></p>
      </details>
    {/each}
  </div>
</section>

<style>
  .faq {
    display: grid;
    grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
    gap: 32px 56px;
    padding-top: 96px;
    padding-bottom: 120px;
  }
  .list {
    border-top: 1px solid var(--line-0);
  }
  details {
    border-bottom: 1px solid var(--line-0);
  }
  details::details-content {
    block-size: 0;
    overflow: clip;
    transition:
      block-size 260ms var(--ease-out),
      content-visibility 260ms allow-discrete;
  }
  details[open]::details-content {
    block-size: auto;
  }
  summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 18px 0;
    color: var(--fg-0);
    font-size: 16px;
    font-weight: 500;
    line-height: 1.4;
    list-style: none;
    cursor: pointer;
    transition: color 120ms linear;
  }
  summary::-webkit-details-marker {
    display: none;
  }
  summary:hover {
    color: var(--fg-1);
  }
  summary :global(.chev) {
    color: var(--fg-2);
    font-size: 14px;
    transform: rotate(90deg);
    transition: transform 200ms var(--ease-out);
  }
  details[open] summary :global(.chev) {
    transform: rotate(-90deg);
  }
  details p {
    max-width: 640px;
    padding-bottom: 20px;
    color: var(--fg-1);
  }

  @media (max-width: 860px) {
    .faq {
      grid-template-columns: 1fr;
      padding-top: 72px;
      padding-bottom: 88px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    details::details-content,
    summary :global(.chev) {
      transition: none;
    }
  }
</style>
