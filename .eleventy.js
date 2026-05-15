import { lightFormat } from "date-fns";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import * as esbuild from "esbuild";
import highlightPlugin from "./eleventy/highlight.js";
import autoHeadingIds from "./plugins/auto-heading-ids.js";

export default function (eleventyConfig) {
  // Bundle src/index.js with esbuild (resolves bare workspace imports)
  eleventyConfig.on("eleventy.before", async () => {
    await esbuild.build({
      entryPoints: ["site-entry.js"],
      bundle: true,
      outfile: "_site/index.js",
      format: "esm",
      minify: process.env.NODE_ENV === "production",
      sourcemap: process.env.NODE_ENV !== "production",
    });
  });

  eleventyConfig.addWatchTarget("site-entry.js");
  eleventyConfig.addWatchTarget("component/*/dist/");

  eleventyConfig.addPassthroughCopy("./src/**/*.css");
  eleventyConfig.addPassthroughCopy("./src/**/*.js", { expand: true });
  eleventyConfig.addPassthroughCopy("./src/**/*.jpeg");
  eleventyConfig.addPassthroughCopy("./src/**/*.gif");
  eleventyConfig.addPassthroughCopy("./src/**/*.webp");
  eleventyConfig.addPassthroughCopy("./src/**/*.png");
  eleventyConfig.addPassthroughCopy("./src/**/*.mp4");
  eleventyConfig.addPassthroughCopy("./src/**/*.ttf");
  eleventyConfig.addPassthroughCopy("./src/**/*.svg");
  eleventyConfig.addPassthroughCopy("./src/**/*.webmanifest");
  eleventyConfig.addPassthroughCopy("./.well-known/atproto-did");
  eleventyConfig.addPassthroughCopy("./_redirects");

  const title = "Jschof.dev";
  const description =
    "I love to collaborate and solve problems. A front end dev blogging about html, css, javascript, web components... and more!";
  const url = "https://jschof.dev";
  const author = "Jim Schofield";

  eleventyConfig.addPlugin(feedPlugin, {
    type: "rss", // or "rss", "json"
    outputPath: "/rss.xml",
    collection: {
      name: "posts", // iterate over `collections.posts`
      limit: 0, // 0 means no limit
    },
    metadata: {
      language: "en",
      title,
      subtitle: description,
      base: url,
      author: {
        name: author,
      },
    },
  });

  eleventyConfig.addPlugin(highlightPlugin);
  eleventyConfig.addPlugin(autoHeadingIds);

  eleventyConfig.addFilter("jsonify", function(value) {
    return JSON.stringify(value);
  });

  eleventyConfig.addShortcode(
    "prettyDate",
    function (date, format = "yyyy-MM-dd") {
      // Fix UTC to localization issue where dates are a day off
      const dtDateOnly = new Date(
        date.valueOf() + date.getTimezoneOffset() * 60 * 1000,
      );
      return lightFormat(dtDateOnly, format);
    },
  );

  eleventyConfig.addShortcode("socials", () => {
    return 'Find me on <a href="https://bsky.app/profile/jschof.dev">Bluesky</a> or <a href="https://c.im/deck/@oldcoyote">Mastodon</a>. I also have an <a href="/rss.xml">RSS feed here</a>';
  });

  eleventyConfig.addShortcode("joinPaths", function (...paths) {
    return join(...paths);
  });

  eleventyConfig.addShortcode("readTime", async function (page) {
    const contents = await readFile(page.inputPath, { encoding: "utf8" });

    const wordsPerMinute = 225;

    const minutes = Math.ceil(contents.split(/[ ,]+/).length / wordsPerMinute);

    return `About ${minutes} minute read.`;
  });

  return {
    dir: {
      input: "src",
    },
  };
}
