<script lang="ts">
  const SITE = "https://pobredux.com/";

  let {
    title,
    description,
    path = "",
    image,
    imageAlt,
    ogTitle = title,
    ogDescription = description,
  }: {
    title: string;
    description: string;
    path?: string;
    image: string;
    imageAlt: string;
    ogTitle?: string;
    ogDescription?: string;
  } = $props();

  const url = $derived(SITE + path);
  const imageUrl = $derived(SITE + image);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={url} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="PoB Redux" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:title" content={ogTitle} />
  <meta property="og:description" content={ogDescription} />
  <meta property="og:url" content={url} />
  <meta property="og:image" content={imageUrl} />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={imageAlt} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={ogTitle} />
  <meta name="twitter:description" content={ogDescription} />
  <meta name="twitter:image" content={imageUrl} />
  <meta name="twitter:image:alt" content={imageAlt} />
</svelte:head>
