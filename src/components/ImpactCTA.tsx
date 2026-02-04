import { motion } from 'framer-motion';
import './ImpactCTA.css';
import { trackEvent } from '../utils/analytics';

const ImpactCTA = () => {
  const handleClick = () => {
    trackEvent('cta_click', {
      cta_location: 'impact_section',
      cta_text: 'Impact at a glance',
      destination: '#metrics'
    });
  };

  return (
    <motion.a
      href="#metrics"
      className="impact-cta"
      onClick={handleClick}
      whileHover="hover"
      initial="initial"
    >
      <motion.div
        className="impact-cta-inner"
        variants={{
          initial: { paddingRight: '24px' },
          hover: { paddingRight: '60px' }
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <span className="impact-cta-text">Impact at a glance</span>
        <motion.div
          className="impact-cta-icon"
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

export default ImpactCTA;
