import React, { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';
import { trackEvent } from '../utils/analytics';
import { ProximityTilt } from './ProximityTilt';
import { useLondonTime } from '../utils/useLondonTime';
import './HeroText.css';

interface HeroTextProps {
  avatarSrc?: string;
  avatarAlt?: string;
}

const ClockGlyph = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

// Proximity magnetism for the "?!" badge — mirrors the dock-style smoothstep
// falloff used by the hero diagram's pills (see RadialDiagram.tsx). The badge
// grows as the cursor nears it so it reads as interactive without a permanent
// loud treatment. Radius is in px (the badge is small + fixed-ish in size);
// max bump is the extra scale it reaches with the cursor right on top.
const PRON_PROXIMITY_RADIUS = 150;
const PRON_PROXIMITY_MAX_BUMP = 0.22;

const HeroText: React.FC<HeroTextProps> = ({ avatarSrc, avatarAlt = 'Xiaoxue Dong' }) => {
  const prefersReducedMotion = useReducedMotion();

  // Rest shows the "?!" chip; hovering the name (or tapping/focusing the badge)
  // pops a two-line pronunciation card above it. `hovered` is mouse-driven with
  // a short close delay so crossing the small gap between the name and the badge
  // doesn't flicker it shut; `pinned` is the touch/keyboard latch.
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const revealed = hovered || pinned;
  const pronRef = useRef<HTMLSpanElement>(null);
  const badgeRef = useRef<HTMLButtonElement>(null);
  const badgeScale = useMotionValue(1);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevRevealed = useRef(false);

  const revealName = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setHovered(true);
  };
  const hideNameSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setHovered(false), 90);
  };

  // Live London local time, unfurled under the location on cursor proximity.
  const londonTime = useLondonTime();
  const pillStageRef = useRef<HTMLDivElement>(null);

  // Fire the open event once per rest→revealed transition (hover, tap, or focus).
  useEffect(() => {
    if (revealed && !prevRevealed.current) trackEvent('hero_pronunciation_open');
    prevRevealed.current = revealed;
  }, [revealed]);

  // Dock-style proximity scale, driven off pointer position within the text
  // block. No-ops under reduced motion and on touch (no pointer moves fire).
  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !badgeRef.current) return;
    const rect = badgeRef.current.getBoundingClientRect();
    const bx = rect.left + rect.width / 2;
    const by = rect.top + rect.height / 2;
    const dist = Math.hypot(e.clientX - bx, e.clientY - by);
    const t = Math.max(0, 1 - dist / PRON_PROXIMITY_RADIUS);
    const eased = t * t * (3 - 2 * t); // smoothstep
    badgeScale.set(1 + eased * PRON_PROXIMITY_MAX_BUMP);
  };

  const resetBadgeScale = () => badgeScale.set(1);

  // Touch/keyboard latch: a tap or focus pins the phonetic open; dismiss on
  // outside tap or Escape.
  useEffect(() => {
    if (!pinned) return;
    const onPointerDown = (e: PointerEvent) => {
      if (pronRef.current && !pronRef.current.contains(e.target as Node)) {
        setPinned(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPinned(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [pinned]);

  return (
    <div
      className="hero-text-wrapper"
      onMouseMove={handlePointerMove}
      onMouseLeave={resetBadgeScale}
    >
      <p className="hero-eyebrow hero-rise">
        Hi,
      </p>

      <h1 className="hero-heading">
        <span className="hero-heading-line hero-heading-coral hero-rise">
          I&rsquo;m{' '}
          <span
            className="hero-name"
            onMouseEnter={revealName}
            onMouseLeave={hideNameSoon}
          >
            Xiaoxue
            <span className="hero-pron" ref={pronRef}>
              <motion.button
                ref={badgeRef}
                type="button"
                className="hero-pron-badge"
                style={{ scale: prefersReducedMotion ? 1 : badgeScale }}
                aria-label="Xiaoxue is pronounced shiau-shweh"
                aria-expanded={revealed}
                onFocus={() => setPinned(true)}
                onBlur={() => setPinned(false)}
                onClick={() => setPinned((prev) => !prev)}
              >
                ?!
              </motion.button>

              <AnimatePresence>
                {revealed && (
                  <motion.span
                    className="hero-pron-bubble"
                    role="tooltip"
                    style={{ x: '-50%' }}
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 6, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.85 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="hero-pron-bubble-label">Pronounced</span>
                    <span className="hero-pron-bubble-value">/shiau&middot;shweh/</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </span>
          .
        </span>
      </h1>

      <p className="hero-mission hero-rise" style={{ animationDelay: '0.12s' }}>
        I design services that work for people, and strategies that work for the organisations delivering them.
      </p>

      {avatarSrc && (
        <div className="hero-avatar-pill-stage hero-rise" ref={pillStageRef} style={{ animationDelay: '0.22s' }}>
          <ProximityTilt
            className="hero-avatar-pill"
            tiltRange={6}
            scaleMax={1.03}
            startRadiusRatio={0.65}
            peakRadiusRatio={0.18}
            onIntensity={(i) =>
              pillStageRef.current?.style.setProperty('--reveal', i.toFixed(3))
            }
          >
            <img src={avatarSrc} alt={avatarAlt} className="hero-avatar-pill-img" />
            <div className="hero-avatar-pill-text">
              <span className="hero-avatar-pill-label">Based in</span>
              <span className="hero-avatar-pill-value">London, UK</span>
              <span className="hero-avatar-pill-time">
                <span className="hero-avatar-pill-time-row">
                  <ClockGlyph />
                  <span className="hero-avatar-pill-time-num">{londonTime.time}</span>{' '}
                  {londonTime.zone} · local time
                </span>
              </span>
            </div>
          </ProximityTilt>
        </div>
      )}
    </div>
  );
};

export default HeroText;
