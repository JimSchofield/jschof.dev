# CLAUDE.md

This file provides guidance to Claude Code when working with the repl-playground component.

## Project Overview

This is a secure JavaScript REPL (Read-Eval-Print-Loop) web component built with Vite + Lit + TypeScript. It provides an interactive code playground with a split-pane interface: code editor on the left, terminal-like output on the right. Designed to be embedded in blog posts for interactive JavaScript examples.

## Development Commands

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality checks
- `npm run lint:fix` - Run ESLint and auto-fix issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is formatted correctly
- `npm run typecheck` - Run TypeScript type checking without compilation

## Technology Stack

- **Vite** - Build tool and dev server (version managed via pnpm catalog)
- **Lit** - Web component framework (peer dependency, `^3.0.0`)
- **TypeScript** - Type safety with strict configuration (version managed via pnpm catalog)
- **CodeMirror 6** - Code editor with JavaScript syntax highlighting, vim mode support (peer dependencies)
- **ESM modules** throughout
- **Prettier** - Code formatting (peer dependency, `^3.0.0`)

### Peer Dependencies

This component externalizes shared libraries as peer dependencies. The consuming app must provide them. See `peerDependencies` in `package.json` for the full list:

- `lit` ^3.0.0
- `prettier` ^3.0.0
- `@codemirror/commands`, `@codemirror/lang-javascript`, `@codemirror/language`, `@codemirror/state`, `@codemirror/theme-one-dark`, `@codemirror/view`
- `@replit/codemirror-vim` ^6.3.0

The Vite build config (`vite.config.js`) uses `rollupOptions.external` to exclude these from the bundle.

## Component Architecture

### Main Features
- **Split-pane layout**: Editor (left) + output (right)
- **Secure sandbox execution**: iframe with `allow-scripts` only (or web worker via `web-worker` attribute)
- **Tokyo Night theme**: Custom dark theme for editor
- **Vim mode support**: Toggle between normal and vim editing modes
- **Global state management**: Vim mode preference persists across browser sessions and syncs across all component instances
- **Real-time output**: Captures console.log, errors, and return values
- **Line numbers** (opt-in via `line-numbers` attribute): Dynamically toggleable — uses a CodeMirror `Compartment` so flipping the attribute reconfigures the extension set without rebuilding the editor
- **Code folding** (via `fold="1,5,23-34"`): Single numbers use language-aware folding (the block starting at that line); ranges fold specified lines explicitly. Fold gutter + fold keymap are active when the attribute is set.
- **Mobile responsive**: Stacks vertically on small screens

### Key Files
- `src/repl-playground.ts` - Main component implementation
- `src/repl-playground-state.ts` - Global state management utility
- `index.html` - Demo page with sample code template
- `eslint.config.js` - ESLint configuration with TypeScript/Lit support
- `.prettierrc` - Prettier formatting configuration

### Component Usage
```html
<repl-playground>
  <template>
    <script>
      // Initial JavaScript code goes here
      console.log("Hello, World!");
    </script>
  </template>
</repl-playground>
```

## Security Implementation

### Sandboxed Execution
- **iframe sandbox**: `allow-scripts` only (no forms, navigation, same-origin)
- **Separate origin**: Prevents access to parent window/DOM
- **postMessage communication**: Secure message passing with origin validation
- **Execution timeout**: 5-second limit prevents infinite loops
- **Console capture**: Override console methods to capture output safely

### Code Execution Flow
1. User code sent to sandboxed iframe via postMessage
2. Code executed in isolated environment with eval()
3. Console output captured and formatted
4. Results sent back to parent component
5. Terminal display updated with formatted output

## Styling and Theme

### Tokyo Night Color Scheme
- **Background**: `#1a1b26` (dark blue-black)
- **Text**: `#c0caf5` (light blue-white)
- **Selection**: `#364A82` (blue highlight)
- **Borders**: `#333` (dark gray)

### Layout Structure
- **Split-pane**: CSS Grid with 1fr 1fr columns
- **Editor pane**: CodeMirror with controls at bottom
- **Output pane**: Header with clear button + scrollable terminal
- **Controls**: Run button, Reset button, keyboard hint
- **Responsive**: Stacks vertically on mobile (768px breakpoint)

## Controls and Keyboard Shortcuts

### Buttons
- **Run**: Execute code (shows "Running..." when active)
- **Reset**: Restore initial code and clear output
- **Clear**: Clear output only (in output pane header)

### Keyboard Shortcuts
- **Cmd+Enter** (Mac) / **Ctrl+Enter** (Windows/Linux): Execute code
- Platform-aware hint displayed in controls

## Output Formatting

### Enhanced JavaScript Object Display
- **Class instances**: `ClassName { prop: value }`
- **Arrays**: Pretty-printed with proper indentation
- **Objects**: Recursive formatting with proper spacing
- **Functions**: `[Function: functionName]`
- **Primitive types**: Strings show with quotes for return values
- **Error handling**: Clear error messages with context

### Output Types
- **Console output**: Direct console.log, warn, error messages
- **Return values**: Prefixed with `→` arrow
- **Errors**: Red text with "Error:" prefix
- **Execution status**: Blue "Executing..." indicator

## Development Notes

### Template Literal Whitespace
- **Critical**: Keep output template literals on single lines to prevent HTML whitespace
- **Correct**: `html`<div>${content}</div>``
- **Incorrect**: Multi-line templates with indentation (adds unwanted whitespace)

### Extension Compatibility
- Avoid complex CodeMirror extensions due to version conflicts
- Active extensions: `drawSelection`, `lineNumbers` (compartmentalized), `foldGutter`, `history`, `indentOnInput`, `javascript`, `tokyoNight`, keymaps. `vim` is added conditionally.
- AutoCompletion was removed due to compatibility issues
- **Dynamic extension toggling**: Use `Compartment` from `@codemirror/state` and dispatch `compartment.reconfigure(...)` in Lit's `updated()` lifecycle. `lineNumbers` uses this pattern — preserves cursor, selection, undo stack, and vim state across toggles.

### Component State
- Uses Lit `@state()` for reactive properties
- Editor and sandbox initialized in `firstUpdated()`
- Initial code extracted from `<template><script>` content on connect

## Customization

### Initial Code
The component automatically extracts JavaScript code from a template element:
- Finds `<template><script>` inside the component
- Removes common indentation for clean formatting
- Fallback to default message if no template provided
- Reset button restores original template code

### Styling Customization
- Modify CSS custom properties in component styles
- Tokyo Night theme colors easily adjustable
- Component height fixed at 500px (can be modified)
- All styling encapsulated in shadow DOM