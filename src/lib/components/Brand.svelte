<script lang="ts">
  let { href = "/" }: { href?: string } = $props();
</script>

<a class="brand" {href}>
  <svg class="mark" viewBox="142 142 740 740" aria-hidden="true" focusable="false">
    <path d="M338 142H702V282H422V422H282V198A56 56 0 0 1 338 142Z" />
    <path d="M742 142H882V282H742Z" />
    <path d="M742 322H882V546A56 56 0 0 1 826 602H462V462H742Z" />
    <path class="r" d="M142 462H366A56 56 0 0 1 422 518V882H282V602H142Z" />
  </svg>
  <span class="name" translate="no">PoB <span class="thin">Redux</span></span>
</a>

<style>
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    border-radius: var(--r-1);
  }
  .mark {
    width: 16px;
    height: 16px;
    flex: none;
    fill: var(--fg-0);
  }
  .mark .r {
    fill: var(--brand);
  }
  .name {
    font-size: var(--fs-sm);
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--fg-0);
  }
  .thin {
    font-weight: 400;
    color: var(--fg-2);
  }
</style>
