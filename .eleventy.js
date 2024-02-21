const dateFns = require('date-fns');
const path = require('node:path');

module.exports =  function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./src/**/*.css');
  eleventyConfig.addPassthroughCopy('./src/**/*.js', { expand: true });
  eleventyConfig.addPassthroughCopy('./src/**/*.jpeg');


  eleventyConfig.addShortcode("prettyDate", function(date, format = "yyyy-MM-dd") {
    return dateFns.format(date, format);
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
