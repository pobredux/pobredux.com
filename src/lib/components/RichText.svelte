<script lang="ts">
  import type { Rich } from "#lib/content.js";

  let { parts }: { parts: Rich[] } = $props();
</script>

{#each parts as p, i (i)}{#if typeof p === "string"}{p}{:else if "code" in p}<code>{p.code}</code>{:else if "href" in p}<a class="link" href={p.href}>{p.text}</a>{:else}<span lang={p.lang}>{p.text}</span>{/if}{/each}
