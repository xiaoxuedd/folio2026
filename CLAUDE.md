# Repo guide for AI agents

Personal portfolio for **Xiaoxue Dong** (service designer & strategist), deployed at <https://designdoings.com>. Static site built with **Astro 4 + React 19**, shipped to GitHub Pages.

This file is the orientation doc. Read it first. It tells you where things live, what the conventions are, and which file to open for any common task.

---

## TL;DR map

```
folio2026/
├── astro.config.mjs        # Site URL, image pipeline, vendor chunks, inline CSS
├── tsconfig.json           # Strict; path alias @/* -> src/*
├── package.json            # Scripts (dev/build/preview/test:seo/test:performance)
├── public/                 # Served as-is — favicons, CNAME, robots.txt, sitemap.xml,
│                           #   resume PDF, legacy meta-refresh redirects, raw SVGs
├── scripts/                # Dev tooling: image optimization, SEO/perf smoke tests
└── src/
    ├── pages/              # 1 file per route: index, about, healthcare, 404
    ├── layouts/Layout.astro    # HTML shell, design tokens, theme bootstrap, AOS init
    ├── components/         # Astro sections + React islands, co-located CSS
    │   └── icons/          # Astro icon components
    ├── config/aos.ts       # AOS animation options
    ├── data/               # Content as TS modules (projects, expertise)
    ├── images/             # Bundled assets — go through Astro image pipeline
    ├── registry/magicui/   # rough-notation Highlighter wrapper
    ├── utils/analytics.ts  # gtag trackEvent helper
    └── env.d.ts
```

**Path alias:** `@/*` resolves to `src/*` (e.g. `import { Highlighter } from '@/registry/magicui/highlighter'`).

---

## Tech stack

- **Astro 4** (`output: 'static'`, `inlineStylesheets: 'always'`) with `@astrojs/react`
- **React 19** for interactive islands, hydrated `client:load` (above the fold) or `client:visible` (below)
- **TypeScript** extends `astro/tsconfigs/strict` — type errors fail the build
- **Sharp** image service → responsive WebP/AVIF
- **AOS** for scroll-reveal animations (init in `Layout.astro`, opts in `src/config/aos.ts`)
- **GSAP**, **Framer Motion**, **rough-notation** available for richer motion
- **Lucide React** for icon glyphs in `.tsx`
- Self-hosted **Inter** via `@fontsource/inter` (weights 400/500/600/700)
- **Google Analytics** via gtag in `Layout.astro`; use `trackEvent()` from `src/utils/analytics.ts`

---

## Conventions (follow these)

### Astro vs React

- **Astro** (`.astro`) for static section markup, page composition, server-rendered content, and anything image-pipeline related.
- **React** (`.tsx`) for state, effects, hover/scroll interactions, animation libraries.
- Hydrate React islands explicitly: `client:load` for above-the-fold/critical, `client:visible` for everything else. Avoid `client:idle` unless you have a reason.
- Co-locate CSS next to the component: `Foo.tsx` + `Foo.css`. Astro components use scoped `<style>` blocks.

### Design tokens

**All visual primitives are CSS custom properties defined in `src/layouts/Layout.astro`** under `:root` and `[data-theme="dark"]`. Use them — don't hardcode colors, spacing, type sizes, shadows, radii, or blur values.

Token families (full list in `Layout.astro`):

| Family | Examples |
| --- | --- |
| Color | `--color-primary`, `--color-text`, `--color-text-secondary`, `--color-bg`, `--color-bg-secondary`, `--color-border`, `--color-primary-alpha-light/medium`, `--color-gold`, `--color-icterine` |
| Spacing | `--spacing-xs/sm/md/lg/xl/2xl` |
| Gaps | `--gap-tight/xs/sm/md/lg/xl/2xl/3xl` |
| Typography (size) | `--font-size-h0..h6`, `--font-size-body-0/1`, `--font-size-ui-lg/sm/xs` |
| Typography (weight/line) | `--font-weight-regular/medium/semibold/bold`, `--line-height-hero/headings/body` |
| Radii | `--radius-xs/sm/md/lg/xl/2xl/3xl/pill/full` |
| Shadows | `--shadow-sm/md/lg/hover` |
| Transitions | `--transition-fast/normal/slow` |
| Blur | `--blur-glass/menu/overlay` |
| Icon sizes | `--icon-xs/sm/md/lg/xl/2xl/3xl` |

Adding a new token? Put it in `Layout.astro` alongside its family — don't scatter `--my-color: …` declarations across components.

### Theming

- State lives on `<html data-theme="light|dark">`.
- Toggle: call the global `window.toggleTheme()` (defined inline in `Layout.astro`).
- A pre-paint inline script reads `localStorage.theme` to avoid FOUC. Don't move it.
- For dark-mode overrides inside a scoped Astro `<style>`, use `:global([data-theme="dark"]) .selector { … }`. In React component CSS, write the same selector at the top level (it's a global stylesheet).

### Images

- **Bundled, optimized assets** → `src/images/...`. Import them and pass to `<Image>` or `getImage()` from `astro:assets`. Output is responsive WebP/AVIF.
- **Raw / pipeline-bypass assets** (favicons, PDFs, OG images served verbatim) → `public/`.
- Responsive card pattern: see the size-array + `getImage` loop in `src/components/ProjectCard.astro`.
- Healthcare carousel pattern: see the `Promise.all([getImage(...)])` block at the top of `src/pages/healthcare.astro`.

### Animations

- Scroll reveal: drop `data-aos="fade-up"` (and optional `data-aos-delay="100"`) on any Astro element. AOS init is global; no per-component setup needed.
- Custom AOS overrides (e.g. larger upward translate) live in `Layout.astro`'s global stylesheet.
- `prefers-reduced-motion` disables smooth scroll in `Layout.astro`. AOS handles its own reduce-motion behaviour.

### Analytics

```ts
import { trackEvent } from '../utils/analytics';      // .astro / .tsx in components/
import { trackEvent } from '@/utils/analytics';        // anywhere with the alias

trackEvent('event_name', { key: value });
```

Existing events (search before inventing new ones): `navigation_click`, `theme_toggle`, `social_click`, `mobile_menu_toggle`, `project_click`.

### Icons

- **Astro icons** (used in `.astro` files) live in `src/components/icons/*.astro`. Props: `{ width?: number; height?: number; class?: string }`. Follow the existing pattern (`LinkedInIcon`, `ArrowIcon`, `ChevronDownIcon`, `DownloadIcon`, `EmailIcon`, `QuoteIcon`).
- **React icons** (used in `.tsx` files) come from `lucide-react`.

---

## "Where do I edit X?"

| Goal | File |
| --- | --- |
| Add or edit a project card | `src/data/projects.ts` (image goes in `src/images/projects/`) |
| Add or edit an expertise area | `src/data/expertise.ts` |
| Healthcare case study copy / metrics / reflections / testimonials | `src/pages/healthcare.astro` (inline arrays + JSX) |
| About-page contact copy | `src/components/Contact.astro` |
| Client logo wall | `src/components/About.astro` (logos in `src/images/clients/`, `-dark` variants required) |
| Navigation links / hamburger / theme toggle / pill-shrink behaviour | `src/components/Navigation.astro` |
| Footer | `src/components/Footer.astro` |
| Site `<title>` / meta description / OG defaults | `src/layouts/Layout.astro` (Layout `Props` defaults) |
| Global CSS reset, body styles, button styles | `src/layouts/Layout.astro` global `<style>` |
| Add or change a design token | `:root` block in `src/layouts/Layout.astro` |
| Add a new page | new file in `src/pages/`, wrap content in `<Layout>`, include `<Navigation>` + `<Footer>`. Update `public/sitemap.xml`. |
| Update sitemap | `public/sitemap.xml` (hand-maintained — see Gotchas) |
| Custom domain | `public/CNAME` + `astro.config.mjs` (`site` and `base`) |
| Change AOS defaults | `src/config/aos.ts` |
| Add a new analytics event | call site + (optionally) document in this file |

---

## Page → component map

- **`src/pages/index.astro`** → `Navigation`, `Hero` (`HeroText` + `HeroCTAAlternative`), `Craft` (+ `CraftAccordion`, reads `data/expertise`), `ProjectsShowcase` (+ `ProjectCard`, reads `data/projects`), `About` (client logos), `Footer`
- **`src/pages/about.astro`** → `Navigation` (compact mode), `Contact` (uses `ProfilePhoto` + `ClosingStatement`), `Footer`
- **`src/pages/healthcare.astro`** → `ProjectNavigation`, `ChallengeDiagram`, `ChallengeGraphic`, `ImageCarousel` (×3 with different image sets), `JourneyAnimation` (composes `JourneyIcons` + `JourneyLabels` + `JourneyLabelsAnimated` + `JourneyCornerIcons`), `ImpactMetrics` (+ `GlassIcon`), `TestimonialCarousel`, `PillarNumber`, `CircleTitle`, `Footer`
- **`src/pages/404.astro`** → `Layout` only

---

## Data shapes

### `src/data/projects.ts`

```ts
interface Project {
  id: number;
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  image: ImageMetadata | string;       // import the asset; string path is legacy
  tags: string[];
  link?: string;                        // makes the card clickable
  scope?: string;
  responsibilities?: string[];
  outcomes?: string[];
  industry?: string;
  duration?: string;
  overlaySubtitle?: string;             // shown in hover overlay
  overlayBody?: string;                 // shown in hover overlay (clamped)
}
```

### `src/data/expertise.ts`

```ts
interface ExpertiseArea {
  title: string;
  description: string;     // \n separates paragraphs in the accordion body
}
```

---

## Build, dev, deploy

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server at <http://localhost:4321> |
| `npm run build` | `astro check` (type check) then `astro build`. **Type errors fail the build.** |
| `npm run preview` | Serve the production build locally |
| `npm run test` | `build` + `test:seo` |
| `npm run test:seo` | Run `scripts/test-seo.js` against the build |
| `npm run test:performance` | Run `scripts/test-performance.js` |

Deployment: GitHub Pages workflow under `.github/workflows/`. Custom domain in `public/CNAME`; `astro.config.mjs` uses `site: 'https://designdoings.com'` and `base: '/'`.

---

## Gotchas

- **`public/about-me.html`, `public/contact.html`** are legacy meta-refresh redirects to `/about`. They preserve old inbound URLs — leave them unless you've audited every link.
- **`public/sitemap.xml`** is hand-maintained. Update `lastmod` when pages change, or migrate to `@astrojs/sitemap` if you need automation.
- **`Navigation.astro`** has a non-passive scroll handler that drives the pill-shrink animation by writing inline transforms each frame. Don't add expensive work to that handler — and if you change scroll behaviour, audit it for jank on long pages.
- **`healthcare.astro`** ends with three `setTimeout(setupCircleTitleAnimations, …)` calls. They're a defensive workaround for path-length init ordering, not load-bearing logic. If you fix the underlying ordering, you can remove them.
- **`inlineStylesheets: 'always'`** in `astro.config.mjs` inlines all CSS into HTML. Keep per-page CSS reasonable.
- **`tsconfig.json`** extends `astro/tsconfigs/strict` — unused vars, implicit `any`, etc. will fail `astro check` and therefore `npm run build`.
- **Vendor chunking:** React and Framer Motion are split into separate chunks via `vite.build.rollupOptions.output.manualChunks` in `astro.config.mjs`. If you add another large dep, consider doing the same.
- **Dark-mode logo swap** in `About.astro` uses a `MutationObserver` on `<html data-theme>`. Each new logo needs both light and dark variants in `src/images/clients/`.
- **`prefers-reduced-motion`** is honoured for smooth scrolling in `Layout.astro` but not separately for AOS — AOS has its own handling. Don't add new GSAP/Framer animations without checking the user's preference.
