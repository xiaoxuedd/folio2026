import { useState } from 'react';
import './ReturnJourneyMap.css';

export interface JourneySegment {
  src: string;
  srcset?: string;
  width?: number;
  height?: number;
  alt: string;
  /** Short caption shown under the segment in the split state. */
  caption: string;
}

export interface JourneyBox {
  title: string;
  body: string;
  /** Position on the combined map, as percentages. */
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Props {
  segments: JourneySegment[];
  boxes: JourneyBox[];
}

type Mode = 'split' | 'locked' | 'boxed';

/**
 * ReturnJourneyMap
 *
 * The returns landscape map, shown first as three separated segments
 * (Before / During / After the return). Hovering the **first** segment locks
 * the three together into the seamless combined map; hovering the **second**
 * overlays three labelled framing boxes (Pre-purchase / Post-purchase /
 * Data & operation) on the combined map. Hovering the third just holds the
 * combined map. Leaving the map returns it to the split state.
 *
 * The whole effect is scoped to this element — nothing else on the page moves.
 */
export default function ReturnJourneyMap({ segments, boxes }: Props) {
  const [mode, setMode] = useState<Mode>('split');

  const onSegmentEnter = (index: number) => {
    if (index === 1) setMode('boxed');
    else setMode('locked');
  };

  const locked = mode === 'locked' || mode === 'boxed';

  return (
    <figure
      className={`rjm rjm--${mode}`}
      onMouseLeave={() => setMode('split')}
      aria-label="Returns landscape map — before, during, and after the return"
    >
      <div
        className={`rjm__track ${locked ? 'is-locked' : ''}`}
        style={{
          // Proportional columns so the segments tile back into the full map.
          gridTemplateColumns: segments.map((s) => `${s.width ?? 1}fr`).join(' '),
        }}
      >
        {segments.map((seg, i) => (
          <button
            type="button"
            className="rjm__segment"
            key={i}
            onMouseEnter={() => onSegmentEnter(i)}
            onFocus={() => onSegmentEnter(i)}
            aria-pressed={i === 1 ? mode === 'boxed' : locked}
          >
            <img
              className="rjm__img"
              src={seg.src}
              srcSet={seg.srcset}
              width={seg.width}
              height={seg.height}
              alt={seg.alt}
              draggable={false}
              loading="lazy"
            />
            <span className="rjm__caption">{seg.caption}</span>
          </button>
        ))}

        {/* Framing boxes — only interactive/visible once the map is "boxed". */}
        <div className="rjm__boxes" aria-hidden={mode !== 'boxed'}>
          {boxes.map((box, i) => (
            <div
              className="rjm__box"
              key={i}
              style={{
                left: `${box.left}%`,
                top: `${box.top}%`,
                width: `${box.width}%`,
                height: `${box.height}%`,
                transitionDelay: mode === 'boxed' ? `${i * 90}ms` : '0ms',
              }}
            >
              <span className="rjm__box-title">{box.title}</span>
              <span className="rjm__box-body">{box.body}</span>
            </div>
          ))}
        </div>
      </div>

      <figcaption className="rjm__hint">
        {mode === 'split' && 'Hover the first stage to assemble the map'}
        {mode === 'locked' && 'Hover “During the return” to see how it’s framed'}
        {mode === 'boxed' && 'Three lenses on one journey'}
      </figcaption>
    </figure>
  );
}
