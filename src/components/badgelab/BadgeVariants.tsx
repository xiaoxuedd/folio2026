import { useRef } from 'react';
import { ProximityTilt } from '../ProximityTilt';
import { useLondonTime } from '../../utils/useLondonTime';
import './BadgeVariants.css';

/**
 * Lab variants for the hero "Based in London" badge. Each rides the
 * ProximityTilt proximity ramp: `onIntensity` writes the eased 0..1 value to a
 * `--reveal` custom property on the stable `.badge-stage`, and CSS keys the
 * time reveal (slide / crossfade / unfurl / flip) off it.
 *
 * Variant C (unfurl) is the chosen one and lives for real in HeroText; this
 * harness is kept around for comparison + further tweaking. The TILT tuning
 * below mirrors the tightened values now used in the hero.
 */

interface VariantProps {
  avatarSrc: string;
  avatarAlt?: string;
}

// Shared proximity tuning — mirrors the hero (only triggers when close).
const TILT = {
  tiltRange: 6,
  scaleMax: 1.03,
  startRadiusRatio: 0.65,
  peakRadiusRatio: 0.18,
} as const;

const ClockGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

/** Drives `--reveal` on a stage element from the proximity intensity. */
function useReveal() {
  const stageRef = useRef<HTMLDivElement>(null);
  const onIntensity = (i: number) => {
    stageRef.current?.style.setProperty('--reveal', i.toFixed(3));
  };
  return { stageRef, onIntensity };
}

/* Variant A — slide-in time chip (HeroCTAAlternative homage) */
export function BadgeSlideIn({ avatarSrc, avatarAlt = 'Xiaoxue Dong' }: VariantProps) {
  const { time, zone } = useLondonTime();
  const { stageRef, onIntensity } = useReveal();
  return (
    <div className="badge-stage badge-a" ref={stageRef}>
      <ProximityTilt className="badge-pill" {...TILT} onIntensity={onIntensity}>
        <img className="badge-photo" src={avatarSrc} alt={avatarAlt} />
        <div className="badge-text">
          <span className="badge-label">Based in</span>
          <span className="badge-value">London, UK</span>
        </div>
        <div className="badge-a-chip">
          <ClockGlyph />
          <span className="badge-time-num">{time}</span> {zone}
        </div>
      </ProximityTilt>
    </div>
  );
}

/* Variant B — crossfade swap in place */
export function BadgeCrossfade({ avatarSrc, avatarAlt = 'Xiaoxue Dong' }: VariantProps) {
  const { time, zone } = useLondonTime();
  const { stageRef, onIntensity } = useReveal();
  return (
    <div className="badge-stage badge-b" ref={stageRef}>
      <ProximityTilt className="badge-pill" {...TILT} onIntensity={onIntensity}>
        <img className="badge-photo" src={avatarSrc} alt={avatarAlt} />
        <div className="badge-text">
          <span className="badge-label">Based in</span>
          <span className="badge-b-swap">
            <span className="badge-value badge-b-place">London, UK</span>
            <span className="badge-value badge-b-time">
              <span className="badge-time-num">{time}</span> {zone}
            </span>
          </span>
        </div>
      </ProximityTilt>
    </div>
  );
}

/* Variant C — unfurl a time row below the location (chosen) */
export function BadgeUnfurl({ avatarSrc, avatarAlt = 'Xiaoxue Dong' }: VariantProps) {
  const { time, zone } = useLondonTime();
  const { stageRef, onIntensity } = useReveal();
  return (
    <div className="badge-stage badge-c" ref={stageRef}>
      <ProximityTilt className="badge-pill" {...TILT} onIntensity={onIntensity}>
        <img className="badge-photo" src={avatarSrc} alt={avatarAlt} />
        <div className="badge-text">
          <span className="badge-label">Based in</span>
          <span className="badge-value">London, UK</span>
          <span className="badge-c-unfurl">
            <span className="badge-c-row">
              <ClockGlyph />
              <span className="badge-time-num">{time}</span> {zone} · local time
            </span>
          </span>
        </div>
      </ProximityTilt>
    </div>
  );
}

/* Variant D — the face rolls in (coin flip to a clock face) */
export function BadgeFaceRoll({ avatarSrc, avatarAlt = 'Xiaoxue Dong' }: VariantProps) {
  const { time, zone } = useLondonTime();
  const { stageRef, onIntensity } = useReveal();
  return (
    <div className="badge-stage badge-d" ref={stageRef}>
      <ProximityTilt className="badge-pill" {...TILT} onIntensity={onIntensity}>
        <div className="badge-d-flip">
          <div className="badge-d-face badge-d-front">
            <img src={avatarSrc} alt={avatarAlt} />
          </div>
          <div className="badge-d-face badge-d-back">
            <span className="badge-d-back-time">{time}</span>
            <span className="badge-d-back-zone">{zone}</span>
          </div>
        </div>
        <div className="badge-text">
          <span className="badge-label">Based in</span>
          <span className="badge-value">London, UK</span>
        </div>
      </ProximityTilt>
    </div>
  );
}
