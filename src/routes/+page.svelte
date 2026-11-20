<script lang="ts">
  import { onMount } from "svelte";
  import Backdrop from "#lib/components/Backdrop.svelte";
  import DissolveFilter from "#lib/components/DissolveFilter.svelte";
  import Faq from "#lib/components/Faq.svelte";
  import Features from "#lib/components/Features.svelte";
  import Footer from "#lib/components/Footer.svelte";
  import Header from "#lib/components/Header.svelte";
  import Hero from "#lib/components/Hero.svelte";
  import Install from "#lib/components/Install.svelte";
  import Seo from "#lib/components/Seo.svelte";
  import { FAQ, FEATURES, REPO_URL, SLIDES, plain } from "#lib/content.js";
  import { FRAMES, frameSrc } from "#lib/demo.js";
  import { LATEST_URL, release } from "#lib/release.svelte.js";

  const SITE = "https://pobredux.com/";
  const TITLE =
    "PoB Redux · Path of Building for PoE 1 & 2 on Mac, Linux and Windows";
  const DESCRIPTION =
    "Plan and theorycraft Path of Exile 1 and 2 builds on Windows, Mac and Linux. PoB Redux runs Path of Building's own engine, so every number matches. Free and open source.";
  const OG_DESCRIPTION =
    "Path of Building, built for modern times. Path of Exile 1 and 2 on Windows, macOS and Linux.";
  const FIRST = frameSrc(FRAMES[0]);

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE}#app`,
        name: "PoB Redux",
        url: SITE,
        image: `${SITE}assets/og.png`,
        description:
          "A desktop build planner for Path of Exile 1 and 2, with a new interface for Path of Building. It runs Path of Building Community's own calculation engine, so every number matches PoB.",
        applicationCategory: "GameApplication",
        applicationSubCategory: "Build planner",
        operatingSystem: "Windows, Linux, macOS",
        featureList: FEATURES.map((f) => `${f.title}: ${f.body}`),
        downloadUrl: LATEST_URL,
        screenshot: SLIDES.map((s) => `${SITE}assets/shots/${s.id}.webp`),
        inLanguage: ["en", "de", "es", "fr", "ja", "ko", "pt-BR", "ru", "th"],
        isAccessibleForFree: true,
        license: `${REPO_URL}/blob/main/LICENSE`,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        author: {
          "@type": "Person",
          name: "Judd",
          url: "https://github.com/juddisjudd",
        },
        sameAs: [REPO_URL],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE}#site`,
        url: SITE,
        name: "PoB Redux",
        about: { "@id": `${SITE}#app` },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE}#faq`,
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: plain(f.a) },
        })),
      },
    ],
  }).replace(/</g, "\\u003c");

  const SCRIPT_END = "<" + "/script>";
  const JSON_LD = `<script type="application/ld+json">${jsonLd}${SCRIPT_END}`;
  const UMAMI_ID = "82c93f76-2202-4c27-8f62-672e9c0a7d1f";
  const UMAMI = [
    `<script defer src="https://umami.bawkbawk.net/script.js" data-website-id="${UMAMI_ID}">${SCRIPT_END}`,
    `<script defer src="https://umami.bawkbawk.net/recorder.js" data-website-id="${UMAMI_ID}" data-sample-rate="0.15" data-mask-level="moderate" data-max-duration="300000">${SCRIPT_END}`,
  ].join("");

  let past = $state(false);

  onMount(() => release.load());
</script>

<Seo
  title={TITLE}
  description={DESCRIPTION}
  image="assets/og.png"
  imageAlt="PoB Redux: Path of Building, built for modern times"
  ogTitle="PoB Redux"
  ogDescription={OG_DESCRIPTION}
/>

<svelte:head>
  <link
    rel="preconnect"
    href="https://api.github.com"
    crossorigin="anonymous"
  />
  <link
    rel="preload"
    as="image"
    href={FIRST.src}
    imagesrcset={FIRST.srcset}
    imagesizes="(min-width: 1080px) calc((100vw - 460px) * 1.5), 150vw"
    fetchpriority="high"
  />
  {@html JSON_LD}
  {@html UMAMI}
</svelte:head>

<Backdrop />
<a class="skip" href="#main">Skip to content</a>
<Header download={past} />

<main id="main">
  <Hero bind:past />
  <Features />
  <Install />
  <Faq />
</main>

<Footer />
<DissolveFilter />

<style>
  main {
    position: relative;
    z-index: 1;
  }
</style>
