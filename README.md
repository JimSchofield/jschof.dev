# jschof.dev

Personal blog/website built with [11ty](https://www.11ty.dev/) v3, featuring interactive web component examples published as `@jschofield/*` packages on npm.

## Getting Started

```bash
pnpm install
pnpm start
```

This builds all web components, then starts the 11ty dev server at `http://localhost:8080`.

## Project Structure

This is a **pnpm workspace** monorepo:

```
.
├── src/                    # 11ty site source (templates, posts, CSS, assets)
├── component/              # Web component workspace packages
│   ├── play-ground/        # @jschofield/play-ground — code editor (CodeMirror + Lit)
│   ├── code-highlight/     # @jschofield/code-highlight — syntax highlighting
│   ├── quick-search/       # @jschofield/quick-search — site-wide search (Fuse.js)
│   ├── reading-list/       # @jschofield/reading-list — Google Sheets reading list
│   ├── repl-playground/    # @jschofield/repl-playground — JavaScript REPL
│   └── scroll-explain/     # @jschofield/scroll-explain — scroll-driven explanations
├── site-entry.js           # Client JS entry point (bundled by esbuild)
├── .eleventy.js            # 11ty config + esbuild bundling
├── pnpm-workspace.yaml     # Workspace config + dependency catalog
└── .changeset/             # Changeset config for versioning/publishing
```

## Scripts

| Command | Description |
|---|---|
| `pnpm start` | Build components + start 11ty dev server |
| `pnpm build` | Build components + build 11ty for production |
| `pnpm build:components` | Build all web components |
| `pnpm dev:components` | Start all component Vite dev servers in parallel |

## Web Components

Each component is a standalone Vite + TypeScript + Lit project that builds into `dist/` and is imported by the blog via workspace protocol dependencies. They're published to npm under the `@jschofield` scope.

### Working on a component

```bash
# Build a single component
pnpm --filter @jschofield/play-ground build

# Dev server for a single component
pnpm --filter @jschofield/play-ground dev
```

### Dependency Management

Shared dependencies (`lit`, `vite`, `typescript`, `prettier`) are version-pinned in `pnpm-workspace.yaml` using the [catalog protocol](https://pnpm.io/catalogs). Components reference them with `"lit": "catalog:"` in their `package.json`, keeping versions consistent across the workspace.

```bash
# Check for outdated deps across all packages
pnpm outdated -r

# Update all packages
pnpm update -r
```

## Publishing Components

Components use [changesets](https://github.com/changesets/changesets) for versioning and publishing.

A **pre-commit hook** will remind you to add a changeset when you modify component source files. To add one:

```bash
pnpm changeset        # select packages, pick semver bump, write summary
git add .changeset    # stage the changeset file
```

To release:

```bash
pnpm changeset version   # bump versions + write changelogs
pnpm build:components    # rebuild
pnpm changeset publish   # publish to npm
```

For first-time publishing:

```bash
pnpm build:components
pnpm -r --filter './component/*' publish --access public
```

## Deployment

Deployed on [Netlify](https://www.netlify.com/). The build command (`pnpm build`) builds all components with Vite, bundles `site-entry.js` with esbuild, then runs 11ty to generate the static site into `_site/`.
