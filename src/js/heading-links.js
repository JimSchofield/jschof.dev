// Initialize heading links when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Find all heading links with data-heading-id attributes
  const headingLinks = document.querySelectorAll(
    ".heading-link[data-heading-id]",
  );

  headingLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const headingId = link.getAttribute("data-heading-id");

      // Update the URL hash without scrolling
      const currentUrl = new URL(window.location);
      currentUrl.hash = headingId;
      const urlToCopy = currentUrl.href;

      // Update browser history without scrolling
      history.pushState(null, "", `#${headingId}`);

      // Copy to clipboard
      navigator.clipboard
        .writeText(urlToCopy)
        .then(() => {
          // Show a brief success indicator
          const originalText = link.textContent;
          link.textContent = "✓";
          link.style.color = "green";

          setTimeout(() => {
            link.textContent = originalText;
            link.style.color = "";
          }, 1000);
        })
        .catch(() => {
          // Fallback for older browsers
          const textArea = document.createElement("textarea");
          textArea.value = urlToCopy;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);

          // Show success indicator
          const originalText = link.textContent;
          link.textContent = "✓";
          link.style.color = "green";

          setTimeout(() => {
            link.textContent = originalText;
            link.style.color = "";
          }, 1000);
        });
    });
  });
});
