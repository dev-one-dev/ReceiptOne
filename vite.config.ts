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
        // serverDir points Nitro's file-based route scanning at
        // src/server (routesDir defaults to "routes" beneath it), so
        // src/server/routes/api/helpdesk/notify.post.ts registers as
        // POST /api/helpdesk/notify -- kept under src/ so it's covered
        // by the existing tsconfig "include" without changes there.
        plugins: [nitro({ preset: "vercel", serverDir: "src/server" })],
      }
    : {},
});
