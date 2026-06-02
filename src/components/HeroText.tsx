import React, { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  const [pronOpen, setPronOpen] = useState(false);
  const pronRef = useRef<HTMLSpanElement>(null);
  const badgeRef = useRef<HTMLButtonElement>(null);
  const badgeScale = useMotionValue(1);

  // Live London local time, unfurled under the location on cursor proximity.
  const londonTime = useLondonTime();
  const pillStageRef = useRef<HTMLDivElement>(null);

  const fadeUp = (delay: number) => ({
    initial: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay: prefersReducedMotion ? 0 : delay },
  });

  const openPron = (open: boolean) => {
    setPronOpen((prev) => {
      if (open && !prev) trackEvent('hero_pronunciation_open');
      return open;
    });
  };

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

  // Tap-to-toggle needs a way to dismiss: close on outside tap or Escape.
  useEffect(() => {
    if (!pronOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (pronRef.current && !pronRef.current.contains(e.target as Node)) {
        setPronOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPronOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [pronOpen]);

  return (
    <div
      ref={ref}
      className="hero-text-wrapper"
      onMouseMove={handlePointerMove}
      onMouseLeave={resetBadgeScale}
    >
      <motion.p className="hero-eyebrow" {...fadeUp(0.1)}>
        Hi,
      </motion.p>

      <h1 className="hero-heading">
        <motion.span className="hero-heading-line hero-heading-coral" {...fadeUp(0.2)}>
          I&rsquo;m{' '}
          <span className="hero-name">
            Xiaoxue
            <span className="hero-pron" ref={pronRef}>
              <motion.button
                ref={badgeRef}
                type="button"
                className="hero-pron-badge"
                style={{ scale: prefersReducedMotion ? 1 : badgeScale }}
                aria-label="How to pronounce Xiaoxue"
                aria-expanded={pronOpen}
                onMouseEnter={() => openPron(true)}
                onMouseLeave={() => openPron(false)}
                onFocus={() => openPron(true)}
                onBlur={() => openPron(false)}
                onClick={() => openPron(!pronOpen)}
              >
                ?!
              </motion.button>

              <AnimatePresence>
                {pronOpen && (
                  <motion.span
                    className="hero-pron-bubble"
                    role="tooltip"
                    style={{ x: '-50%' }}
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <span className="hero-pron-bubble-label">Pronounced</span>
                    <span className="hero-pron-bubble-value">/shiau&middot;shweh/</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </span>
          .
        </motion.span>
      </h1>

      <motion.p className="hero-mission" {...fadeUp(0.36)}>
        I design services that work for people, and strategies that work for the organisations delivering them.
      </motion.p>

      {avatarSrc && (
        <motion.div className="hero-avatar-pill-stage" ref={pillStageRef} {...fadeUp(0.52)}>
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
        </motion.div>
      )}
    </div>
  );
};

export default HeroText;
