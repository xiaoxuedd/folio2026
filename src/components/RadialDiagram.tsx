import { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  motionValue,
  useReducedMotion,
  useTransform,
  animate,
  type MotionValue,
} from 'framer-motion';
import { proximityRamp, smoothstep } from '../utils/proximity';
import './RadialDiagram.css';

/**
 * RadialDiagram
 *
 * Hero left-column visual: a layered stack of rotated squircles surrounded
 * by ten scattered service-design / strategy "tag" pills, with a handful of
 * dashed L-shaped leader lines connecting them. Two of the pills are coloured
 * accents (coral = "DOING", indigo = "THINKING") to echo the homepage's
 * design-thinking-into-design-doing motif.
 *
 * Pills bob on the Y-axis. Each leader line endpoint that connects to a
 * pill follows that pill's bob, and lands on the chosen edge (top / bottom /
 * left / right) rather than the pill's centre — so the line visually meets
 * the pill at its perimeter, not through the middle.
 */

type PillKind = 'neutral' | 'coral' | 'indigo';
type PillSide = 'top' | 'bottom' | 'left' | 'right';

interface PillSpec {
  x: number;
  y: number;
  kind: PillKind;
  /** Bobbing phase offset in seconds, randomised per mount. */
  phase: number;
}

interface PillBounds {
  halfWidth: number;
  halfHeight: number;
}

interface RadialDiagramProps {
  className?: string;
  /**
   * Override pill labels. Order matches PILL_LAYOUT below — index 2 is the
   * indigo accent, index 5 is the coral accent.
   */
  labels?: string[];
}

const VB = 600;
const CENTER = VB / 2;

// Pill anchor points. Positions are intentionally scattered.
const PILL_LAYOUT: Omit<PillSpec, 'phase'>[] = [
  { x: 110, y: 130, kind: 'neutral' },   // 0 top-left
  { x: 300, y: 70,  kind: 'neutral' },   // 1 top-centre
  { x: 470, y: 110, kind: 'indigo' },    // 2 top-right (accent)
  { x: 530, y: 250, kind: 'neutral' },   // 3 right-upper
  { x: 495, y: 410, kind: 'neutral' },   // 4 right-lower
  { x: 360, y: 510, kind: 'coral' },     // 5 bottom-right (accent)
  { x: 200, y: 540, kind: 'neutral' },   // 6 bottom-centre
  { x: 75,  y: 440, kind: 'neutral' },   // 7 bottom-left
  { x: 55,  y: 290, kind: 'neutral' },   // 8 left
  { x: 165, y: 250, kind: 'neutral' },   // 9 inner-left, near rings
  { x: 430, y: 340, kind: 'neutral' },   // 10 inner-right
];

const DEFAULT_LABELS = [
  'RESEARCH',
  'STRATEGY',
  'THINKING',  // index 2 — indigo
  'SYSTEMS',
  'CRAFT',
  'DOING',     // index 5 — coral
  'INSIGHT',
  'NARRATIVE',
  'CULTURE',
  'HUMAN',
  'TECHNOLOGY',
];

const RINGS = [
  { size: 460, rotate: 0,  rx: 90 },
  { size: 350, rotate: 6,  rx: 76 },
  { size: 240, rotate: 10, rx: 46 },
  { size: 140, rotate: -7, rx: 30 },
];

// Each ring sits on its own 3D layer; inner (smaller) rings float further
// toward the viewer. Layers are HTML boxes inside a perspective stage —
// SVG <g> elements ignore 3D transforms in Safari/WebKit, so the depth +
// tilt must live on real DOM boxes, not inside a single SVG. Per-layer depth
// is driven by a `--depth` CSS var (the layer index); CSS turns that into
// translateZ and lifts/scales it further when the stack is active.
const TILT_RANGE = 26; // max degrees of rotate at the diagram's edge

// Ring-tilt proximity envelope. The lean reaches full strength at the inner
// "peak" radius (the original r=260 hotspot edge, ≈0.43 of the container) and
// fades to zero by the outer "start" radius — so it eases in from slightly
// further out and ramps with proximity instead of snapping on at the boundary.
// Inside the peak radius the behaviour is identical to before; the only new
// behaviour lives in the start→peak lead-in ring. Radii are fractions of width.
const TILT_PEAK_RADIUS_RATIO = 0.43;
const TILT_START_RADIUS_RATIO = 0.56;

// Bob amplitude in viewBox units. See note on coordinate-system caveat in
// the original integration: pills translate in CSS px, lines in viewBox units,
// container ≈ 480–600px ≈ viewBox extent → close enough for visual tracking.
const BOB_AMPLITUDE = 3;

// Proximity magnetism (dock-style): pills near the cursor scale up on a smooth
// distance falloff rather than a binary hover, so the whole constellation reacts
// as the pointer sweeps across it. Radius is a fraction of the container width
// so it tracks the diagram's rendered size; max bump is the extra scale a pill
// reaches when the cursor sits right on top of it.
const PROXIMITY_RADIUS_RATIO = 0.34;
const PROXIMITY_MAX_BUMP = 0.22;

// Bend step: each declares only ONE axis to move along. The other coordinate
// is inherited from the previous cursor position, which keeps every segment
// strictly orthogonal even when an endpoint bobs.
type BendStep = { x: number } | { y: number };

interface LeaderLineSpec {
  /** Pill index whose edge the line starts on, if any. */
  startPill?: number;
  /** Which edge of the start pill the line touches. */
  startSide?: PillSide;
  /** Fixed start point — used when the line doesn't begin at a pill (e.g. centre). */
  startFixed?: [number, number];

  /** Pill index whose edge the line ends on, if any. */
  endPill?: number;
  endSide?: PillSide;
  endFixed?: [number, number];

  /** Orthogonal routing between start and end. Each step changes one axis. */
  bends: BendStep[];
}

const LEADER_LINES: LeaderLineSpec[] = [
  // Four narrative pairs — no centre connections. RESEARCH and CRAFT sit
  // unconnected (the brief allows lines to connect "a subset of pills").

  // 1: STRATEGY ↔ SYSTEMS — strategy shapes systems.
  {
    startPill: 1, startSide: 'right',
    bends: [{ x: 530 }],
    endPill: 3, endSide: 'top',
  },

  // 2: THINKING (indigo) ↔ DOING (coral) — the site's headline motif.
  {
    startPill: 2, startSide: 'bottom',
    bends: [{ y: 320 }, { x: 360 }],
    endPill: 5, endSide: 'top',
  },

  // 3: NARRATIVE ↔ CULTURE — stories shape culture. Hooks around the left
  //    side; track at x=8 keeps it clear of CULTURE's left edge.
  {
    startPill: 7, startSide: 'left',
    bends: [{ x: 8 }, { y: 290 }],
    endPill: 8, endSide: 'left',
  },

  // 4: INSIGHT ↔ CARE — insight grounded in care.
  {
    startPill: 6, startSide: 'top',
    bends: [{ y: 320 }, { x: 165 }],
    endPill: 9, endSide: 'bottom',
  },
];

const ZERO_BOB: MotionValue<number> = motionValue(0);

/**
 * Convert a pill anchor + side into the (x, y) point on that pill's edge,
 * given the pill's measured half-dimensions. Bobbing is applied separately
 * by the caller so this stays a pure geometry helper.
 */
function pillEdgePoint(
  side: PillSide,
  anchor: { x: number; y: number },
  bounds: PillBounds,
): [number, number] {
  switch (side) {
    case 'top':    return [anchor.x, anchor.y - bounds.halfHeight];
    case 'bottom': return [anchor.x, anchor.y + bounds.halfHeight];
    case 'left':   return [anchor.x - bounds.halfWidth, anchor.y];
    case 'right':  return [anchor.x + bounds.halfWidth, anchor.y];
  }
}

/** Resolve the start endpoint (with bob applied) from spec + bounds + bob. */
function resolveEndpoint(
  pillIdx: number | undefined,
  side: PillSide | undefined,
  fixed: [number, number] | undefined,
  bounds: PillBounds[],
  bob: number,
): [number, number] {
  if (pillIdx !== undefined && side !== undefined) {
    const anchor = PILL_LAYOUT[pillIdx];
    const [x, y] = pillEdgePoint(side, anchor, bounds[pillIdx]);
    return [x, y + bob];
  }
  return fixed ?? [0, 0];
}

/**
 * Walk the bend list and assemble a path d-string. Inserts an auto-snap
 * elbow before the endpoint when the routing doesn't perfectly land on the
 * endpoint axis — needed because pill bobs shift the endpoint Y by ±3 units
 * but the bends are static.
 */
function buildPathD(
  spec: LeaderLineSpec,
  bounds: PillBounds[],
  startBob: number,
  endBob: number,
): string {
  const start = resolveEndpoint(
    spec.startPill,
    spec.startSide,
    spec.startFixed,
    bounds,
    spec.startPill !== undefined ? startBob : 0,
  );
  const end = resolveEndpoint(
    spec.endPill,
    spec.endSide,
    spec.endFixed,
    bounds,
    spec.endPill !== undefined ? endBob : 0,
  );

  const points: [number, number][] = [start];
  let cursor: [number, number] = start;

  for (const step of spec.bends) {
    cursor = 'x' in step ? [step.x, cursor[1]] : [cursor[0], step.y];
    points.push(cursor);
  }

  // Final segment must be orthogonal. If cursor and end already share an
  // axis, drop straight to end. Otherwise insert a snap bend, choosing the
  // snap based on which side of the pill the line approaches.
  if (cursor[0] !== end[0] && cursor[1] !== end[1]) {
    const finalAxisIsX =
      spec.endSide === 'left' ||
      spec.endSide === 'right' ||
      // No endSide (fixed end): alternate from the last bend's axis.
      (spec.endSide === undefined &&
        spec.bends.length > 0 &&
        'y' in spec.bends[spec.bends.length - 1]);

    cursor = finalAxisIsX
      ? [cursor[0], end[1]]   // snap Y first, final move changes X
      : [end[0], cursor[1]];  // snap X first, final move changes Y
    points.push(cursor);
  }
  points.push(end);

  return points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`)
    .join(' ');
}

function LeaderPath({
  spec,
  bounds,
  startBob,
  endBob,
  registerRef,
  index,
  isHighlighted,
}: {
  spec: LeaderLineSpec;
  bounds: PillBounds[];
  startBob: MotionValue<number>;
  endBob: MotionValue<number>;
  registerRef: (i: number, el: SVGPathElement | null) => void;
  index: number;
  isHighlighted: boolean;
}) {
  const d = useTransform<number, string>(
    [startBob, endBob],
    ([s, e]: number[]) => buildPathD(spec, bounds, s, e),
  );

  const className = [
    'radial-diagram__leader',
    isHighlighted && 'is-highlighted',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.path
      ref={(el: SVGPathElement | null) => registerRef(index, el)}
      d={d}
      className={className}
    />
  );
}

export default function RadialDiagram({
  className,
  labels,
}: RadialDiagramProps) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [hoveredPill, setHoveredPill] = useState<number | null>(null);
  const [centerActive, setCenterActive] = useState(false);
  const lineRefs = useRef<Array<SVGPathElement | null>>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ringsRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number>();
  // Tracks current hovered pill index so handleMouseMove can skip setState
  // when the closest pill hasn't changed (avoids a re-render every mousemove).
  const hoveredPillRef = useRef<number | null>(null);
  const centerActiveRef = useRef(false);

  const pills: PillSpec[] = useMemo(
    () =>
      PILL_LAYOUT.map((p) => ({
        ...p,
        phase: Math.random() * 4,
      })),
    [],
  );

  const [pillBobs] = useState<MotionValue<number>[]>(() =>
    PILL_LAYOUT.map(() => motionValue(0)),
  );

  // Per-pill proximity scale, driven by the global pointer-move handler.
  // Starts at 1 (rest); folded onto the bob element's transform.
  const [pillScales] = useState<MotionValue<number>[]>(() =>
    PILL_LAYOUT.map(() => motionValue(1)),
  );

  const resolvedLabels =
    labels && labels.length === PILL_LAYOUT.length ? labels : DEFAULT_LABELS;

  // Approximate pill half-dimensions in viewBox units, derived from label
  // length. Empirical fit at the default font / padding (uppercase, semibold,
  // 11 px font, 12 px x-padding): ~4 vb per char + ~14 vb edge padding for
  // half-width. Half-height tracks the constant font/padding.
  const pillBounds: PillBounds[] = useMemo(
    () =>
      resolvedLabels.map((label) => ({
        halfWidth: label.length * 4 + 14,
        halfHeight: 13,
      })),
    [resolvedLabels],
  );

  useEffect(() => {
    if (reduceMotion) {
      pillBobs.forEach((b) => b.set(0));
      return;
    }
    const controls = pills.map((pill, i) =>
      animate(
        pillBobs[i],
        [-BOB_AMPLITUDE, BOB_AMPLITUDE, -BOB_AMPLITUDE],
        {
          duration: 5 + (i % 4) * 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: pill.phase,
        },
      ),
    );
    return () => controls.forEach((c) => c.stop());
  }, [reduceMotion, pills, pillBobs]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const registerLineRef = (i: number, el: SVGPathElement | null) => {
    lineRefs.current[i] = el;
  };

  // Configure dashed-line draw-on. Path length is measured at the rest
  // position; the bob changes path length by < 1.5%, well within tolerance.
  useEffect(() => {
    lineRefs.current.forEach((path, i) => {
      if (!path) return;
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = reduceMotion ? '0' : `${len}`;
      const delay = 600 + i * 90;
      const duration = 700;
      path.style.transition = `stroke-dashoffset ${duration}ms ease-out ${delay}ms`;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      path.getBoundingClientRect();
      path.style.strokeDashoffset = '0';
    });
  }, [reduceMotion]);

  // Tilt the ring stack toward the cursor while the centre is active, and
  // apply dock-style proximity scaling to every pill on each move.
  // The transform lives on a preserve-3d HTML box (ringsRef), so each
  // layer's translateZ parallaxes correctly under the rotation.
  // Signs match the about-page photo frame: rotateX(-y), rotateY(x).
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container || reduceMotion) return;

    const rect = container.getBoundingClientRect();

    // Proximity magnetism — runs whenever the cursor is over the diagram,
    // independent of the centre hotspot. Pill centres come from the static
    // layout (bob offset is sub-pixel here, so it's ignored for distance).
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const radius = rect.width * PROXIMITY_RADIUS_RATIO;
    let closestIdx: number | null = null;
    let closestDist = radius; // only highlight pills within the proximity radius
    for (let i = 0; i < PILL_LAYOUT.length; i++) {
      const px = (PILL_LAYOUT[i].x / VB) * rect.width;
      const py = (PILL_LAYOUT[i].y / VB) * rect.height;
      const dist = Math.hypot(cx - px, cy - py);
      const t = Math.max(0, 1 - dist / radius);
      const eased = smoothstep(t); // softer than linear
      pillScales[i].set(1 + eased * PROXIMITY_MAX_BUMP);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    }
    // Highlight the nearest pill within the proximity radius; clear when none.
    if (closestIdx !== hoveredPillRef.current) {
      hoveredPillRef.current = closestIdx;
      setHoveredPill(closestIdx);
    }

    // Ring tilt — leans toward the cursor on a distance envelope: zero at the
    // outer "start" radius, ramping (smoothstep) to full strength at the inner
    // "peak" radius and holding there inward. Inside the peak radius this is
    // identical to the old behaviour; the new bit is the gentle lead-in across
    // the start→peak ring. Twist + lift activate within the peak radius.
    if (!ringsRef.current) return;

    const dist = Math.hypot(cx - rect.width / 2, cy - rect.height / 2);

    // Drive centerActive from proximity rather than the SVG hotspot circle.
    const nowActive = dist < rect.width * TILT_PEAK_RADIUS_RATIO;
    if (nowActive !== centerActiveRef.current) {
      centerActiveRef.current = nowActive;
      setCenterActive(nowActive);
    }

    const intensity = proximityRamp(
      dist,
      rect.width,
      TILT_START_RADIUS_RATIO,
      TILT_PEAK_RADIUS_RATIO,
    );

    const nx = cx / rect.width - 0.5; // -0.5 .. 0.5
    const ny = cy / rect.height - 0.5;
    const rotY = nx * TILT_RANGE * intensity;
    const rotX = -ny * TILT_RANGE * intensity;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      if (ringsRef.current) {
        ringsRef.current.style.transition = 'transform 0.12s ease-out';
        ringsRef.current.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      }
    });
  };

  // Ease pills back to rest scale and flatten the ring tilt when the cursor
  // leaves the diagram entirely. (In-bounds flattening is handled per-move by
  // the tilt envelope reaching zero at the start radius.)
  // Guard: pills have pointer-events:auto inside a pointer-events:none parent,
  // which can cause a spurious mouseleave on the container when entering a pill.
  // Skip the reset if relatedTarget is still a descendant of the container.
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (
      container &&
      e.relatedTarget instanceof Element &&
      container.contains(e.relatedTarget)
    ) {
      return;
    }
    pillScales.forEach((s) => animate(s, 1, { duration: 0.3, ease: 'easeOut' }));
    hoveredPillRef.current = null;
    setHoveredPill(null);
    centerActiveRef.current = false;
    setCenterActive(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (ringsRef.current) {
      ringsRef.current.style.transition = 'transform 0.4s ease-out';
      ringsRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`radial-diagram ${className ?? ''}`}
      data-mounted={mounted ? 'true' : 'false'}
      aria-hidden="true"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D ring stack. Each squircle gets its own HTML layer inside a
          perspective stage so Safari honours the tilt + per-layer depth —
          SVG <g> elements flatten 3D transforms, so the depth/tilt cannot
          live inside a single SVG. The leaders/centre stay in a flat SVG
          below, untouched by the tilt. */}
      <div className="radial-diagram__stage">
        <div
          className={`radial-diagram__rings3d${
            centerActive && !reduceMotion ? ' is-active' : ''
          }`}
          ref={ringsRef}
        >
          {RINGS.map((ring, i) => {
            const half = ring.size / 2;
            const base = ring.rotate;
            const xDrift = i % 2 === 0 ? 5 : -4;
            const yDrift = i % 3 === 0 ? -6 : 4;
            const rotDrift = i % 2 === 0 ? 1.8 : -1.4;
            const baseDuration = 9 + i * 0.7;

            // Cute twist when the centre is hovered. Outer rings twist more,
            // inner rings less; alternating direction for a layered feel.
            const spinTwist = i % 2 === 0 ? 14 - i * 1.5 : -12 + i * 1.2;

            const initial = reduceMotion
              ? { scale: 1, opacity: 1, rotate: base, x: 0, y: 0 }
              : { scale: 0, opacity: 0, rotate: base, x: 0, y: 0 };

            const animateProp = reduceMotion
              ? { scale: 1, opacity: 1, rotate: base, x: 0, y: 0 }
              : {
                  opacity: 1,
                  scale: [1, 1.015, 0.99, 1],
                  rotate: [base, base + rotDrift, base - rotDrift * 0.6, base],
                  x: [0, xDrift, -xDrift * 0.5, 0],
                  y: [0, yDrift, -yDrift * 0.4, 0],
                };

            return (
              <div
                key={i}
                className="radial-diagram__ring-layer"
                style={{ '--depth': i } as React.CSSProperties}
              >
                <svg
                  className="radial-diagram__ring-svg"
                  viewBox={`0 0 ${VB} ${VB}`}
                  preserveAspectRatio="xMidYMid meet"
                >
                  <motion.g
                    style={{ transformOrigin: '50% 50%' }}
                    animate={{
                      rotate: centerActive && !reduceMotion ? spinTwist : 0,
                    }}
                    transition={{
                      duration: 0.7 + i * 0.07,
                      ease: [0.34, 1.4, 0.64, 1],
                    }}
                  >
                    <motion.g
                      className="radial-diagram__ring-wrap"
                      style={{ transformOrigin: '50% 50%' }}
                      initial={initial}
                      animate={animateProp}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : {
                              opacity: { duration: 0.6, delay: i * 0.1 },
                              scale: {
                                duration: baseDuration,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: i * 0.3,
                              },
                              rotate: {
                                duration: baseDuration * 1.1,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: i * 0.45,
                              },
                              x: {
                                duration: baseDuration * 0.9,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: i * 0.2,
                              },
                              y: {
                                duration: baseDuration * 1.2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: i * 0.35,
                              },
                            }
                      }
                    >
                      <rect
                        x={CENTER - half}
                        y={CENTER - half}
                        width={ring.size}
                        height={ring.size}
                        rx={ring.rx}
                        ry={ring.rx}
                        className="radial-diagram__ring"
                      />
                    </motion.g>
                  </motion.g>
                </svg>
              </div>
            );
          })}
        </div>
      </div>

      <svg
        className="radial-diagram__svg"
        viewBox={`0 0 ${VB} ${VB}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <circle
          cx={CENTER}
          cy={CENTER}
          r={6}
          className="radial-diagram__center-dot"
        />

        <g className="radial-diagram__leaders">
          {LEADER_LINES.map((spec, i) => {
            const touchesHovered =
              hoveredPill !== null &&
              (spec.startPill === hoveredPill || spec.endPill === hoveredPill);
            return (
              <LeaderPath
                key={i}
                index={i}
                spec={spec}
                bounds={pillBounds}
                startBob={
                  spec.startPill !== undefined ? pillBobs[spec.startPill] : ZERO_BOB
                }
                endBob={
                  spec.endPill !== undefined ? pillBobs[spec.endPill] : ZERO_BOB
                }
                registerRef={registerLineRef}
                isHighlighted={touchesHovered}
              />
            );
          })}
        </g>
      </svg>

      <div className="radial-diagram__pills">
        {pills.map((pill, i) => {
          const leftPct = (pill.x / VB) * 100;
          const topPct = (pill.y / VB) * 100;
          const isHovered = hoveredPill === i;

          const pillClassName = [
            'radial-diagram__pill',
            `radial-diagram__pill--${pill.kind}`,
            isHovered && 'is-hovered',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <div
              key={i}
              className="radial-diagram__pill-anchor"
              style={{ left: `${leftPct}%`, top: `${topPct}%` }}
            >
              <motion.div
                className="radial-diagram__pill-bob"
                style={{ y: pillBobs[i], scale: pillScales[i] }}
              >
                <motion.div
                  className={pillClassName}
                  initial={
                    reduceMotion
                      ? { opacity: 1, scale: 1, y: 0 }
                      : { opacity: 0, scale: 0.6, y: 6 }
                  }
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    opacity: { duration: 0.35, delay: 0.2 + i * 0.05 },
                    scale: { duration: 0.35, delay: 0.2 + i * 0.05 },
                    y: { duration: 0.35, delay: 0.2 + i * 0.05 },
                  }}
                >
                  {resolvedLabels[i]}
                </motion.div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
