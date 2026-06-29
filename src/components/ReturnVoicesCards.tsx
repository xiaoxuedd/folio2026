import { useEffect, useRef, useCallback } from 'react';
import './ReturnVoicesCards.css';

/**
 * ReturnVoicesCards
 *
 * A fanned spread of six internal stakeholder cards — Risk, Legal, CRM,
 * Customer Service, Warehouse, Merch & Buying — each voicing a different,
 * partly-contradictory view of returns. It dramatises the case study's core
 * tension: the business had never agreed on what the returns problem actually
 * was. Hovering a card lifts it to the front and clears the others' dim layer.
 *
 * Layout is JS-driven: on wide viewports the cards spread into a centred fan
 * that fills the bound width (the gap widens to reach the edges, clamped so the
 * cards keep overlapping); below the mobile breakpoint they fall back to a plain
 * stacked column. Everything is token-driven so it flips with the theme.
 */

interface VoiceCard {
  role: string;
  tag: string;
  quote: string;
  icon: 'layers' | 'grid' | 'users' | 'message' | 'home' | 'activity';
}

const VOICE_CARDS: VoiceCard[] = [
  {
    role: 'Risk',
    tag: 'Fraud & abuse',
    icon: 'layers',
    quote:
      'We sell luxury. Fraudsters know our return windows better than our own staff do.',
  },
  {
    role: 'Legal',
    tag: 'Compliance',
    icon: 'grid',
    quote:
      'Fourteen days in Germany, thirty in France. One policy does not cover all markets.',
  },
  {
    role: 'CRM',
    tag: 'Retention',
    icon: 'users',
    quote:
      'We have no agreed definition of a high-returner. Everyone is working off a different number.',
  },
  {
    role: 'Customer Service',
    tag: 'Experience',
    icon: 'message',
    quote:
      'Our highest-return customers are also our most loyal. We can’t say no to the VIPs.',
  },
  {
    role: 'Warehouse',
    tag: 'Operations',
    icon: 'home',
    quote:
      'We cannot issue a refund before inspection. Quality checks take real time and that is not going to change.',
  },
  {
    role: 'Merch & Buying',
    tag: 'Product signal',
    icon: 'activity',
    quote: 'Returns are telling us something. We just haven’t been listening.',
  },
];

// Resting fan geometry — per-card rotation (deg) and vertical offset (px).
const ROTATIONS = [-7, -3, 1, -5, 4, -2];
const VERTICALS = [8, 0, 14, 4, 10, 2];

const CARD_W = 300; // card width in px (matches .rvc__card)
const CARD_TOP = 50; // resting top offset in px (matches .rvc__card top)
const MIN_GAP = 110; // tightest fan (most overlap) before we'd rather stack
const MAX_GAP = 264; // loosest fan — keeps ~36px overlap so cards never separate
// How far to skew the focus bands toward each card's visible (left) strip.
// 0 = bands centred on card centres; 1 = bands aligned to the visible strip so
// its whole width selects that card. ~0.5 nudges it "a bit" without going all
// the way to the left edge.
const FOCUS_SKEW = 0.5;

/* ── Inline SVG icons (no extra dependency) ── */
const ICONS: Record<VoiceCard['icon'], React.ReactNode> = {
  layers: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  grid: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  ),
  users: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  message: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  home: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  activity: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
};

export default function ReturnVoicesCards() {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Fan geometry, captured on each layout so the pointer handler can map an
  // x-position to a card without re-measuring. `fan` is false in stacked mode.
  const geomRef = useRef({ startX: 0, gap: MAX_GAP, n: VOICE_CARDS.length, fan: false });
  // Currently-fronted index, so the move handler only writes the DOM on change.
  const activeRef = useRef(-1);

  /* Apply the resting fan transform to a card. */
  const setResting = useCallback((el: HTMLDivElement, i: number) => {
    el.style.transform = `rotate(${ROTATIONS[i]}deg) translateY(${VERTICALS[i]}px)`;
    el.style.zIndex = '3';
    el.style.boxShadow = 'var(--rvc-shadow-rest)';
    el.classList.remove('is-front');
  }, []);

  /* Bring a card to front, reset all others. */
  const bringToFront = useCallback(
    (activeEl: HTMLDivElement) => {
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        if (el === activeEl) {
          el.style.transform = 'rotate(0deg) translateY(-36px)';
          el.style.zIndex = '20';
          el.style.boxShadow = 'var(--rvc-shadow-front)';
          el.classList.add('is-front');
        } else {
          setResting(el, i);
        }
      });
    },
    [setResting]
  );

  /* Distribute cards: a centred fan on wide viewports, a plain column on mobile.
     The fan gap tightens to fit before we fall back to the stacked layout. */
  const layout = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const stacked = window.matchMedia('(max-width: 768px)').matches;
    if (stacked) {
      stage.classList.add('rvc__stage--stacked');
      stage.style.height = ''; // hand height back to CSS (auto, flows naturally)
      geomRef.current.fan = false;
      activeRef.current = -1;
      cardRefs.current.forEach((el) => {
        if (!el) return;
        // Hand layout back to CSS (the stacked-mode rules).
        el.style.left = '';
        el.style.transform = '';
        el.style.zIndex = '';
        el.style.boxShadow = '';
        el.classList.remove('is-front');
      });
      return;
    }

    stage.classList.remove('rvc__stage--stacked');
    const stageW = stage.offsetWidth;
    const n = VOICE_CARDS.length;
    // Fill the bound width: spread the gap as wide as the stage allows, clamped
    // so cards keep some overlap (never separate) and never collapse too tight.
    const gap = Math.max(MIN_GAP, Math.min(MAX_GAP, (stageW - CARD_W) / (n - 1)));
    const span = gap * (n - 1);
    const startX = (stageW - span - CARD_W) / 2;

    geomRef.current = { startX, gap, n, fan: true };
    activeRef.current = -1;

    let maxH = 0;
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.left = `${startX + i * gap}px`;
      setResting(el, i);
      maxH = Math.max(maxH, el.offsetHeight);
    });

    // Self-measure: fit the stage to the tallest card so there's no dead space
    // below the fan. CARD_TOP matches .rvc__card's top; the largest VERTICAL is
    // how far the lowest card sits below it (the front-lift only moves up).
    stage.style.height = `${CARD_TOP + Math.max(...VERTICALS) + maxH + 4}px`;
  }, [setResting]);

  /* Position-based hover: the card whose x-band the cursor is in gets fronted,
     not the one physically beneath the pointer. Cards stack left→right, so a
     resting card only shows its left strip (the next card covers its right);
     the bands are skewed left by FOCUS_SKEW so hovering that visible strip
     selects the card it belongs to, with no dead zones behind a raised card and
     no lift escaping the cursor. */
  const handleStageMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const stage = stageRef.current;
      const g = geomRef.current;
      if (!stage || !g.fan) return;
      const x = e.clientX - stage.getBoundingClientRect().left;
      const center0 = g.startX + CARD_W / 2;
      const skew = (FOCUS_SKEW * (CARD_W - g.gap)) / 2;
      const idx = Math.max(
        0,
        Math.min(g.n - 1, Math.round((x - center0 + skew) / g.gap))
      );
      if (idx === activeRef.current) return;
      activeRef.current = idx;
      const el = cardRefs.current[idx];
      if (el) bringToFront(el);
    },
    [bringToFront]
  );

  /* Leaving the stage settles every card back into the resting fan. */
  const handleStageLeave = useCallback(() => {
    if (!geomRef.current.fan) return;
    activeRef.current = -1;
    cardRefs.current.forEach((el, i) => {
      if (el) setResting(el, i);
    });
  }, [setResting]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    // Re-lay-out when the stage's *width* changes — viewport resize or the bound
    // width itself changing. Guarding on width keeps the height we set below from
    // feeding back into a loop, and a plain window 'resize' misses width changes
    // not driven by the window. The breakpoint crossing is handled separately
    // (mql below), since the stage's width is pinned while stacked.
    let lastW = -1;
    const run = (force = false) => {
      const w = stage.offsetWidth;
      if (!force && Math.abs(w - lastW) < 0.5) return;
      layout();
      // Re-read after: layout() may have changed the width itself by toggling
      // the stacked class (which clamps the stage to max-width: 420px).
      lastW = stage.offsetWidth;
    };
    run();
    const ro = new ResizeObserver(() => run());
    ro.observe(stage);

    // The stage is clamped to a fixed max-width in stacked mode, so once stacked
    // the ResizeObserver stops seeing width changes — widening the window back
    // past the breakpoint wouldn't re-fan. Listen to the breakpoint directly and
    // force a relayout when it flips, regardless of the stage's current width.
    const mql = window.matchMedia('(max-width: 768px)');
    const onBreakpoint = () => run(true);
    mql.addEventListener('change', onBreakpoint);

    return () => {
      ro.disconnect();
      mql.removeEventListener('change', onBreakpoint);
    };
  }, [layout]);

  return (
    <section className="rvc">
      <div className="rvc__header">
        <span className="rvc__eyebrow">Internal perspectives</span>
      </div>

      <div
        className="rvc__stage"
        ref={stageRef}
        onMouseMove={handleStageMove}
        onMouseLeave={handleStageLeave}
      >
        {VOICE_CARDS.map((card, i) => (
          <div
            key={card.role}
            className="rvc__card"
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
          >
            <div className="rvc__card-header">
              <div className="rvc__icon">{ICONS[card.icon]}</div>
              {/* Stacked-only: takes the hidden icon's slot on mobile so the
                  role reads on the header row beside the tag. */}
              <span className="rvc__role rvc__role--inline">{card.role}</span>
              <span className="rvc__tag">{card.tag}</span>
            </div>

            <div className="rvc__role">{card.role}</div>
            <p className="rvc__quote">&ldquo;{card.quote}&rdquo;</p>
          </div>
        ))}
      </div>

      <span className="rvc__hint">Hover any card to bring it forward</span>
    </section>
  );
}
