import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import './ScrollIndicator.css';

const ScrollIndicator = () => {
  return (
    <motion.a
      href="#projects"
      className="scroll-indicator"
      initial={{ opacity: 0, y: -10 }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        opacity: { delay: 1, duration: 0.5 },
        y: { delay: 1, duration: 0.5 }
      }}
    >
      <motion.div
        animate={{
          y: [0, 8, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <ChevronDown size={32} strokeWidth={2} />
      </motion.div>
    </motion.a>
  );
};

export default ScrollIndicator;
