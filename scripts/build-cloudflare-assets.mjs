import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";

const outputDir = "cloudflare/dist";
const publicPaths = [
  ".well-known",
  "_headers",
  "_redirects",
  "favicon.png",
  "index.html",
  "logo.png",
  "people photos",
  "security.txt",
  "serif.html",
  "sgi logo.png",
  "sgi logo.svg",
  "sig logo fav icon.png",
];

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

for (const path of publicPaths) {
  if (!existsSync(path)) {
    throw new Error(`Missing public path: ${path}`);
  }
  const target = join(outputDir, path);
  mkdirSync(dirname(target), { recursive: true });
  cpSync(path, target, { recursive: true });
}

console.log(`Cloudflare assets written to ${outputDir}/ with ${publicPaths.length} public entries.`);
