import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import './HeroText.css';

const HeroText: React.FC = () => {
  const [subtitleComplete, setSubtitleComplete] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5  // 0.5s delay after typewriter
      }
    }
  };

  const typewriterContainerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0
      }
    }
  };

  const typewriterCharVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.1
      }
    }
  };

  const lineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const thinkingStrikeVariants = {
    hidden: { width: 0 },
    visible: {
      width: '100%',
      transition: {
        duration: 0.8,
        delay: 0.7
      }
    }
  };

  const thinkingFadeVariants = {
    visible: { opacity: 0.5, fontWeight: 'var(--font-weight-semibold)' },
    faded: {
      opacity: 0.5,
      fontWeight: 'var(--font-weight-semibold)',
      transition: {
        duration: 0.4,
        delay: 0.2
      }
    }
  };

  const doingEmphasisVariants = {
    initial: {
      fontWeight: 'var(--font-weight-semibold)',
      color: 'var(--color-text)',
      opacity: 0.5
    },
    emphasized: {
      fontWeight: 'var(--font-weight-semibold)',
      color: 'var(--color-text)',
      opacity: 1,
      transition: {
        duration: 0.4,
        delay: 1.0
      }
    }
  };

  // Split text into logical line segments with emphasis markers and opacity
  const lines = [
    { text: "Pronounced as /shiau_shweh/, ", type: "normal" },
    { text: "I translate design ", type: "faint" },
    { text: "thinking", type: "thinking" },
    { text: " into design ", type: "faint" },
    { text: "doing", type: "doing" },
    { text: ", by guiding teams, shaping strategy, and shipping products that scale growth and impact.", type: "faint" }
  ];

  const typewriterText = "Hi, I'm Xiaoxue.";
  const characters = typewriterText.split("");

  return (
    <motion.div
      ref={ref}
      className="hero-text-wrapper"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <motion.div className="hero-text-section" variants={lineVariants}>
        <p className="hero-overline">Service design • product • strategy</p>
      </motion.div>
      <div className="hero-text-section">
        <motion.h1
          className="hero-h0"
          variants={typewriterContainerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {characters.map((char, index) => (
            <motion.span
              key={index}
              variants={typewriterCharVariants}
              style={{ display: 'inline-block', minWidth: char === ' ' ? '0.25em' : 'auto' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.h1>
      </div>
      <motion.div
        className="hero-text-section"
        variants={lineVariants}
        onAnimationComplete={() => setSubtitleComplete(true)}
      >
        <h1 className="hero-h1 hero-subtitle-text">
          {lines.map((line, index) => {
            if (line.type === "thinking") {
              return (
                <motion.span
                  key={index}
                  className="hero-emphasis hero-thinking"
                  variants={thinkingFadeVariants}
                  initial="visible"
                  animate={subtitleComplete ? "faded" : "visible"}
                >
                  {line.text}
                  <motion.span
                    className="hero-strikethrough"
                    variants={thinkingStrikeVariants}
                    initial="hidden"
                    animate={subtitleComplete ? "visible" : "hidden"}
                  />
                </motion.span>
              );
            }

            if (line.type === "doing") {
              return (
                <motion.span
                  key={index}
                  className="hero-doing"
                  variants={doingEmphasisVariants}
                  initial="initial"
                  animate={subtitleComplete ? "emphasized" : "initial"}
                >
                  {line.text}
                </motion.span>
              );
            }

            const className = line.type === "faint" ? "hero-faint" : "";
            return (
              <span key={index} className={className}>
                {line.text}
              </span>
            );
          })}
        </h1>
      </motion.div>
    </motion.div>
  );
};

export default HeroText;
