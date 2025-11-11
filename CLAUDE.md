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

[... rest of the existing file content remains unchanged ...]