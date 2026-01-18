import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Mail, Heart, Star, Sparkles, ArrowRight, Zap } from 'lucide-react';
import './MicrointeractionExamples.css';

const MicrointeractionExamples = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showRipple, setShowRipple] = useState(false);

  // Magnetic button states
  const magneticX = useMotionValue(0);
  const magneticY = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150 };
  const x = useSpring(magneticX, springConfig);
  const y = useSpring(magneticY, springConfig);

  // Tilt card state with smooth interpolation
  const tiltXRaw = useMotionValue(0);
  const tiltYRaw = useMotionValue(0);
  const tiltSpringConfig = { damping: 20, stiffness: 200 };
  const tiltX = useSpring(tiltXRaw, tiltSpringConfig);
  const tiltY = useSpring(tiltYRaw, tiltSpringConfig);
  const rotateX = useTransform(tiltY, [-100, 100], [10, -10]);
  const rotateY = useTransform(tiltX, [-100, 100], [-10, 10]);

  const handleMagneticMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    magneticX.set((e.clientX - centerX) * 0.3);
    magneticY.set((e.clientY - centerY) * 0.3);
  };

  const handleMagneticLeave = () => {
    magneticX.set(0);
    magneticY.set(0);
  };

  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    tiltXRaw.set(e.clientX - centerX);
    tiltYRaw.set(e.clientY - centerY);
  };

  const handleTiltLeave = () => {
    tiltXRaw.set(0);
    tiltYRaw.set(0);
  };

  const handleRippleClick = () => {
    setShowRipple(true);
    setClickCount(prev => prev + 1);
    setTimeout(() => setShowRipple(false), 600);
  };

  return (
    <div className="examples-container">

      {/* 1. Magnetic Button */}
      <section className="example-section">
        <h2>1. Magnetic Button</h2>
        <p className="description">Button follows cursor with spring physics</p>
        <motion.button
          className="magnetic-button"
          style={{ x, y }}
          onMouseMove={handleMagneticMove}
          onMouseLeave={handleMagneticLeave}
          whileTap={{ scale: 0.95 }}
        >
          <Mail size={20} />
          Hover me
        </motion.button>
      </section>

      {/* 2. Scale & Bounce Button */}
      <section className="example-section">
        <h2>2. Scale & Bounce</h2>
        <p className="description">Classic hover scale with bounce animation</p>
        <motion.button
          className="bounce-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Sparkles size={20} />
          Click me
        </motion.button>
      </section>

      {/* 3. 3D Tilt Card */}
      <section className="example-section">
        <h2>3. 3D Tilt Card</h2>
        <p className="description">Card tilts based on cursor position</p>
        <motion.div
          className="tilt-card"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          onMouseMove={handleTiltMove}
          onMouseLeave={handleTiltLeave}
          whileHover={{ scale: 1.02 }}
        >
          <div style={{ transform: "translateZ(50px)" }}>
            <Star size={48} color="#6443fe" />
            <h3>Hover to tilt</h3>
            <p>Move your cursor around</p>
          </div>
        </motion.div>
      </section>

      {/* 4. Ripple Effect */}
      <section className="example-section">
        <h2>4. Ripple on Click</h2>
        <p className="description">Material-style ripple feedback</p>
        <motion.button
          className="ripple-button"
          onClick={handleRippleClick}
          whileTap={{ scale: 0.98 }}
        >
          <AnimatePresence>
            {showRipple && (
              <motion.span
                className="ripple"
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            )}
          </AnimatePresence>
          <Zap size={20} />
          Clicked {clickCount} times
        </motion.button>
      </section>

      {/* 5. Icon Animations */}
      <section className="example-section">
        <h2>5. Animated Icons</h2>
        <p className="description">Different hover behaviors for icons</p>
        <div className="icon-grid">
          <motion.div
            className="icon-box"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Star size={32} />
            <span>Rotate</span>
          </motion.div>

          <motion.div
            className="icon-box"
            whileHover={{ y: -8 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ArrowRight size={32} />
            <span>Float</span>
          </motion.div>

          <motion.div
            className="icon-box"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Sparkles size={32} />
            <span>Scale</span>
          </motion.div>

          <motion.div
            className="icon-box"
            whileHover={{
              rotate: [0, -10, 10, -10, 10, 0],
              transition: { duration: 0.5 }
            }}
          >
            <Zap size={32} />
            <span>Wiggle</span>
          </motion.div>
        </div>
      </section>

      {/* 6. Like Button with State */}
      <section className="example-section">
        <h2>6. Animated State Toggle</h2>
        <p className="description">Like button with satisfying feedback</p>
        <motion.button
          className={`like-button ${isLiked ? 'liked' : ''}`}
          onClick={() => setIsLiked(!isLiked)}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{
              scale: isLiked ? [1, 1.3, 1] : 1,
              rotate: isLiked ? [0, -10, 10, 0] : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <Heart size={24} fill={isLiked ? "#ff4444" : "none"} />
          </motion.div>
          {isLiked ? 'Liked!' : 'Like'}
        </motion.button>
      </section>

      {/* 7. Hover Lift Cards */}
      <section className="example-section">
        <h2>7. Hover Lift Effect</h2>
        <p className="description">Cards lift with shadow on hover</p>
        <div className="card-grid">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="lift-card"
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(100, 67, 254, 0.2)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h4>Card {i}</h4>
              <p>Hover to lift</p>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default MicrointeractionExamples;
