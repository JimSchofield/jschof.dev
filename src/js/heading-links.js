// Global function to handle heading link clicks
window.copyHeadingUrl = function(event, headingId) {
  event.preventDefault();
  
  // Update the URL hash without scrolling
  const currentUrl = new URL(window.location);
  currentUrl.hash = headingId;
  const urlToCopy = currentUrl.href;
  
  // Update browser history without scrolling
  history.pushState(null, '', `#${headingId}`);
  
  // Copy to clipboard
  navigator.clipboard.writeText(urlToCopy).then(() => {
    // Optional: Show a brief success indicator
    const link = event.target;
    const originalText = link.textContent;
    link.textContent = '✓';
    link.style.color = 'green';
    
    setTimeout(() => {
      link.textContent = originalText;
      link.style.color = '';
    }, 1000);
  }).catch(() => {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = urlToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    // Show success indicator
    const link = event.target;
    const originalText = link.textContent;
    link.textContent = '✓';
    link.style.color = 'green';
    
    setTimeout(() => {
      link.textContent = originalText;
      link.style.color = '';
    }, 1000);
  });
};