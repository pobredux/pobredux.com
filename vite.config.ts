import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    sveltekit({
      compilerOptions: { runes: true },
      adapter: adapter({ pages: "dist", assets: "dist", strict: true }),
      inlineStyleThreshold: 64_000,
      paths: { origin: "https://pobredux.com" },
    }),
  ],
});
