# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog/website built with 11ty (Eleventy) static site generator using ESM modules throughout. The site focuses on web development content, particularly web components and modern web APIs. The blog includes interactive code examples powered by custom web components.

## 11ty References

- Include this link for reference when claude needs to look up how 11ty works: https://context7.com/11ty/11ty-website/llms.txt?tokens=10000

## Development Commands

### Core Commands
- `npm run start` - Start development server with live reload (serves at localhost:8080 by default)
- `npm run build` - Build the static site for production (outputs to `_site/`)

### Build Process
The build system uses 11ty with these key features:
- Source files in `src/` directory
- Output to `_site/` directory 
- Automatic passthrough copying for assets (CSS, JS, images, fonts, videos)
- Custom syntax highlighting using Shiki with Tokyo Night theme
- RSS feed generation
- SEO plugin integration
- Auto-heading IDs with paperclip links (posts only)

### Auto-Heading IDs Plugin
The site includes a custom 11ty plugin that automatically generates IDs and shareable links for headings:

**Location**: `plugins/auto-heading-ids.js`

**Features**:
- Auto-generates IDs for h2-h6 headings (h1 excluded)
- Only processes blog posts (files under `/posts/` directory)
- Limits IDs to first 10 words for readability
- Adds paperclip (📎) links for copying heading URLs
- Uses Happy DOM for reliable HTML parsing
- Skips headings inside web components

**Dependencies**: 
- `happy-dom` for HTML parsing and manipulation

**JavaScript Integration**: 
- `src/js/heading-links.js` - Global clipboard functionality
- Imported in `src/index.js`

**CSS Styling**:
- `.heading-link` class styles the paperclip icons
- Hidden by default, visible on heading hover
- Styled at `0.6em` font size for subtlety

## Performance & Loading Optimizations

The site implements several loading optimizations for better performance:

**Resource Preloading** (`src/_includes/index.njk`):
- Main CSS file preloaded with `<link rel="preload" href="/css/main.css" as="stylesheet">`
- Atkinson Hyperlegible font preloaded: `<link rel="preload" href="/assets/fonts/AtkinsonHyperlegibleNextVF-Variable.ttf" as="font" type="font/ttf" crossorigin>`
- Main JavaScript module preloaded: `<link rel="preload" href="/index.js" as="script">`

**Font Display Strategy** (`src/css/main.css`):
- Uses `font-display: swap` for custom fonts to prevent FOIT (Flash of Invisible Text)
- Allows fallback font to display immediately while custom font loads

**Image Loading**:
- All post images use `loading="lazy"` for deferred loading
- Profile picture on homepage uses `fetchpriority="high"` for immediate loading
- Lazy loading applied to:
  - Post listing thumbnails (`src/posts/index.md`)
  - In-content images across all blog posts