import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import JourneyIcons from './JourneyIcons';
import JourneyLabels from './JourneyLabels';
import JourneyLabelsAnimated from './JourneyLabelsAnimated';
import JourneyCornerIcons from './JourneyCornerIcons';
import './JourneyAnimation.css';

const STAGE_DURATIONS = {
  1: 3500, // Stage 1: 3.5s
  2: 3500, // Stage 2: 3.5s
  3: 5000, // Stage 3: 5s (more elements to display)
  4: 1500, // Stage 4: 1.5s (fade to transparent)
};

const JourneyAnimation = () => {
  const [stage, setStage] = useState(1);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference on client side
    if (typeof window !== 'undefined') {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  useEffect(() => {
    const duration = STAGE_DURATIONS[stage as keyof typeof STAGE_DURATIONS];

    const timer = setTimeout(() => {
      setStage((prev) => (prev === 4 ? 1 : prev + 1));
    }, duration);

    return () => clearTimeout(timer);
  }, [stage]);

  const fadeVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const transitionConfig = {
    duration: prefersReducedMotion ? 0.3 : 0.8,
    ease: "easeInOut" as const
  };

  // Show persistent layer (icons + path) only for stages 1 and 2
  const showPersistentLayer = stage === 1 || stage === 2;

  return (
    <div className="journey-animation-wrapper">
      <div className="journey-animation">
        {/* Persistent layer - only visible for stages 1 & 2 */}
        <AnimatePresence>
          {showPersistentLayer && (
            <motion.img
              key="persistent-layer"
              src="/images/journey-persistent.svg"
              alt="Journey icons and connecting path"
              className="journey-persistent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transitionConfig}
            />
          )}
        </AnimatePresence>

        {/* Icons layer - only visible for stages 1 & 2 */}
        <AnimatePresence>
          {showPersistentLayer && (
            <motion.div
              key="icons-layer"
              className="journey-persistent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transitionConfig}
            >
              <JourneyIcons />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Labels layer - stage 1 only */}
        <AnimatePresence>
          {stage === 1 && (
            <motion.div
              key="labels-stage1"
              className="journey-persistent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transitionConfig}
            >
              <JourneyLabels />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated labels layer - stages 2 & 3 */}
        <AnimatePresence>
          {(stage === 2 || stage === 3) && (
            <motion.div
              key="animated-labels"
              className="journey-persistent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transitionConfig}
            >
              <JourneyLabelsAnimated stage={stage === 2 ? 2 : 3} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Corner icons - stage 3 only (fade out at stage 4) */}
        <AnimatePresence>
          {stage === 3 && (
            <motion.div
              key="corner-icons"
              className="journey-persistent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transitionConfig}
            >
              <JourneyCornerIcons stage={3} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Changing content layers */}
        <AnimatePresence mode="wait">
          {stage === 3 && (
            <motion.img
              key="journey-3"
              src="/images/journey-wavey-lines.svg"
              alt="Customer journey visualization - Complete"
              variants={fadeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transitionConfig}
              className="journey-image"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Stage indicator dots - outside animation container */}
      <div className="journey-dots">
        <button
          className={`journey-dot ${stage === 1 ? 'active' : ''}`}
          aria-label="Stage 1"
        />
        <button
          className={`journey-dot ${stage === 2 ? 'active' : ''}`}
          aria-label="Stage 2"
        />
        <button
          className={`journey-dot ${stage === 3 ? 'active' : ''}`}
          aria-label="Stage 3"
        />
      </div>
    </div>
  );
};

export default JourneyAnimation;
