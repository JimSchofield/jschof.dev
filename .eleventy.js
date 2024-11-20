const dateFns = require("date-fns");
const pluginSEO = require("eleventy-plugin-seo");
const path = require("node:path");
const fs = require("node:fs/promises");
const highlightPlugin = require("./eleventy/highlight");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/**/*.css");
  eleventyConfig.addPassthroughCopy("./src/**/*.js", { expand: true });
  eleventyConfig.addPassthroughCopy("./src/**/*.jpeg");
  eleventyConfig.addPassthroughCopy("./src/**/*.webp");
  eleventyConfig.addPassthroughCopy("./src/**/*.png");
  eleventyConfig.addPassthroughCopy("./src/**/*.mp4");
  eleventyConfig.addPassthroughCopy("./src/**/*.webmanifest");
  eleventyConfig.addPassthroughCopy("./.well-known/atproto-did");
  eleventyConfig.addPassthroughCopy({
    "./node_modules/baseline-status/baseline-status.min.js":
      "js/baseline-status.min.js",
  });

  eleventyConfig.addPlugin(pluginSEO, {
    title: "Jschof.dev",
    description: "I love to collaborate and solve problems.",
    url: "https://jschof.dev",
    author: "Jim Schofield",
  });

  eleventyConfig.addPlugin(highlightPlugin);

  eleventyConfig.addShortcode(
    "prettyDate",
    function (date, format = "yyyy-MM-dd") {
      // Fix UTC to localization issue where dates are a day off
      const dtDateOnly = new Date(
        date.valueOf() + date.getTimezoneOffset() * 60 * 1000,
      );
      return dateFns.lightFormat(dtDateOnly, format);
    },
  );

  eleventyConfig.addShortcode("socials", () => {
    return 'Add a comment below or find me on <a href="https://bsky.app/profile/jschof.bsky.social">Bluesky</a> or <a href="https://c.im/deck/@oldcoyote">Mastadon</a>.';
  });

  eleventyConfig.addShortcode("joinPaths", function (...paths) {
    return path.join(...paths);
  });

  eleventyConfig.addShortcode("readTime", async function (page) {
    const contents = await fs.readFile(page.inputPath, { encoding: "utf8" });

    const wordsPerMinute = 225;

    const minutes = Math.ceil(contents.split(/[ ,]+/).length / wordsPerMinute);

    return `About ${minutes} minute read.`;
  });

  return {
    dir: {
      input: "src",
    },
  };
};
