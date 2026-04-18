---
"@jschofield/link-preview": minor
---

Replace hover-on-anchor with an explicit inspection button appended after each link. Clicking the button toggles the popover open/closed, which fixes a focus loop where tabbing out of the popover refocused the anchor and immediately reopened it. Adds an accessible 40×40 close button (×) to the preview card. Uses `delegatesFocus` on the component's shadow root so focusing the preview routes to the close button. Also works on mobile now, since it no longer relies on hover.
