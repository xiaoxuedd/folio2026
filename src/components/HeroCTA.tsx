import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import './HeroCTA.css';

const HeroCTA = () => {
  return (
    <motion.a
      href="#projects"
      className="hero-cta-button"
      whileHover={{
        y: -2,
        backgroundColor: '#6443fe',
        color: '#ffffff'
      }}
      whileTap={{ scale: 0.98 }}
    >
      View My Work
      <ArrowDown size={16} strokeWidth={2.5} />
    </motion.a>
  );
};

export default HeroCTA;
