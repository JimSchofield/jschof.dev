import { Window } from "happy-dom";

function slugify(text) {
  // Limit to first 10 words
  const words = text.trim().split(/\s+/).slice(0, 10);
  const limitedText = words.join(" ");
  
  return limitedText
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function isInsideWebComponent(element) {
  const webComponentTags = [
    "play-ground",
    "code-highlight",
    "quick-search",
    "reading-list",
  ];

  let parent = element.parentElement;
  while (parent) {
    if (webComponentTags.includes(parent.tagName.toLowerCase())) {
      return true;
    }
    parent = parent.parentElement;
  }

  return false;
}

export default function (eleventyConfig) {
  eleventyConfig.addTransform(
    "auto-heading-ids",
    function (content, outputPath) {
      if (!outputPath || !outputPath.endsWith(".html")) {
        return content;
      }

      // Only process posts (files under /posts/ directory)
      const isPost = outputPath.includes("/posts/");
      if (!isPost) {
        return content;
      }

      const window = new Window();
      const document = window.document;
      document.body.innerHTML = content;

      const usedIds = new Set();

      // First pass: collect existing IDs from all elements
      const elementsWithIds = document.querySelectorAll("[id]");
      elementsWithIds.forEach((element) => {
        usedIds.add(element.id);
      });

      // Second pass: process h2-h6 headings without IDs
      const headings = document.querySelectorAll("h2, h3, h4, h5, h6");

      headings.forEach((heading) => {
        // Skip if already has an ID
        if (heading.id) {
          return;
        }

        // Skip if inside a web component
        if (isInsideWebComponent(heading)) {
          return;
        }

        const text = heading.textContent.trim();
        if (!text) return;

        // Generate unique ID
        let baseId = slugify(text);
        let finalId = baseId;
        let counter = 1;

        while (usedIds.has(finalId)) {
          finalId = `${baseId}-${counter}`;
          counter++;
        }

        usedIds.add(finalId);
        heading.id = finalId;

        // Create paperclip link
        const link = document.createElement("a");
        link.href = `#${finalId}`;
        link.className = "heading-link";
        link.setAttribute("onclick", `copyHeadingUrl(event, '${finalId}')`);
        link.setAttribute("aria-label", `Copy link to ${text}`);
        link.setAttribute("title", "Copy link to this heading");
        link.textContent = "📎";

        // Add a space before the link
        heading.appendChild(document.createTextNode(" "));
        heading.appendChild(link);
      });

      return document.body.innerHTML;
    },
  );
}
