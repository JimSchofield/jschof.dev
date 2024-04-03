module.exports = function (eleventyConfig, _options) {
  // eleventyConfig.addPassthroughCopy({
  //   "node_modules/highlight.js/styles/tokyo-night-dark.min.css":
  //     "css/highlight.min.css",
  // });
  eleventyConfig.amendLibrary("md", () => {});

  eleventyConfig.on("eleventy.before", async () => {
    const shiki = await import("shiki");
    const highlighter = await shiki.getHighlighter({
      themes: ["tokyo-night"],
      langs: ["css", "javascript", "typescript", "html"],
    });

    eleventyConfig.amendLibrary("md", (mdLib) =>
      mdLib.set({
        highlight: (code, lang) => {
          const result = highlighter.codeToHtml(code, {
            theme: "tokyo-night",
            lang,
          });

          return result;
        },
      }),
    );
  });
};
