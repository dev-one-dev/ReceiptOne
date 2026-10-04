/**
 * Bundles a snippet of TypeScript that imports from src/ (resolving the "@/"
 * alias) and imports the result in-process, so build scripts read the same
 * source of truth the routes render from instead of regex-scraping it.
 *
 * The snippet must only reach pure data modules (no React, no asset imports).
 */
import { resolve } from "node:path";
import { build } from "esbuild";

export async function loadTs(contents) {
  const result = await build({
    stdin: { contents, resolveDir: process.cwd(), loader: "ts" },
    alias: { "@": resolve("src") },
    bundle: true,
    write: false,
    format: "esm",
    platform: "node",
    logLevel: "silent",
  });
  const code = result.outputFiles[0].text;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
}
