import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { proximityRamp } from '../utils/proximity';

/**
 * ProximityTilt
 *
 * Wraps any content and leans it toward the cursor on a proximity envelope —
 * the same ramp the hero RadialDiagram uses for its ring stack. A
 * document-level pointer listener measures the distance from the cursor to the
 * element's centre and drives a smoothstep `intensity` (0 → 1); tilt and scale
 * scale by it, so the surface eases toward the pointer from a little way out
 * and reaches full strength once the cursor is over it, instead of snapping on
 * at hover.
 *
 * The transform is applied to this element; the **parent** is measured as the
 * stable (untransformed) reference for the centre + size, so wrap this in a
 * container sized to the content (a transformed element's own bounding box
 * shifts under rotation and would feed back into the distance maths).
 *
 * `onIntensity` fires each frame with the eased 0..1 value so consumers can
 * hook additional effects (e.g. a glow's opacity) onto the same ramp.
 *
 * Honours `prefers-reduced-motion`: when set, no listener is attached and the
 * element rests at its CSS transform.
 */
interface ProximityTiltProps {
  children: React.ReactNode;
  /** Class for the transformed element. */
  className?: string;
  /** Max degrees of lean on each axis when the cursor sits on the element. */
  tiltRange?: number;
  /** Scale reached at full proximity. */
  scaleMax?: number;
  /** Radius (× parent width) at which the lean reaches full strength. */
  peakRadiusRatio?: number;
  /** Radius (× parent width) at which the lean begins to fade in. */
  startRadiusRatio?: number;
  /** CSS perspective for the 3D rotation. */
  perspective?: number;
  /** Called each frame with the eased 0..1 proximity intensity. */
  onIntensity?: (intensity: number) => void;
}

export function ProximityTilt({
  children,
  className,
  tiltRange = 10,
  scaleMax = 1.03,
  peakRadiusRatio = 0.55,
  startRadiusRatio = 1.35,
  perspective = 1000,
  onIntensity,
}: ProximityTiltProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();
  const prevIntensityRef = useRef(0);

  // Hold the latest callback so an inline `onIntensity` doesn't re-subscribe
  // the listener on every render.
  const onIntensityRef = useRef(onIntensity);
  onIntensityRef.current = onIntensity;

  useEffect(() => {
    if (reduceMotion) return;

    const handlePointerMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;

      // Measure the stable parent, not the (transformed) element itself.
      const measureEl = el.parentElement ?? el;
      const rect = measureEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.hypot(dx, dy);

      const intensity = proximityRamp(
        dist,
        rect.width,
        startRadiusRatio,
        peakRadiusRatio,
      );

      // Skip work while the cursor roams far away (intensity pinned at 0).
      if (intensity === 0 && prevIntensityRef.current === 0) return;
      prevIntensityRef.current = intensity;

      // Cursor offset from centre, normalised to the half-extent and clamped so
      // a far-away pointer still maxes out at tiltRange.
      const nx = Math.max(-1, Math.min(1, dx / (rect.width / 2)));
      const ny = Math.max(-1, Math.min(1, dy / (rect.height / 2)));
      const rotY = nx * tiltRange * intensity;
      const rotX = -ny * tiltRange * intensity;
      const scale = 1 + intensity * (scaleMax - 1);

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.style.transition = 'transform 0.12s ease-out';
          ref.current.style.transform =
            `perspective(${perspective}px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${scale})`;
        }
        onIntensityRef.current?.(intensity);
      });
    };

    document.addEventListener('pointermove', handlePointerMove);
    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [reduceMotion, tiltRange, scaleMax, peakRadiusRatio, startRadiusRatio, perspective]);

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
}
