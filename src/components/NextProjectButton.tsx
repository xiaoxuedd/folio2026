import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import './NextProjectButton.css';
import { trackEvent } from '../utils/analytics';

interface Props {
  /** Destination URL for the next case study. */
  href: string;
  /** Pill label — defaults to "Next project". */
  label?: string;
  /** Title of the project being navigated to (for analytics). */
  projectTitle?: string;
  /** Accent for the tint + reveal circle: mint (site accent) or purple (project). */
  accent?: 'mint' | 'purple';
}

/**
 * Pill CTA that expands on hover and slides in a rotating arrow inside a
 * circle. Adapted from the old hero CTA reveal. The accent (mint/purple) tints
 * the backdrop and circle. Reduced-motion users get the icon shown statically.
 */
export default function NextProjectButton({
  href,
  label = 'Next project',
  projectTitle,
  accent = 'mint',
}: Props) {
  const reduce = useReducedMotion();
  const accentVar = accent === 'purple' ? 'var(--project)' : 'var(--accent)';

  return (
    <motion.a
      href={href}
      className="next-project-cta"
      style={{ '--cta-accent': accentVar } as React.CSSProperties}
      whileHover={reduce ? undefined : 'hover'}
      initial={reduce ? 'hover' : 'initial'}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      onClick={() =>
        trackEvent('project_click', {
          project_title: projectTitle,
          project_link: href,
          location: 'case_study_footer',
        })
      }
    >
      <motion.div
        className="next-project-cta__inner"
        variants={{
          initial: { paddingRight: '24px' },
          hover: { paddingRight: '66px' },
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <span className="next-project-cta__text">{label}</span>
        <motion.div
          className="next-project-cta__icon"
          variants={{
            initial: { rotate: -90, x: 52, opacity: 0 },
            hover: { rotate: 0, x: 0, opacity: 1 },
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          aria-hidden="true"
        >
          <ArrowRight size={20} strokeWidth={2} />
        </motion.div>
      </motion.div>
    </motion.a>
  );
}
