# Repo guide for AI agents

Personal portfolio for **Xiaoxue Dong** (service designer & strategist), deployed at <https://designdoings.com>. Static site built with **Astro 4 + React 19**, shipped to GitHub Pages.

This file covers the non-obvious bits — conventions, visual rules, and gotchas. Structure, types, and component composition you can read from the codebase directly. Path alias: `@/*` → `src/*`.

---

## Tech stack

- **Astro 4** (`output: 'static'`, `inlineStylesheets: 'always'`) + `@astrojs/react` + **React 19**. **TypeScript** strict; type errors fail `pnpm run build`.
- **Sharp** image service → responsive WebP/AVIF.
- Motion: **AOS** (init in `Layout.astro`, opts in `src/config/aos.ts`), **Framer Motion**, **GSAP**, **rough-notation**.
- **Lucide React** icons in `.tsx`; Astro icons in `src/components/icons/*.astro`.
- Self-hosted via `@fontsource`: Manrope (300–800) headings, Inter 300 body, Cormorant Garamond 400 italic for pull quotes.
- **Google Analytics** via gtag in `Layout.astro`; use `trackEvent()` from `@/utils/analytics`.

---

## Visual direction (redesign in progress)

Single accent: **Electric Mint** (replaces coral). Cool grey neutrals with a subtle purple tint. Clean white + near-black ink + mint, Manrope headings, light-weight Inter body.

- **Corners.** Sharp 0px on the `ContactCTA` button. Project tile images (`ProjectCard` `.project-tile__media`) use `--radius-lg` to match the about-page tiles. Older chrome (nav pill, hero avatar pill) is intentionally still rounded — don't "fix" it unless asked.
- **Editorial layout** — Selected Works is 2-up featured + 3-up grid; all cards use the same title size (`--font-size-h4`), industry sub-line under the title, glass status pill ("Case study" / "Coming soon"), mint hover overlay reveals the `overlaySubtitle` tagline (semibold, larger) then `overlayBody` intro paragraph below it.
- **Token-first, hard rule.** Use `Layout.astro` design tokens; never hardcode color/space/radius. Prefer canonical semantic names (`--bg`, `--surface`, `--text`, `--accent`) for new code; `--color-*` aliases exist only for backward-compat.
- Glass pills (`backdrop-filter: blur(var(--blur-glass))`) are an intentional rounded exception.
- **`--project: #5B3CEE`** is project-scoped (case-study context only). Never use as a site-level UI accent.

---

## Conventions

**Astro vs React.** Astro for static markup, page composition, image-pipeline. React for state/effects/hover/scroll/animation libraries. Hydrate islands explicitly: `client:load` above the fold, `client:visible` below. Co-locate CSS: `Foo.tsx` + `Foo.css`; Astro uses scoped `<style>`.

**Design tokens.** All visual primitives are CSS custom properties in `src/layouts/Layout.astro` (`:root` + `[data-theme="dark"]`) — colours (semantic + special: `--color-bg-inverse`/`--color-text-inverse` are theme-independent), spacing/gaps, typography, radii, shadows, transitions, blur, icon sizes. Read the file for the full set. Use canonical names for new code; legacy `--color-*` aliases stay for backward-compat.

**Theming.** State on `<html data-theme="light|dark">`. Toggle via `window.toggleTheme()` (defined in `Layout.astro`). A pre-paint inline script reads `localStorage.theme` to avoid FOUC — don't move it. Dark overrides: `:global([data-theme="dark"]) .selector` in scoped Astro `<style>`; in React component CSS, write the same selector at top level (it's a global stylesheet).

**Images.** Bundled assets → `src/images/...` via `<Image>` / `getImage()` from `astro:assets` (responsive WebP/AVIF). Pipeline-bypass (favicons, PDFs, OG images) → `public/`. Patterns: size-array + `getImage` loop in `ProjectCard.astro`; healthcare carousel `Promise.all([getImage(...)])` block at the top of `healthcare.astro`.

**Animations.** Scroll reveal: `data-aos="fade-up"` (+ optional `data-aos-delay`) on any element — AOS is initialised globally. Custom AOS overrides live in `Layout.astro`'s global stylesheet. `prefers-reduced-motion` disables smooth scroll in `Layout.astro`; AOS handles its own reduce-motion behaviour. Don't add new GSAP/Framer without checking the user's preference.

**Analytics.** `import { trackEvent } from '@/utils/analytics'`. Existing events (search before inventing new ones): `navigation_click`, `theme_toggle`, `social_click`, `mobile_menu_toggle`, `project_click`, `hero_pronunciation_open`.

---

## "Where do I edit X?"

| Goal | File |
| --- | --- |
| Project card | `src/data/projects.ts` (image in `src/images/projects/`). **First 2 entries render featured (4:3, 2-up); rest are 4:5 in a 3-up grid** — see `ProjectsShowcase.astro`. `link` flips the status pill from "Coming soon" to "Case study"; `industry` is the sub-line under the title; `overlaySubtitle` is the hover tagline (shown larger); `overlayBody` is the hover intro paragraph (shown below the tagline) |
| Expertise area | `src/data/expertise.ts` (renders in `Craft` accordion; `\n` separates paragraphs in body) |
| Healthcare case study (copy / metrics / reflections / testimonials) | `src/pages/healthcare.astro` (inline arrays + JSX) |
| Home-page testimonials | `src/components/Testimonials.astro` → `TestimonialCarousel`. **Currently not mounted in `index.astro`** — re-add `<Testimonials />` to show it |
| Client logo marquee | `src/components/About.astro` (logos in `src/images/clients/`, `-dark` variants required — see Gotchas) |
| Closing CTA | `src/components/ContactCTA.astro` (always-dark via inverse tokens; scroll-driven expansion — see Gotchas) |
| Healthcare page nav | `src/components/ProjectNavigation.tsx` + `.css` (token-driven; mirrors `Navigation`) |
| Site `<title>` / meta / OG defaults, global CSS, design tokens | `src/layouts/Layout.astro` |
| New page | new file in `src/pages/`, wrap in `<Layout>`, include `<Navigation>` + `<Footer>`. Update `public/sitemap.xml` |
| Sitemap | `public/sitemap.xml` (hand-maintained — see Gotchas) |
| Custom domain | `public/CNAME` + `astro.config.mjs` (`site` and `base`) |
| AOS defaults | `src/config/aos.ts` |
| Cursor-proximity tilt on a surface | `src/components/ProximityTilt.tsx` (see `ProximityTilt.README.md` for parent-sizing constraint). Easing in `src/utils/proximity.ts`, shared with `RadialDiagram` |

Section anchors used by `Navigation`: `#works` (ProjectsShowcase), `#about` (About). Nav links are "Work" and "About" only — "Skills & Tools" was removed.

---

## Build, dev, deploy

| Command | Purpose |
| --- | --- |
| `pnpm run dev` | Dev server at <http://localhost:4321> |
| `pnpm run build` | `astro check` + `astro build`. **Type errors fail the build.** |
| `pnpm run preview` | Serve production build locally |
| `pnpm run test` | `build` + `test:seo` |
| `pnpm run test:seo` / `test:performance` | Smoke tests in `scripts/` |

Deployed via GitHub Pages workflow (`.github/workflows/`). Custom domain in `public/CNAME`; `astro.config.mjs` uses `site: 'https://designdoings.com'`, `base: '/'`.

---

## Gotchas

- **Legacy redirects** — `public/about-me.html`, `public/contact.html` are meta-refresh redirects to `/about` preserving old inbound URLs. Don't delete without auditing every link.
- **Bottom-overscroll canvas colour** — a global inline script in `Layout.astro` sets `document.documentElement.style.backgroundColor` to `--color-bg-inverse` while scrolled to the page bottom, then clears it otherwise. This keeps Safari's bottom rubber-band dark (matching the always-dark footer) without darkening the top overscroll. `maxScroll` is cached and refreshed via a `ResizeObserver` on `body` (the CTA sets its wrapper height in JS after load), so the scroll handler never reflows. Don't set a static `html { background }` — it'd defeat the split (and the inline style would override it anyway near the bottom).
- **Hand-maintained sitemap** — `public/sitemap.xml`. Update `lastmod` when pages change, or migrate to `@astrojs/sitemap`.
- **Nav scroll handler (`Navigation.astro`)** is non-passive and writes inline transforms each frame for the pill-shrink. Keep it cheap; audit for jank if you change scroll behaviour.
- **Healthcare init shim** — three trailing `setTimeout(setupCircleTitleAnimations, …)` calls in `healthcare.astro` work around path-length init ordering. Not load-bearing; remove if you fix the underlying ordering.
- **`inlineStylesheets: 'always'`** inlines all CSS into HTML — keep per-page CSS reasonable.
- **Vendor chunking** — React + Framer Motion are split via `vite.build.rollupOptions.output.manualChunks` in `astro.config.mjs`. Add new large deps to that list.
- **Dark-mode logo swap** in `About.astro` uses a `MutationObserver` on `<html data-theme>`. Each new client logo needs both light and `-dark` variants in `src/images/clients/`.
- **Client marquee is JS-driven** (`About.astro`). Inline script disables the CSS animation at mount, drives `translateX` per rAF (wraps at `scrollWidth / 2`), eases velocity (exponential lerp) toward a target set by **cursor-proximity smoothstep** to the marquee's bounding box — full stop when pointer is inside, ramps back on leave. Replaced CSS `animation-play-state: paused`, which snapped a frame on hover. The `@keyframes marquee-scroll` is now only the reduced-motion / no-JS fallback. Logos are `loading="eager"` so `scrollWidth` is accurate before frame 1.
- **Marquee seam** — strip is one logo set rendered twice. Wrap stays seamless because spacing is a per-item `margin-right` (track = *N items + N gaps*). **Don't switch to flex `gap`** — gives *N + (N−1) gaps* and a visible half-gap jump at the seam. Dark-mode swap updates both copies via `querySelectorAll`.
- **`CraftAccordion.astro` is click-only, single-open**, first item open by default. Hover-to-open was removed on purpose — tall panels made the page jump as the cursor crossed items. Don't re-add it.
- **Framer Motion owns inline `transform`** on its `motion.*` elements — a CSS `:hover { transform: … }` is overridden. Use `whileHover` (see hero avatar pill in `HeroText.tsx`). Animate non-transform props (shadow, color, child `<img>` scale) in CSS if needed.
- **Nav links (`Navigation.astro`)** each carry `transform: translateZ(0)` to sit on their own compositing layer. Without it, hovering one link re-rasterises the others through the pill's fractional `scaleY` scroll transform → sub-pixel jitter. Keep hover effects layout-stable (color, not opacity/size).
- **Project grids use `minmax(0, 1fr)` tracks** (`ProjectsShowcase.astro`) + `min-width: 0` on the card. Plain `1fr` pins to the image's intrinsic width and overflows on narrow screens. Only `body` carries `overflow-x: hidden`, not `html`.
- **`RadialDiagram.tsx` cursor reactivity** — two mechanisms, both gated on `useReducedMotion`: (1) **pill proximity magnetism** — dock-style scale falloff (smoothstep, radius `PROXIMITY_RADIUS_RATIO` × width, peak `PROXIMITY_MAX_BUMP`) folded onto the bob transform; (2) **ring-tilt envelope** — the squircle stack leans toward the cursor, smoothstep ramping from `TILT_START_RADIUS_RATIO` to `TILT_PEAK_RADIUS_RATIO` then holding inward. Both `hoveredPill` and `centerActive` are **proximity-driven from `handleMouseMove`** — there is no SVG hotspot circle. Don't re-add the hotspot circle or pointer-event-based `centerActive` toggling.
- **`ProjectCard.astro` overlay is pastel coral**, not the vivid `--color-primary` (which reads "barbie pink"). Light mode mixes primary into `--color-bg` (~18% / 92% alpha); dark mode rebuilds it by mixing primary into `--color-text` instead (because `--color-bg` is near-black) and flips statement text to `--color-bg`. Keep both overrides in sync if you retune.
- **`--max-width` is fluid** — `clamp(1100px, 50vw + 350px, 1300px)` in `Layout.astro` (drives the nav pill, `.container`, hero panel). It ramps 1100→1300px across ~1500–1900px viewport so the bar + content column grow smoothly. It used to hard-switch at a `1600px` media query, which made the whole layout visibly snap-resize — don't reintroduce a hard breakpoint.
- **`HeroText.tsx` pronunciation (`.hero-pron`)** is `position: absolute` at the name's top-right so it never reflows the heading. Keep its `font-size: 1rem` reset, or the card's `em`/offset math inherits the ~5rem heading size and flings it off-screen. The `?!` badge is the rest-state affordance; hovering **the name** (not just the chip) pops a two-line card (`.hero-pron-bubble`: "Pronounced" / phonetic) centred above the badge — Framer owns the transform (`x: '-50%'` to centre + scale-in from `transform-origin: bottom center`), so it expands outward rather than pushing right. Hover has a ~90ms close delay so crossing the name→chip gap doesn't flicker it; touch/keyboard latch it open (`pinned` state, outside-tap / Escape to dismiss; badge `aria-expanded` drives its active style). Real `<button>`; proximity-magnetism scale gated on `useReducedMotion`.
- **`ContactCTA.astro` scroll-driven expansion.** Section lives inside `.cta-wrapper`; wrapper height set by JS (`natural + expansion + short tail` — the tail is ~6vh, just enough to reach full expansion, not a long hold). Section is `position: sticky; top: [vh - natural]` and `z-index: 999` — **above** the `nav-fade-overlay` (z 998) so the light top-fade doesn't wash over this dark panel when it reaches the top, **below** the nav (z 1000/1001). It pins at the viewport bottom on entry and grows upward to full-screen. **DOM order:** `.cta__expanded` (top, fades in on scroll) holds the heading + "Get in touch" button; `.cta__main` holds the tagline + contact links; `.cta__footer` nests the `Footer` into the panel base — `position: fixed; bottom: 0` (viewport-pinned, **not** absolute, so it can't shimmer off the section's per-frame `top`/`height`; `pointer-events: none` so the always-present invisible bar never blocks page clicks), fading in on the same scroll progress, so the home page bottom is one continuous dark section (no separate `<Footer>` block on `index.astro`; other pages still render it standalone). The "thinking"/"doing" words have proximity-driven scale + an underline sweep on scroll-in. Reduced-motion users get the fully-expanded static version (footer falls back to static flow). **Don't set `overflow: hidden` on `.cta-wrapper`** — breaks sticky.
