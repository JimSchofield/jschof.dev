# @jschofield/link-preview

## 0.4.0

### Minor Changes

- Readme/claudefile updates, linkpreview quickfixes

## 0.3.0

### Minor Changes

- 9ea5f08: Replace hover-on-anchor with an explicit inspection button appended after each link. Clicking the button toggles the popover open/closed, which fixes a focus loop where tabbing out of the popover refocused the anchor and immediately reopened it. Adds an accessible 40×40 close button (×) to the preview card. Uses `delegatesFocus` on the component's shadow root so focusing the preview routes to the close button. Also works on mobile now, since it no longer relies on hover.
- link preview, repl-playground adjustment

## 0.2.0

### Minor Changes

- 561a888: Live preview added
