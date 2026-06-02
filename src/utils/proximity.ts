/**
 * Cursor-proximity easing shared by the hero RadialDiagram and ProximityTilt.
 * Keeping the formula in one place means the "ramp in toward the cursor" feel
 * stays consistent across every surface that uses it.
 */

/** Smoothstep for t in [0, 1]: 0→0, 1→1, with zero slope at both ends. */
export function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/**
 * Eased 0..1 proximity intensity from the distance between the cursor and a
 * point: zero at/outside `startRatio × width`, rising (smoothstep) to full at/
 * inside `peakRatio × width`. Radii are expressed as fractions of `width` so
 * the effect tracks the element's rendered size.
 */
export function proximityRamp(
  dist: number,
  width: number,
  startRatio: number,
  peakRatio: number,
): number {
  const startRadius = width * startRatio;
  const peakRadius = width * peakRatio;
  const ramp = Math.min(
    1,
    Math.max(0, (startRadius - dist) / (startRadius - peakRadius)),
  );
  return smoothstep(ramp);
}
