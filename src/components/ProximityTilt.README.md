# ProximityTilt

A reusable React island that leans its content toward the cursor on a smooth
**proximity ramp** (the same easing the hero `RadialDiagram` uses). Instead of
snapping to full tilt on hover, the surface eases toward the pointer from a
little way out and reaches full strength once the cursor is over it.

Use it for any single "hero-ish" surface that should feel alive under the
cursor: an avatar/photo, a featured card, a resume thumbnail, a logo lockup.
Currently used by `ProfilePhoto.tsx`.

## Quick start

```tsx
import { ProximityTilt } from './ProximityTilt';

// The OUTER element must be a container sized to the content (see constraint).
<div className="my-frame-container">
  <ProximityTilt className="my-frame">
    {/* anything */}
    <img src={src} alt="…" />
  </ProximityTilt>
</div>
```

```css
.my-frame-container { position: relative; width: 280px; } /* sized to content */
.my-frame { width: 100%; height: 100%; will-change: transform; }
```

Mount it like any island — from an `.astro` file use `client:load` (above the
fold) or `client:visible` (below). It works inside another already-hydrated
island too (that's how `ProfilePhoto` uses it).

## The one constraint that matters

`ProximityTilt` applies the 3D transform to **itself** and measures its
**parent** as the stable reference for the centre + size. So:

- Wrap it in a container that is **sized to the content** (the parent's width
  drives the ramp radii). A full-width/page-sized parent makes the ramp never
  trigger sensibly.
- The parent must **not** be transformed itself (a transformed box's bounding
  rect shifts under rotation and feeds back into the distance maths → jitter).

`ProfilePhoto` is the canonical layout: `.profile-photo-container` (stable,
sized) → `<ProximityTilt className="photo-wrapper">` (tilts) → content.

## Props

| Prop | Default | Meaning |
| --- | --- | --- |
| `children` | — | Content to tilt. |
| `className` | — | Class on the transformed element. |
| `tiltRange` | `10` | Max degrees of lean per axis at full proximity. |
| `scaleMax` | `1.03` | Scale reached at full proximity. |
| `peakRadiusRatio` | `0.55` | Distance (× parent width) at which the lean hits full strength. |
| `startRadiusRatio` | `1.35` | Distance (× parent width) at which the lean starts fading in. Must be > `peakRadiusRatio`. |
| `perspective` | `1000` | CSS `perspective()` for the rotation. |
| `onIntensity` | — | `(intensity: number) => void`, called each frame with the eased `0..1` ramp. |

**Tuning intuition:** raise `startRadiusRatio` for an earlier/longer lead-in;
lower `peakRadiusRatio` to delay full strength until the cursor is nearer.

## Riding the ramp for extra effects

`onIntensity` exposes the raw `0..1` value so other things can move on the same
ramp. `ProfilePhoto` fades a glow with it:

```tsx
const glowRef = useRef<HTMLDivElement>(null);

<ProximityTilt
  className="photo-wrapper"
  onIntensity={(i) => {
    if (glowRef.current) glowRef.current.style.opacity = `${0.5 + i * 0.5}`;
  }}
>
  …
  <div className="photo-glow" ref={glowRef} />
</ProximityTilt>
```

An inline `onIntensity` is fine — it's held in a ref, so it won't re-subscribe
the listener.

## Notes

- **Reduced motion:** honours `prefers-reduced-motion` — no listener is
  attached and the element rests at its CSS transform.
- **Listener:** attaches one `document` `pointermove` listener per instance
  (cheap; skips all work while the cursor is far away). Fine for a handful of
  surfaces; if you ever put it on dozens of cards in a grid, consider a shared
  listener instead.
- **Shared maths:** the easing lives in `src/utils/proximity.ts`
  (`smoothstep`, `proximityRamp`) and is shared with the hero `RadialDiagram` —
  don't fork the formula.
