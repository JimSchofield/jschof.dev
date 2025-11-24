# CLAUDE.md

This file provides guidance to Claude Code when working with the repl-playground component.

## Project Overview

This is a web component built with Vite + Lit + TypeScript that provides an interactive code playground/REPL functionality. It's designed to be embedded in blog posts for interactive code examples.

## Development Commands

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production (TypeScript compilation + Vite build)
- `npm run preview` - Preview production build

## Technology Stack

- **Vite** - Build tool and dev server
- **Lit** v3.1.2 - Web component framework
- **TypeScript** v5.2.2 - Type safety with strict configuration
- **ESM modules** throughout

## Component Structure

- Main component: `<repl-playground>`
- Entry point: `src/repl-playground.ts`
- TypeScript config enables experimental decorators for Lit
- Vite config customizes asset naming for predictable output

## Development Notes

- Component extends `LitElement` with Lit decorators
- TypeScript strict mode enabled with additional linting rules
- Build outputs to `dist/` with predictable asset names
- Designed to be embedded as a reusable component in parent blog site