<!-- Copilot / AI agent instructions for quick onboarding -->
# Repository-specific Copilot Instructions

This file gives actionable, repository-specific guidance for AI coding agents working on this project.

- Short summary: Vue 3 + Vite + TypeScript SPA using `pinia`, `ant-design-vue`, `unocss` and `vite` build pipeline. Uses `pnpm` (enforced) and requires Node >= 20.17.0.

## Quick commands
- Install: `pnpm install` (preinstall enforces pnpm via `npx only-allow pnpm`).
- Dev server: `pnpm dev` (runs `vite`).
- Build (regular): `pnpm build` (runs `vite build` via `build-only`).
- Build modes: `pnpm run build:dev`, `pnpm run build:prod`, `pnpm run build:release` (see `package.json` scripts and `vite` `--mode`).
- Type-check: `pnpm run type-check` (uses `vue-tsc --build --force`).
- Lint: `pnpm run lint` / `pnpm run lint:fix` (ESLint configured).

## Where to look (high-value files/dirs)
- `src/main.ts`: app bootstrap and plugin registration.
- `vite.config.ts`: Vite configuration and build-time plugins.
- `config/` (e.g. `config/index.ts`, `build.ts`): holds build-time customization and environment proxy logic.
- `public/config_dev.js` and `public/config_pro.js`: environment-specific runtime config that the app reads at runtime — avoid hardcoding these values.
- `src/api/`: API modules organized by domain (e.g. `admin`, `assetManagement`, `campusAccess`). Follow existing per-domain module pattern when adding endpoints.
- `src/components/`: many reusable components (check `ui/` subfolder for shared primitives). New UI components should follow existing naming and folder patterns.
- `src/stores/`: Pinia stores live here — prefer Pinia for cross-component state.

## Architectural notes (from code inspection)
- Single-page application with modular APIs under `src/api/*`. Services are thin wrappers around `axios` (see `src/api/login.ts` and other modules).
- Build uses multiple modes — code sometimes branches on `import.meta.env.MODE` or runtime `public/config_*.js` values; be careful when changing configuration handling.
- Many components are organized as small presentational pieces (e.g. `CountItem`, `SecondTitle`). Preserve prop-driven design and avoid global side-effects.

## Conventions & patterns
- TypeScript + `.vue` components: project uses `vue-tsc` for type-checking; prefer explicit types on public APIs (stores, composables, exported functions).
- API modules: follow existing folder and function naming; keep request logic in `src/api/*` and mapping/formatting in composables or helpers under `src/composables/` or `src/utils/`.
- Styling: `unocss` + project-specific presets are used; avoid adding global CSS unless necessary. See `uno.config.ts` and `assets/styles`.
- Icons & assets: check `assets/svg` and `assets/images_new`; icon usage often uses `unplugin-icons`.

## Integration points & external dependencies
- Runtime config: `public/config_dev.js` and `public/config_pro.js` are loaded at runtime — changes to config must preserve the expected global object shape.
- Backend API: calls go through `src/api/*` using `axios`; authentication/headers are usually set centrally (search for axios wrapper in `src`).
- Build tools: `vite` + many plugins in `vite.config.ts` and `plugins/` — when adding build-time behavior, update `config/` if it affects environment or proxy logic.

## PR & code-change guidance for AI agents
- Keep changes minimal and localized; update `type-check` if new TS project files change build behavior.
- When adding endpoints, add them under `src/api/<domain>/` following folder naming; prefer adding a small composable under `src/composables/` for reuse.
- When modifying runtime config, update both `public/config_dev.js` and `public/config_pro.js` (and `config/` build hooks) so local dev and production remain consistent.

## Examples
- Add new API `src/api/assetManagement/new.ts` exporting domain functions returning axios promises — mirror `src/api/assetManagement/*` patterns.
- For feature flags or mode-specific logic, check `vite.config.ts` and `config/index.ts` before adding environment branching.

If any part of this guidance is unclear or you'd like more examples (component scaffolding, API wrapper template, or common composables), tell me which area and I'll expand with concrete snippets and file templates.
