# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

**Development:**
- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

**No test commands defined** - this is a fresh Next.js project without tests configured yet.

## Architecture

This is a Next.js 15 project using the App Router with TypeScript and Tailwind CSS v4:

- **App Router structure**: All routes are in the `app/` directory
- **Styling**: Tailwind CSS v4 with PostCSS
- **TypeScript**: Strict mode enabled with path aliases (`@/*` maps to root)
- **Fonts**: Uses Geist Sans and Geist Mono from Google Fonts
- **Linting**: ESLint with Next.js recommended configs

**Key files:**
- `app/layout.tsx` - Root layout with font configuration
- `app/page.tsx` - Homepage component
- `next.config.ts` - Next.js configuration (currently minimal)
- `eslint.config.mjs` - ESLint flat config format

The project follows Next.js App Router conventions where each folder in `app/` represents a route segment.