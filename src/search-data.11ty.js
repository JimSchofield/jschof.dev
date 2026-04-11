export default class {
  data() {
    return {
      permalink: "/search-data.json",
      eleventyExcludeFromCollections: true,
      eleventyImport: {
        collections: ["posts", "learnings"]
      }
    };
  }

  render(data) {
    const posts = data.collections.posts.map(post => ({
      title: post.data.title,
      excerpt: post.data.excerpt,
      categories: post.data.tags || [],
      type: "post",
      url: post.url
    }));

    const learnings = (data.collections.learnings || []).map(learning => ({
      title: learning.data.title,
      excerpt: learning.data.excerpt,
      categories: learning.data.tags || [],
      type: "learning",
      url: learning.url
    }));

    return JSON.stringify([...posts, ...learnings], null, 0);
  }
}
