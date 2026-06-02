# Design Doings — Xiaoxue Dong's Portfolio

Personal portfolio site for Xiaoxue Dong, service designer and strategist. Built with Astro + React, statically generated, and deployed to GitHub Pages at [designdoings.com](https://designdoings.com).

> **Working with an AI assistant?** Point it at [`CLAUDE.md`](./CLAUDE.md) — it's the orientation doc covering structure, conventions, and "where do I edit X?" lookups.

## Tech stack

- **Astro 4** with `@astrojs/react` integration (static output)
- **React 19** for interactive components (`client:load` / `client:visible` islands)
- **TypeScript** (strict)
- **Sharp** image pipeline producing responsive WebP/AVIF
- **AOS** for scroll-triggered animations
- **GSAP** + **Framer Motion** for richer interactions
- **Lucide React** for icons
- Self-hosted **Inter** via `@fontsource/inter`
- Light/dark themes via `data-theme` on `<html>` with a pre-paint inline script
- Google Analytics (gtag) with a small `trackEvent` helper

## Project structure

```
folio2026/
├── astro.config.mjs            # Astro config (custom domain, image pipeline, vendor chunks)
├── package.json
├── tsconfig.json
├── public/                     # Static assets copied verbatim
│   ├── CNAME                   # designdoings.com
│   ├── robots.txt, sitemap.xml
│   ├── favicon + touch icons
│   ├── resume-xiaoxue.pdf
│   ├── about-me.html, contact.html   # Legacy meta-refresh redirects
│   └── images/                 # Static project images & SVGs
├── scripts/
│   ├── optimize-images.sh
│   ├── test-seo.js
│   └── test-performance.js
└── src/
    ├── pages/
    │   ├── index.astro         # Home (hero, projects, craft, clients, CTA)
    │   ├── about.astro         # About + contact
    │   ├── healthcare.astro    # Healthcare case study
    │   └── 404.astro
    ├── layouts/
    │   └── Layout.astro        # HTML shell, meta/OG, design tokens, theme + AOS bootstrap
    ├── components/             # Astro + React components (see below)
    ├── config/aos.ts           # AOS init options
    ├── data/
    │   ├── projects.ts         # Project content + image imports
    │   └── expertise.ts        # Expertise areas for the Craft section
    ├── images/                 # Bundled assets processed by Astro
    ├── registry/magicui/
    │   └── highlighter.tsx     # rough-notation highlighter wrapper
    ├── utils/
    │   └── analytics.ts        # gtag event helper
    └── env.d.ts
```

### Components

`src/components/` mixes Astro components (page sections + icons) with React islands (interactive bits). Highlights:

- **Layout/chrome:** `Navigation.astro`, `Footer.astro` (dark inverse palette, matches the CTA section)
- **Home:** `Hero.astro` (`HeroText` + `RadialDiagram`), `ProjectsShowcase.astro` + `ProjectCard.astro` (2-up featured + 3-up grid), `Craft.astro` + `CraftAccordion.astro`, `About.astro` (scrolling client-logo marquee), `ContactCTA.astro` (scroll-driven full-screen expansion — compact dark strip that grows to fill the viewport as you scroll). `Testimonials.astro` + `TestimonialCarousel` also exist but are not currently mounted on the home page.
- **About page:** `Contact.astro`, `ProfilePhoto`, `ClosingStatement`
- **Healthcare case study:** `ProjectNavigation`, `ChallengeDiagram`, `ChallengeGraphic`, `JourneyAnimation` (with `JourneyIcons`, `JourneyLabels`, `JourneyLabelsAnimated`, `JourneyCornerIcons`), `ImageCarousel`, `ImpactMetrics` + `GlassIcon`, `TestimonialCarousel`, `PillarNumber.astro`, `CircleTitle.astro`
- **Icons:** `src/components/icons/*.astro`

## Local setup

Requirements: Node 18+ and npm.

```bash
npm install
npm run dev        # http://localhost:4321
```

### Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Astro dev server |
| `npm run build` | `astro check` (type check) then `astro build` |
| `npm run preview` | Serve the production build locally |
| `npm run test` | Build, then run the SEO smoke test |
| `npm run test:seo` | Run `scripts/test-seo.js` against the build |
| `npm run test:performance` | Run `scripts/test-performance.js` |

## Customising content

- **Projects:** edit `src/data/projects.ts`. Each project imports its own image from `src/images/projects/`. Add a new entry with `id`, `title`, `description`, `category`, `image`, `tags`, optional `link`, `overlaySubtitle` (tagline shown larger on hover), `overlayBody` (intro paragraph shown below tagline on hover), etc. **Order matters:** the first two entries render as large "featured" cards, the rest as a 3-up grid.
- **Expertise areas (Craft section):** edit `src/data/expertise.ts` (rendered as the click-to-open accordion).
- **Home testimonials:** `src/components/Testimonials.astro` (currently not rendered on `index.astro` — re-add `<Testimonials />` to show it); **closing CTA:** `src/components/ContactCTA.astro` (scroll-driven expansion; wrapper height + sticky position are calculated by JS on load).
- **Healthcare case study:** content lives inline in `src/pages/healthcare.astro` (reflections, metrics, testimonials, body copy).
- **About / contact copy and client logos:** `src/components/About.astro` (logos animate in a scrolling marquee) and `src/components/Contact.astro`. Logos live in `src/images/clients/` with light/dark variants.
- **Site metadata (title/description/OG defaults):** `src/layouts/Layout.astro`.
- **Design tokens (colors, spacing, typography, shadows, radii, blur):** the `:root` and `[data-theme="dark"]` blocks in `src/layouts/Layout.astro`.

## Deployment

The site deploys to GitHub Pages via the workflow in `.github/workflows/`. The custom domain is set in `public/CNAME` and `astro.config.mjs` (`site: 'https://designdoings.com'`, `base: '/'`).

For GitHub Pages without a custom domain, change `astro.config.mjs`:

```js
site: 'https://<user>.github.io',
base: '/<repo-name>',
```

### DNS (Namecheap, for reference)

Apex `designdoings.com` → four A records pointing at GitHub's Pages IPs (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`).
`www` → CNAME to `<user>.github.io.` (trailing dot).

In GitHub: **Settings → Pages → Custom domain** → `designdoings.com`, then enable **Enforce HTTPS** once DNS verifies.

## Performance notes

- Static output, inline critical CSS (`build.inlineStylesheets: 'always'`)
- React vendor + framer-motion split into separate chunks (`astro.config.mjs`)
- Images served as responsive WebP via Astro's image service (`src/images/`) — `public/images/` is reserved for assets that bypass the pipeline
- AOS is the only always-on JS on every page; React islands hydrate per-section (`client:load` / `client:visible`)

## Browser support

Last 2 versions of Chrome, Edge, Firefox, Safari, plus iOS Safari and Chrome Mobile.

## License

MIT.
