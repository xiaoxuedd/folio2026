import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './ReturnReasonVenn.css';

/**
 * ReturnReasonVenn
 *
 * The "ideal return reason taxonomy" framework, rebuilt from scratch as an
 * animated diagram (the e-commerce case study previously shipped it as a flat
 * exported SVG). Three overlapping lobes — Customer truth, Customer ease,
 * Business signal — scale into view in sequence; a curved leader draws on from
 * the title tag down into the three-way overlap, where a mint "sweet spot" leaf
 * and a dot mark the convergence.
 *
 * Hover is deliberately subtle: a lobe deepens its fill and lifts its heading to
 * the accent, while the central leaf brightens to signal that all three criteria
 * are met at once. Everything degrades to a static, fully-revealed diagram under
 * `prefers-reduced-motion`.
 *
 * Geometry is authored in the original 595×842 space so the coordinates match
 * the source artwork 1:1; the figure scales fluidly via its CSS aspect-ratio.
 * The render window (VIEW_Y/VIEW_H) crops the artwork's tall empty top/bottom
 * margins to the real content bounds so the figure isn't needlessly tall.
 */

// viewBox + lobe geometry, lifted from the source SVG.
const VB_W = 595;
const R = 156;

// Render window. The source art is 595×842, but the only content runs from the
// title tag (top ≈177) to the lowest lobe (bottom ≈754); the rest is empty. We
// keep authoring coordinates in the 842 space and just crop the visible window
// (with a little breathing room) so the diagram stops rendering nearly square +
// far shorter, killing the dead space the portrait viewBox used to add.
const VIEW_Y = 168;
const VIEW_H = 595;

interface Lobe {
  key: string;
  cx: number;
  cy: number;
  /** Heading + supporting question. */
  title: string;
  lines: string[];
  /** Anchor (text-anchor: middle) for the heading/question block. */
  labelX: number;
  titleY: number;
}

const LOBES: Lobe[] = [
  {
    key: 'truth',
    cx: 183,
    cy: 408,
    title: 'Customer truth',
    lines: ['Does this reflect how the', 'customer actually feels?'],
    labelX: 140,
    titleY: 373,
  },
  {
    key: 'ease',
    cx: 411,
    cy: 408,
    title: 'Customer ease',
    lines: ['Can customers find the', 'right option in under 5', 'seconds?'],
    labelX: 455,
    titleY: 373,
  },
  {
    key: 'signal',
    cx: 297,
    cy: 598,
    title: 'Business signal',
    lines: ['Does this create actionable', 'data for ops, product, or', 'buying?'],
    labelX: 298,
    titleY: 618,
  },
];

// Pairwise-overlap captions, sat in each two-lobe lens.
const OVERLAPS: { x: number; lines: [string, string] }[] = [
  { x: 297, lines: ['Honest', '& selectable'] }, // truth ∩ ease (top)
  { x: 205, lines: ['Specific', '& meaningful'] }, // truth ∩ signal (lower-left)
  { x: 380, lines: ['Easy', '& structured'] }, // ease ∩ signal (lower-right)
];

// Three-way overlap "sweet spot" leaf, centred on the dot.
const SWEET_SPOT_D =
  'M297.219 442 c12.826 0 25.292 1.548 37.219 4.468 ' +
  'c-6.557 25.853 -19.568 49.132 -37.219 68.02 ' +
  'c-17.652 -18.888 -30.662 -42.167 -37.219 -68.02 ' +
  'c11.927 -2.92 24.392 -4.468 37.219 -4.468 z';

const DOT = { x: 297, y: 470 };

// Leader from the title tag toward the three-way centre — a single gentle bow
// that stays entirely RIGHT of the centred "Honest & selectable" caption, then
// points down-left at the dot from above (the "red arrow" routing). Because the
// text and the dot are stacked on the same x, a line ending straight-down at the
// dot would cut through the caption; instead the whole curve hugs the right
// (control1/control2 ≈ x388/394) and only the arrowhead reaches in. Verified the
// curve sits at x≈355–372 across the caption rows (y382–412; text edge ≈335).
// The path ENDS at the head's base-centre (348,420); the tip lands at (338,430),
// just OUTSIDE the mint leaf's top-right corner, so the mint arrow stays visible.
//
// The head is drawn explicitly (NOT an SVG marker — marker orient="auto"
// rendered at the wrong angle under Framer's pathLength animation). Tip and the
// two base corners are derived from the curve's exact end tangent
// (B − C2 = (348,420) − (394,375) = (−46,45)), so the triangle is guaranteed
// colinear with the line. To retune: adjust the curve, then recompute HEAD_D
// from the new end tangent (unit u along it, p perpendicular,
// tip = B + len·u, corners = B ± w·p; len 14, w 5.5).
const ARROW_D = 'M 360 205 C 388 275 394 375 348 420';
const HEAD_D = 'M 338 429.8 L 344.2 416.1 L 351.8 423.9 Z';

const SPRING = { type: 'spring' as const, stiffness: 130, damping: 15 };

export default function ReturnReasonVenn({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);

  // Shared viewport config: animate once when the diagram scrolls into view.
  const viewport = { once: true, amount: 0.4 } as const;

  // Under reduced motion we skip the offset start so everything renders settled.
  const rest = reduceMotion;

  return (
    <figure
      className={`return-venn ${className ?? ''}`}
      role="img"
      aria-label="The ideal return reason taxonomy sits where three criteria overlap: customer truth (does this reflect how the customer actually feels), customer ease (can customers find the right option in under five seconds), and business signal (does this create actionable data for ops, product, or buying)."
    >
      <svg viewBox={`0 ${VIEW_Y} ${VB_W} ${VIEW_H}`} className="return-venn__svg">
        {/* Lobes — semi-transparent so the overlaps deepen by stacking. */}
        <g className="return-venn__lobes">
          {LOBES.map((lobe, i) => (
            <motion.circle
              key={lobe.key}
              cx={lobe.cx}
              cy={lobe.cy}
              r={R}
              className={`return-venn__circle return-venn__circle--${lobe.key}`}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              initial={rest ? false : { opacity: 0, scale: 0.4 }}
              whileInView={
                rest ? undefined : { opacity: 1, scale: 1, transition: { ...SPRING, delay: 0.1 + i * 0.16 } }
              }
              viewport={viewport}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              whileHover={
                rest
                  ? undefined
                  : { scale: 1.05, transition: { type: 'spring', stiffness: 300, damping: 22 } }
              }
              onHoverStart={() => setHovered(lobe.key)}
              onHoverEnd={() => setHovered(null)}
            />
          ))}
        </g>

        {/* Three-way sweet spot + convergence dot. */}
        <motion.path
          d={SWEET_SPOT_D}
          className="return-venn__sweet"
          initial={rest ? false : { opacity: 0 }}
          whileInView={rest ? undefined : { opacity: 1 }}
          viewport={viewport}
          transition={{ duration: 0.5, delay: 0.55 }}
          animate={{ opacity: hovered ? 0.95 : 0.6 }}
        />
        <motion.circle
          cx={DOT.x}
          cy={DOT.y}
          r={4}
          className="return-venn__dot"
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          initial={rest ? false : { scale: 0, opacity: 0 }}
          whileInView={rest ? undefined : { scale: 1, opacity: 1 }}
          viewport={viewport}
          transition={{ ...SPRING, delay: 0.65 }}
        />

        {/* Leader from the title tag into the convergence. The line draws on,
            then the explicit (colinear) arrowhead fades in as it completes. */}
        <motion.path
          d={ARROW_D}
          className="return-venn__arrow"
          fill="none"
          initial={rest ? false : { pathLength: 0, opacity: 0 }}
          whileInView={rest ? undefined : { pathLength: 1, opacity: 1 }}
          viewport={viewport}
          transition={{ duration: 0.85, delay: 0.7, ease: 'easeInOut' }}
        />
        <motion.path
          d={HEAD_D}
          className="return-venn__arrowhead"
          initial={rest ? false : { opacity: 0 }}
          whileInView={rest ? undefined : { opacity: 1 }}
          viewport={viewport}
          transition={{ duration: 0.25, delay: 1.45 }}
        />

        {/* Static overlay: title tag + all text. Non-interactive so it never
            blocks lobe hover. */}
        <motion.g
          className="return-venn__labels"
          initial={rest ? false : { opacity: 0 }}
          whileInView={rest ? undefined : { opacity: 1 }}
          viewport={viewport}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Title tag */}
          <g className="return-venn__tag">
            <rect x="157" y="173" width="280" height="22" rx="4" />
            <text x="297" y="190" textAnchor="middle" className="return-venn__tag-text">
              Ideal return reason taxonomy
            </text>
          </g>

          {/* Lobe headings + questions */}
          {LOBES.map((lobe) => (
            <g
              key={lobe.key}
              className={`return-venn__label ${hovered === lobe.key ? 'is-active' : ''
                }`}
            >
              <text
                x={lobe.labelX}
                y={lobe.titleY}
                textAnchor="middle"
                className="return-venn__title"
              >
                {lobe.title}
              </text>
              <text
                x={lobe.labelX}
                y={lobe.titleY + 19}
                textAnchor="middle"
                className="return-venn__question"
              >
                {lobe.lines.map((line, j) => (
                  <tspan key={j} x={lobe.labelX} dy={j === 0 ? 0 : 15}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          ))}

          {/* Pairwise-overlap captions */}
          {OVERLAPS.map((ov, i) => {
            const y = i === 0 ? 392 : 525;
            return (
              <text
                key={i}
                x={ov.x}
                y={y}
                textAnchor="middle"
                className="return-venn__overlap"
              >
                {ov.lines.map((line, j) => (
                  <tspan key={j} x={ov.x} dy={j === 0 ? 0 : 15}>
                    {line}
                  </tspan>
                ))}
              </text>
            );
          })}
        </motion.g>
      </svg>
    </figure>
  );
}
