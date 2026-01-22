import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Highlighter } from '@/registry/magicui/highlighter';
import './HeroText.css';

const HeroText: React.FC = () => {
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
      >
        <h1 className="hero-h1 hero-subtitle-text">
          <span className="hero-faint">
            Pronounced as /shiau_shweh/, I translate design{" "}
            <Highlighter action="underline" color="var(--color-primary)" strokeWidth={3} padding={0} animationDuration={600} delay={1500}>
              thinking
            </Highlighter>
            {" "}into design{" "}
            <Highlighter action="highlight" color="var(--color-primary)" animationDuration={300} delay={1900} textColor="#ffffff">
              doing
            </Highlighter>
            , by guiding teams, shaping strategy, and shipping products that scale growth and impact.
          </span>
        </h1>
      </motion.div>
    </motion.div>
  );
};

export default HeroText;
