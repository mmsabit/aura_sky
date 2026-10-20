# AGENTS.md

Single-package Vite 8 + React 19 + TypeScript SPA styled with Tailwind CSS 4 via `@tailwindcss/vite`. No backend, router, tests, CI, or formatter config.

## Layout / entrypoints
- `index.html` → `src/main.tsx` → `src/App.tsx`; `App` composes `SiteHeader`, four `<section>`s, and `SiteFooter` from `src/components/`.
- Page data is hardcoded in component-level arrays (`metrics`, `forecast`, footer columns). The line/bar charts are hand-authored inline SVG with fixed `viewBox` coordinates — changing a value means editing the data *and* the matching SVG geometry.
- The page is a light-only dashboard; visual direction is Material-style sky blue. Keep using the design-token classes instead of raw colors.
- `src/index.css` is the Tailwind entry: `@import "tailwindcss"` + `@config "../tailwind.config.js"` + base rules. Tailwind 4 auto-detects source classes; the legacy `content` globs in the config are not what drives scanning. Tokens live in `tailwind.config.js`: colors (`surface-*`, `on-surface`, `secondary-*`, `outline`), spacing (`space-*`, `margin`, `margin-tablet`, `margin-desktop`), and the type scale (`display-hero`, `headline-*`, `body-*`, `label-*`, `data-metric`) where the font-size entry also sets line height/weight.
- Google Fonts (Inter, Plus Jakarta Sans) and Material Symbols Outlined are loaded via `<link>`s in `index.html`; icons are `<span className="material-symbols-outlined">icon_name</span>`. The page needs network access for fonts/icons.
- Images are local: `public/logo.png` (also the favicon) plus `src/assets/logo.png` and `src/assets/avatar.jpg`.
- npm is the package manager (`package-lock.json`, lockfile v3). Vite 8 requires Node `^20.19 || >=22.12`.

## Commands
```bash
npm install
npm run dev      # Vite dev server with HMR
npm run build    # tsc -b && vite build -> writes dist/
npx tsc -b       # typecheck only; there is no separate typecheck script
npm run lint     # eslint . (only src/**/*.ts,tsx are matched)
npm run preview  # serves dist/; run a build first
```
- `npm run build` fails on type errors; run `npx tsc -b` for a fast check before claiming success.
- No test runner is installed and there is no `test` script — do not invent test commands.

## TypeScript constraints (`tsconfig.app.json`)
- `verbatimModuleSyntax` is on: type-only imports must use `import type`.
- `erasableSyntaxOnly` is on: no `enum`, `namespace`, or constructor parameter properties. Use union types / `const` objects.
- `noUnusedLocals` and `noUnusedParameters` are on: unused variables break the build.
- No `@/` path alias exists (neither Vite nor TS); use relative imports.
- `strict` is **not** enabled. Don't assume strictness, and don't flip it on unasked.
- Project references split app (`src/`) from node config (`vite.config.ts`); scope `tsc -b` with a config path when checking only one side.

## Config notes
- Tailwind runs through the `@tailwindcss/vite` plugin in `vite.config.ts`. There is no `postcss.config.js`, and PostCSS/autoprefixer are intentionally not installed — don't add a second Tailwind pipeline.
- ESLint flat config: `js/tseslint recommended` + react-hooks + react-refresh (`vite` preset); ignores `dist` only. No type-aware lint rules.
- `vite.config.ts` is minimal (React + Tailwind plugins only); no env vars, proxies, or aliases are configured.
