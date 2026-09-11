// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

const deployVercel = process.env.VERCEL === "1";

export default defineConfig({
  cloudflare: deployVercel ? false : undefined,
  vite: deployVercel
    ? {
        // No file-based server routes: the contact form and feature-idea
        // widget call the portal's Firebase Cloud Functions directly from
        // the browser, so Nitro only needs the Vercel preset for SSR.
        plugins: [nitro({ preset: "vercel" })],
      }
    : {},
});
