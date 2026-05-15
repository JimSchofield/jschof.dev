#!/usr/bin/env node
// For each post that declares `image: <name>.webp` in frontmatter, ensure two
// derived files exist alongside an original source image (.jpg/.jpeg/.png):
//   - <name>.webp     - used for in-page rendering and the post index card
//   - <name>.og.jpg   - used as og:image / twitter:image (LinkedIn rejects
//                       WebP and times out on multi-MB originals)
//
// Flow:
//   1. Drop an original (cool-photo.jpg) into the post folder.
//   2. Set `image: cool-photo.webp` in frontmatter.
//   3. Run `pnpm og:gen`.
//   4. Bob's your uncle.
//
// Safe to re-run; skips derived files that are newer than their source.

import { readdir, readFile, stat, access } from "node:fs/promises";
import { join, dirname, basename, extname } from "node:path";
import { constants } from "node:fs";
import sharp from "sharp";

const POSTS_DIR = new URL("../src/posts/", import.meta.url).pathname;
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const OG_QUALITY = 85;
const WEBP_QUALITY = 85;
const SOURCE_EXTS = [".jpg", ".jpeg", ".png"];

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

async function findSourceOriginal(postDir, stem) {
  for (const ext of SOURCE_EXTS) {
    const candidate = join(postDir, stem + ext);
    if (await exists(candidate)) return candidate;
  }
  return null;
}

async function isUpToDate(sourcePath, targetPath) {
  if (!(await exists(targetPath))) return false;
  const [s, t] = await Promise.all([stat(sourcePath), stat(targetPath)]);
  return t.mtimeMs >= s.mtimeMs;
}

const results = { generated: [], skipped: [], missingSource: [], notWebp: [] };

for await (const postFile of walkPosts(POSTS_DIR)) {
  const fileSource = await readFile(postFile, "utf8");
  const image = extractFrontmatterImage(fileSource);
  if (!image) continue;

  if (extname(image).toLowerCase() !== ".webp") {
    results.notWebp.push(`${postFile} -> ${image}`);
    continue;
  }

  const postDir = dirname(postFile);
  const stem = basename(image, extname(image));
  const webpPath = join(postDir, image);
  const ogPath = join(postDir, stem + ".og.jpg");

  const original = await findSourceOriginal(postDir, stem);

  // If no original exists, fall back to using the .webp itself as the source
  // for the .og.jpg. Skip the .webp generation step in that case.
  const ogSource = original ?? ((await exists(webpPath)) ? webpPath : null);
  if (!ogSource) {
    results.missingSource.push(
      `${postDir}/{${SOURCE_EXTS.join(",")},.webp} (frontmatter expects ${image})`,
    );
    continue;
  }

  let didWork = false;

  if (original && !(await isUpToDate(original, webpPath))) {
    await sharp(original).webp({ quality: WEBP_QUALITY }).toFile(webpPath);
    results.generated.push(webpPath);
    didWork = true;
  }

  if (!(await isUpToDate(ogSource, ogPath))) {
    await sharp(ogSource)
      .resize(OG_WIDTH, OG_HEIGHT, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: OG_QUALITY, mozjpeg: true })
      .toFile(ogPath);
    results.generated.push(ogPath);
    didWork = true;
  }

  if (!didWork) {
    results.skipped.push(`${webpPath} + ${ogPath}`);
  }
}

console.log(`Generated: ${results.generated.length}`);
results.generated.forEach((p) => console.log(`  + ${p}`));
console.log(`Skipped (up to date): ${results.skipped.length}`);
results.skipped.forEach((p) => console.log(`  = ${p}`));
if (results.missingSource.length) {
  console.log(`\nMissing source original: ${results.missingSource.length}`);
  console.log(
    "  Drop a .jpg/.jpeg/.png with the same stem into the post folder.",
  );
  results.missingSource.forEach((p) => console.log(`  ! ${p}`));
}
if (results.notWebp.length) {
  console.log(`\nFrontmatter image is not .webp: ${results.notWebp.length}`);
  results.notWebp.forEach((p) => console.log(`  ? ${p}`));
}
