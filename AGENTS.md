# FightingApp — Claude Code Guide

React Native + Expo app. This file orients Claude to project conventions.

## Stack

- React Native 0.81, Expo ~54, React 19
- TypeScript (strict)
- Package manager: **bun**
- Navigation: React Navigation v7 (NativeStack + BottomTabs)
- Icons: `@expo/vector-icons` (Ionicons)
- No test framework yet — do not invent one; ask first.

## Scripts (use bun)

- `bun run start` / `ios` / `android` / `web` — Expo dev server
- `bun run typecheck` — `tsc --noEmit`
- `bun run lint` / `lint:fix`
- `bun run format` / `format:check` — Prettier
- `bun run spellcheck` — cspell
- `bun run check` — **the canonical pre-done gate**: spellcheck → format:check → typecheck → lint:fix. Run this before finishing any task and resolve all failures.

## Structure (`src/`)

- `navigation/` — `AppNavigator.tsx`; NativeStack root wrapping BottomTabs
- `screens/` — Home, Explore, Profile, Settings
- `components/` — shared primitives (Button, Card, Input)
- `theme/` — Colors, Typography, Spacing, Radii, Shadows
- `hooks/` — custom hooks (useToggle, useFetch, …)
- `utils/` — shared helpers
- `types/` — shared types, including navigation param lists

## Path aliases (from `tsconfig.json`)

Use these instead of long relative paths:
`@/*`, `@components/*`, `@screens/*`, `@theme/*`, `@hooks/*`, `@utils/*`, `@types/*`, `@navigation/*`

## Styling

- Use `StyleSheet.create` with tokens from `src/theme/`.
- **Do not hard-code** colors, font sizes, spacing, or radii — import from the theme.
- Extend the theme rather than duplicating values inline.

## Environment variables

- Single source of truth: [src/config/env.ts](src/config/env.ts). Import vars from `env` there — never read `process.env` anywhere else (ESLint enforces this).
- Only `EXPO_PUBLIC_*` vars are available in the RN runtime. Never put secrets in the app — they get bundled into the APK/IPA.
- To add a new var: declare it in `.env`, then add it to the zod schema in `src/config/env.ts`.

## TypeScript

- Strict mode is on. **Never introduce `any`** — use proper types or `unknown` + narrowing.
- Navigation route/param types live in `src/types/`.

## Linting (flat config: `eslint.config.mjs`)

These are agent-level rules: every coding agent working in this repo must follow them before writing or changing code.

Notable rules to respect up front:

- no `any`
- no floating promises (await or explicitly `void`)
- strict naming conventions
- import ordering
- cognitive complexity warnings — keep functions focused
- no direct `process.env` reads outside `src/config/env.ts`

Run `bun run lint:fix` to auto-fix before finishing.

## Before finishing any task (REQUIRED)

Always run `bun run check` before ending your turn. If it reports any error or warning — from spellcheck, prettier, typecheck, or eslint — **fix them yourself and run it again**. Do not hand the task back to the user until `bun run check` exits cleanly. This is a hard rule, not a suggestion.
