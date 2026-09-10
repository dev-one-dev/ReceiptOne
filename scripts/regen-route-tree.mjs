#!/usr/bin/env node
/**
 * Regenerates src/routeTree.gen.ts without starting `vite dev`, using the
 * same router-generator the TanStack Start Vite plugin uses (plus the
 * Start-specific footer it appends). Run with: node scripts/regen-route-tree.mjs
 */
import path from "node:path";
import { Generator, getConfig } from "@tanstack/router-generator";

const root = process.cwd();
const config = getConfig(
  {
    target: "react",
    routesDirectory: path.resolve(root, "src/routes"),
    generatedRouteTree: path.resolve(root, "src/routeTree.gen.ts"),
    routeTreeFileFooter: [
      `import type { getRouter } from './router.tsx'
import type { createStart } from '@tanstack/react-start'
declare module '@tanstack/react-start' {
  interface Register {
    ssr: true
    router: Awaited<ReturnType<typeof getRouter>>
  }
}`,
    ],
  },
  root,
);
await new Generator({ config, root }).run();
console.log("✓ regenerated src/routeTree.gen.ts");
