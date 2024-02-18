const dateFns = require('date-fns');
const path = require('node:path');

module.exports =  function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./src/**/*.css');
  eleventyConfig.addPassthroughCopy('./src/**/*.js');
  eleventyConfig.addPassthroughCopy('./src/**/*.jpeg');

  eleventyConfig.addShortcode("prettyDate", function(date, format) {
    return dateFns.format(date, "yyyy-MM-dd");
  })

  eleventyConfig.addShortcode("joinPaths", function(...paths) {
    return path.join(...paths); 
  })

  return {
    dir: {
      input: "src",
    },
  };
}
