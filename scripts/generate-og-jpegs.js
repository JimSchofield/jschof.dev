#!/usr/bin/env node
// Walk src/posts/** and for every post whose frontmatter `image:` points at a
// .webp file, generate a .jpg sibling if one doesn't already exist. The SEO
// partial uses the .jpg variant for og:image because LinkedIn and some other
// scrapers reject WebP.

import { readdir, readFile, stat, access } from "node:fs/promises";
import { join, dirname, basename, extname } from "node:path";
import { constants } from "node:fs";
import sharp from "sharp";

const POSTS_DIR = new URL("../src/posts/", import.meta.url).pathname;

async function* walkPosts(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkPosts(full);
    } else if (entry.name === "index.html" || entry.name === "index.md") {
      yield full;
    }
  }
}

function extractFrontmatterImage(source) {
  if (!source.startsWith("---")) return null;
  const end = source.indexOf("\n---", 3);
  if (end === -1) return null;
  const fm = source.slice(3, end);
  const match = fm.match(/^image:\s*["']?([^"'\n]+?)["']?\s*$/m);
  return match ? match[1].trim() : null;
}

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

const results = { converted: [], skipped: [], missing: [] };

for await (const postFile of walkPosts(POSTS_DIR)) {
  const source = await readFile(postFile, "utf8");
  const image = extractFrontmatterImage(source);
  if (!image || extname(image).toLowerCase() !== ".webp") continue;

  const postDir = dirname(postFile);
  const webpPath = join(postDir, image);
  const jpgPath = join(postDir, basename(image, extname(image)) + ".jpg");

  if (!(await exists(webpPath))) {
    results.missing.push(webpPath);
    continue;
  }
  if (await exists(jpgPath)) {
    results.skipped.push(jpgPath);
    continue;
  }

  await sharp(webpPath).jpeg({ quality: 85 }).toFile(jpgPath);
  results.converted.push(jpgPath);
}

console.log(`Converted: ${results.converted.length}`);
results.converted.forEach((p) => console.log(`  + ${p}`));
console.log(`Skipped (jpg already existed): ${results.skipped.length}`);
results.skipped.forEach((p) => console.log(`  = ${p}`));
if (results.missing.length) {
  console.log(`Missing source webp: ${results.missing.length}`);
  results.missing.forEach((p) => console.log(`  ! ${p}`));
}
