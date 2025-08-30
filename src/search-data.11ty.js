export default class {
  data() {
    return {
      permalink: "/search-data.json",
      eleventyExcludeFromCollections: true
    };
  }

  render(data) {
    const searchData = data.collections.posts.map(post => ({
      title: post.data.title,
      excerpt: post.data.excerpt,
      categories: post.data.tags || [],
      url: post.url
    }));

    return JSON.stringify(searchData, null, 0);
  }
}