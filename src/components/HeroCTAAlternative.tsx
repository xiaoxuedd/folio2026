import { motion } from 'framer-motion';
import './HeroCTAAlternative.css';

interface HeroCTAAlternativeProps {
  text?: string;
  href?: string;
}

const HeroCTAAlternative = ({ text = "View my work", href = "#projects" }: HeroCTAAlternativeProps) => {
  return (
    <motion.a
      href={href}
      className="hero-cta-alt"
      whileHover="hover"
      initial="initial"
    >
      <motion.div
        className="hero-cta-alt-inner"
        variants={{
          initial: { paddingRight: '24px' },
          hover: { paddingRight: '60px' }
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <span className="hero-cta-alt-text">{text}</span>
        <motion.div
          className="hero-cta-alt-icon"
          variants={{
            initial: {
              rotate: 180,
              x: 52,
              opacity: 0
            },
            hover: {
              rotate: 0,
              x: 0,
              opacity: 1
            }
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            fill="currentColor"
          >
            <path d="M208.49,152.49l-72,72a12,12,0,0,1-17,0l-72-72a12,12,0,0,1,17-17L116,187V40a12,12,0,0,1,24,0V187l51.51-51.52a12,12,0,0,1,17,17Z"></path>
          </svg>
        </motion.div>
      </motion.div>
    </motion.a>
  );
};

export default HeroCTAAlternative;
