# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog/website built with 11ty (Eleventy) static site generator using ESM modules throughout. The site focuses on web development content, particularly web components and modern web APIs. The blog includes interactive code examples powered by custom web components.

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

## Architecture & Structure

### 11ty Configuration (.eleventy.js)
- **Module type**: ESM with `export default function`
- **Input directory**: `src/`
- **Template engine**: Liquid (primary) with Nunjucks templates
- **Plugins**: SEO, RSS feed, custom syntax highlighting with Shiki
- **Custom shortcodes**: `prettyDate`, `socials`, `joinPaths`, `readTime`
- **Passthrough copying**: Handles all static assets automatically

### Content Structure
- **Posts**: Located in `src/posts/YYYY/M/post-name/`
- **Templates**: `src/_includes/` contains Nunjucks templates (nav, footer, post layout)
- **Assets**: `src/assets/` for fonts and images
- **Static files**: CSS, JS, and media files copied directly from `src/`

### Interactive Components
The site includes custom web components built with Lit:

1. **PlayGround Component** (`component/play-ground/`)
   - Interactive HTML/JS editor using CodeMirror
   - Real-time preview in sandboxed iframe
   - Code formatting with Prettier
   - Responsive design with container queries

2. **CodeHighlight Component** (`component/code-highlight/`)
   - Syntax highlighting using highlight.js
   - Supports HTML, CSS, JavaScript, TypeScript
   - Auto-formatting with Prettier
   - Tokyo Night theme styling

3. **QuickSearch Component** (`component/quick-search/`)
   - Site-wide fuzzy search using Fuse.js for blog posts
   - Modal interface with keyboard shortcut (Cmd/Ctrl+K)
   - Auto-generates searchable index from post metadata
   - Responsive design with backdrop blur and focus management

4. **ReadingList Component** (`component/reading-list/`)
   - Displays books from Google Sheets with comprehensive filtering and sorting
   - Multi-year support, grade conversion, and dynamic status filtering
   - Built with Lit and TypeScript

### Component Build & Integration System
Each component follows this build pattern:

1. **Individual TypeScript Projects**: Each component in `component/[name]/` has its own:
   - `package.json` with Vite build configuration
   - TypeScript source in `src/`
   - Separate `node_modules` and build process

2. **Vite Build Output**: Components build to `dist/assets/index.js`

3. **Symlink Integration**: Built components are symlinked into main site:
   ```
   src/js/code-highlight.js -> ../../component/code-highlight/dist/assets/index.js
   src/js/play-ground.js -> ../../component/play-ground/dist/assets/index.js
   src/js/quick-search.js -> ../../component/quick-search/dist/assets/index.js
   src/js/reading-list.js -> ../../component/reading-list/dist/assets/index.js
   ```

4. **11ty Asset Processing**: Symlinked JS files are treated as regular assets and copied to `_site/js/` during build

### JavaScript Architecture
- **Entry point**: `src/index.js` - imports all component scripts and initializes mobile menu
- **Component loading**: Components imported as ES modules via symlinks
- **Mobile menu**: Custom vanilla JS implementation (`src/js/mobile-menu.js`)
- **External libraries**: Baseline Status for web standards information

### Styling
- **Main CSS**: `src/css/main.css`
- **Font loading**: Custom variable fonts (Atkinson Hyperlegible, Frank Ruhl Libre) with Fira Code fallback
- **Responsive design**: Mobile-first approach
- **Component styles**: Scoped within web components using Lit's CSS system

## Component Development Workflow

### Building Components
1. Navigate to component directory: `cd component/[component-name]/`
2. Install dependencies: `pnpm install` (if needed)
3. Development: `pnpm run dev` (starts Vite dev server)
4. Build: `pnpm run build` (outputs to `dist/assets/index.js`)
5. The symlink automatically makes the built component available to the main site

### Creating New Components
1. Create new directory in `component/[new-component]/`
2. Set up Vite + TypeScript project structure
3. Install dependencies: `pnpm install`
4. Build the component: `pnpm run build` (outputs to `dist/assets/index.js`)
5. Create symlink: `ln -s ../../component/[new-component]/dist/assets/index.js src/js/[new-component].js`
6. Import in `src/index.js`

## Package Management
- **Main project**: Uses `pnpm` for package management
- **Components**: Each component uses `pnpm` for its individual dependencies
- Components are excluded from main project's `pnpm-lock.yaml` via `.gitignore`

## Content Development

### Blog Posts
- Posts use HTML format (not Markdown) for maximum flexibility with web components
- Each post can include interactive examples using custom components
- Example embedding pattern:
  ```html
  <play-ground html="...interactive code here..."></play-ground>
  <code-highlight lang="javascript">
    <template><script>// code to highlight</script></template>
  </code-highlight>
  ```

### Templates and Layouts
- **Base template**: `src/_includes/index.njk`
- **Post template**: `src/_includes/post.njk` 
- **Navigation**: `src/_includes/nav.njk`
- **Footer**: `src/_includes/footer.njk`

## Netlify Functions (ESM)

The site uses Netlify serverless functions for dynamic data fetching.

### Reading List Function (`netlify/functions/reading-list.mjs`)
- **Module type**: ESM with `export const handler`
- **Purpose**: Fetches and processes book data from Google Sheets
- **Authentication**: Google service account with JWT tokens
- **Features**:
  - Multi-sheet processing (processes sheets with year names like "2024", "2025")
  - Grade conversion (converts 1-5 stars to F-A letter grades)
  - Automatic column detection (Grade vs Stars columns)
  - Data cleaning (trims whitespace from notes)
  - Error handling (graceful fallbacks for failed sheets)

### Required Environment Variables
```
GOOGLE_PROJECT_ID - Google Cloud project ID
GOOGLE_PRIVATE_KEY_ID - Service account private key ID
GOOGLE_PRIVATE_KEY - Full private key (with \n characters)
GOOGLE_CLIENT_EMAIL - Service account email
GOOGLE_CLIENT_ID - Service account client ID
GOOGLE_SHEETS_READING_ID - Target spreadsheet ID
```

### Google Sheets Column Mapping
- **Column A**: Book Name
- **Column B**: Author
- **Column C**: Series (optional)
- **Column D**: Status (Finished, Reading, Not started, etc.)
- **Column E**: Finished Date
- **Column F**: Notes
- **Column G**: Grade (letter) or Stars (1-5, converted to letters)

## Reading List Component Features

### Data Processing
- **Multi-year sheets**: Processes multiple sheets with year-based names
- **Grade normalization**: Converts star ratings to letter grades automatically
- **Data cleaning**: Trims whitespace and handles formatting issues
- **Title case formatting**: Automatically formats titles, authors, and statuses

### User Interface
- **Advanced filtering**: By status, year, grade, series, and search term
- **Column sorting**: All columns sortable with visual indicators (↑/↓)
- **Responsive design**: Works on mobile and desktop
- **Clear filters**: Single button to reset all filters and sorting
- **Loading states**: Proper loading and error handling

### Technical Implementation
- **Built with Lit**: TypeScript web component with reactive properties
- **CSS custom properties**: Themeable with CSS variables
- **Accessible**: Proper ARIA labels and keyboard navigation
- **Performance**: Efficient filtering and sorting algorithms

## QuickSearch Component Features

### Search Architecture
- **Search Engine**: Uses Fuse.js for fuzzy search with configurable scoring
- **Data Collection**: Scrapes `<search-option>` elements at component initialization
- **Search Fields**: Searches across post titles, excerpts, and categories/tags
- **Real-time Results**: Updates search results as user types

### User Interface
- **Modal Dialog**: Centered dialog with backdrop blur and escape-to-close
- **Keyboard Shortcuts**: Cmd/Ctrl+K opens search from anywhere on site
- **Responsive Design**: 80vw width (max 600px), 80vh height with scrollable results
- **Focus Management**: Auto-focus input, proper tab order, visual focus indicators

### Technical Implementation
- **Built with Lit**: TypeScript web component using reactive properties
- **Template Integration**: Uses Nunjucks template (`src/_includes/quick-search.njk`) to generate searchable content
- **Navigation Integration**: Search button in both desktop and mobile navigation
- **Global Access**: Available via `window['quick-search'].open()` method

### Data Structure
Each searchable item includes:
- **Title**: Post title from frontmatter
- **Excerpt**: Post excerpt/description
- **Categories**: Tags from post frontmatter
- **URL**: Post permalink for navigation

## Key Development Patterns

### Component Usage in Posts
- Use `<play-ground>` for interactive code examples
- Use `<code-highlight>` for syntax-highlighted code blocks
- Use `<reading-list>` to display the Google Sheets reading list
- Use `<quick-search>` for site-wide search (automatically included in navigation)
- Components expect specific DOM structure (templates with script/style tags)

### ESM Module Usage
- All JavaScript uses ES modules (`import`/`export`)
- Node.js built-ins use `node:` prefix (`import { join } from "node:path"`)
- Netlify functions use `.mjs` extension for ESM support
- 11ty config uses ESM export syntax

### Asset Handling
- All assets in `src/` are automatically copied to build output
- Fonts, images, videos, and other media preserved in directory structure
- CSS and JS files (including symlinked component builds) maintain their paths

### SEO and Metadata
- Automatic meta tag generation via eleventy-plugin-seo
- RSS feed generation for blog posts
- Social media integration (Bluesky, Mastodon links)