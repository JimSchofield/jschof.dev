const dateFns = require('date-fns');
const path = require('node:path');
const fs = require('node:fs/promises');

module.exports =  function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./src/**/*.css');
  eleventyConfig.addPassthroughCopy('./src/**/*.js', { expand: true });
  eleventyConfig.addPassthroughCopy('./src/**/*.jpeg');
  eleventyConfig.addPassthroughCopy('./src/**/*.png');


  eleventyConfig.addShortcode("prettyDate", function(date, format = "yyyy-MM-dd") {
    return dateFns.format(date, format);
  })

  eleventyConfig.addShortcode("joinPaths", function(...paths) {
    return path.join(...paths); 
  })

  eleventyConfig.addShortcode("readTime", async function(page) {

    const contents = await fs.readFile(page.inputPath, { encoding: 'utf8'});

    const wordsPerMinute = 250;

    const minutes = Math.ceil(contents.split(/[ ,]+/).length / wordsPerMinute);

    return `About ${minutes} minute read.`
  })

  return {
    dir: {
      input: "src",
    },
  };
}
