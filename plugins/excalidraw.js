import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { renderToSvg } from "@moona3k/excalidraw-export";

export default function (eleventyConfig) {
  eleventyConfig.addAsyncShortcode("excalidraw", async function (filePath, extraClasses) {
    const classes = ["excalidraw", extraClasses].filter(Boolean).join(" ");
    const inputDir = dirname(this.page.inputPath);
    const absPath = resolve(inputDir, filePath);

    let data;
    try {
      const raw = await readFile(absPath, "utf-8");
      data = JSON.parse(raw);
    } catch (e) {
      throw new Error(
        `excalidraw shortcode: failed to read "${absPath}": ${e.message}`,
      );
    }

    const svg = renderToSvg(data);

    // Strip embedded font to avoid massive inline base64 —
    // Virgil will fall back to cursive which looks close enough
    const noFont = svg.replace(/@font-face\s*\{[^}]*\}/g, "");

    // Remove the now-empty <defs><style></style></defs> block —
    // it contains a <style> tag that confuses HTML parsers (like happy-dom
    // in the auto-heading-ids transform) when the SVG is inlined
    const stripped = noFont.replace(/<defs><style>\s*<\/style><\/defs>/, "");

    // Collapse to single line — markdown processors treat blank lines
    // inside HTML blocks as paragraph breaks, which destroys inline SVGs
    const oneLine = stripped.replace(/\n\s*/g, "");

    // Make responsive: remove fixed width/height, let viewBox handle scaling
    return oneLine
      .replace(/width="[^"]*"/, "")
      .replace(/height="[^"]*"/, "")
      .replace(/<rect width="100%" height="100%" fill="[^"]*"\/>/, "")
      .replace("<svg", `<svg class="${classes}"`);
  });
}
