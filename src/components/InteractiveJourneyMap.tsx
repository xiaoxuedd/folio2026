import { useState, useRef, useLayoutEffect } from 'react';
import './InteractiveJourneyMap.css';

// Proportional widths of the three journey-map segments (source pixels).
// Assembled, they are 7734 × 2452 — so flex weights == pixel widths means the
// three crops tile back together seamlessly with object-fit: cover (the box
// aspect ratio of each segment exactly matches its crop, so nothing is cut).
const SEG_WIDTHS = [2725, 3425, 1584];
const TOP_AR = 7734 / 2452;    // assembled top map
const BOT_AR = 16112 / 4197;   // full bottom landscape map

interface Seg { src: string; srcset?: string; }

interface Props {
  seg1: Seg;
  seg2: Seg;
  seg3: Seg;
  bottomSrc: string;
}

type Status = 1 | 2 | 3;

const TILES = [
  {
    n: '01',
    title: 'Making the problem clear',
    sub: 'Built a shared visibility across 10+ teams, shifted the conversation from “what do we fix?” to “how do we work on this together?”',
    s: 1 as Status,
  },
  {
    n: '02',
    title: 'Aligning on priorities',
    sub: 'Better experiences across phases, built on one data and operations foundation, not a bottleneck. Three priorities, one goal, and every team could see how their work moved the others forward.',
    s: 2 as Status,
  },
  {
    n: '03',
    title: 'Making the solution actionable',
    sub: 'Most blueprints get admired, then ignored. This one was built to be used: KPIs made insight measurable, named owners created real accountability, and a live view of existing work meant nothing got duplicated or lost.',
    s: 3 as Status,
  },
];

// Overlay positions as % of the assembled top map.
const OVERLAYS = [
  { left: 9.75, top: 25, width: 25, label: 'Pre-Purchase Experience', sub: 'Help customers make the right purchase, first time', delay: 0 },
  { left: 36, top: 25, width: 60, label: 'Post-Purchase Experience', sub: 'Turn the return moment into a retention opportunity', delay: 1 },
  { left: 9.75, top: 63, width: 86.25, label: 'Data & Operation Ecosystem', sub: 'The accuracy and efficiency layer everything else builds on', delay: 2 },
];

export default function InteractiveJourneyMap({ seg1, seg2, seg3, bottomSrc }: Props) {
  const [status, setStatus] = useState<Status>(1);
  const [width, setWidth] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);

  // Measure the frame's inner width so panel heights track the real image
  // proportions — no cropping, seamless tiling, exact slide distance.
  useLayoutEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const topH = width > 0 ? width / TOP_AR : 0;
  const botH = width > 0 ? width / BOT_AR : 0;
  const frameH = status === 3 ? botH : topH;
  const wrapY = status === 3 ? -topH : 0;
  const segs = [seg1, seg2, seg3];

  return (
    <div className="ijm">
      <header className="ijm__header">
        <h3 className="ijm__heading">
          One map, read <em>three</em> ways.
        </h3>
        <p className="ijm__subtext">
          Service design is often associated with mapping, and for good reason. But a map is only
          as useful as the decisions it enables. I used the mapping exercise to do three distinct
          jobs:
        </p>
      </header>

      <div className="ijm__tiles" role="tablist">
        {TILES.map((t) => {
          const active = status === t.s;
          return (
            <button
              key={t.s}
              role="tab"
              aria-selected={active}
              className={`ijm__tile${active ? ' ijm__tile--active' : ''}`}
              onClick={() => setStatus(t.s)}
              onMouseEnter={() => setStatus(t.s)}
              onFocus={() => setStatus(t.s)}
            >
              <div className="ijm__tile-top">
                <span className="ijm__tile-n">{t.n}</span>
                <span className="ijm__tile-dot" aria-hidden="true" />
              </div>
              <span className="ijm__tile-title">{t.title}</span>
              <span className="ijm__tile-sub">{t.sub}</span>
            </button>
          );
        })}
      </div>

      <div
        ref={frameRef}
        className="ijm__frame"
        style={width > 0 ? { height: frameH } : undefined}
        role="tabpanel"
        aria-label={TILES[status - 1].title}
      >
        <div className="ijm__wrap" style={{ transform: `translateY(${wrapY}px)` }}>

          {/* Top panel — three crops tiled seamlessly */}
          <div
            className="ijm__top-panel"
            style={width > 0 ? { height: topH } : undefined}
          >
            <div className="ijm__segs">
              {segs.map((seg, i) => (
                <div key={i} className="ijm__seg" style={{ flex: SEG_WIDTHS[i] }}>
                  <img
                    src={seg.src}
                    srcSet={seg.srcset}
                    alt={['Before the return', 'During the return', 'After the return'][i]}
                    draggable={false}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            {/* State-2 annotation overlays */}
            {OVERLAYS.map((ov, i) => (
              <div
                key={i}
                className={`ijm__overlay${i < 2 ? ' ijm__overlay--row' : ''}${status === 2 ? ' is-visible' : ''}`}
                style={{
                  left: `${ov.left}%`,
                  top: `${ov.top}%`,
                  width: `${ov.width}%`,
                  transitionDelay: status === 2 ? `${ov.delay * 0.12}s` : '0s',
                }}
              >
                <strong>{ov.label}</strong>
                <span>{ov.sub}</span>
              </div>
            ))}
          </div>

          {/* Bottom panel — full landscape bottom map */}
          <div
            className="ijm__bot-panel"
            style={width > 0 ? { height: botH } : undefined}
          >
            <img
              src={bottomSrc}
              alt="Full returns landscape map — the complete journey in one view"
              draggable={false}
              loading="lazy"
            />
            <div className={`ijm__bot-card${status === 3 ? ' is-visible' : ''}`}>
              <div className="ijm__bot-card-inner">
                <div className="ijm__bot-text">
                  <strong className="ijm__s3-heading">30+ Business activities</strong>
                  <p className="ijm__s3-body">
                    Consolidate all the ongoing and planning initiatives tackling returns.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
