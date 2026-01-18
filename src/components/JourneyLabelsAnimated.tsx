import { motion } from 'framer-motion';

interface LabelPosition {
  x: number;
  y: number;
  anchor: 'start' | 'middle' | 'end';
}

interface Label {
  id: string;
  title: string;
  subtitle: string;
  stage2: LabelPosition;
  stage3: LabelPosition;
}

const labels: Label[] = [
  {
    id: 'learn',
    title: 'Learn',
    subtitle: 'Centre training & resources',
    stage2: { x: 1350, y: 230, anchor: 'end' },
    stage3: { x: 850, y: 450, anchor: 'end' }
  },
  {
    id: 'schedule',
    title: 'Schedule',
    subtitle: 'Ordering & scheduling',
    stage2: { x: 1500, y: 750, anchor: 'start' },
    stage3: { x: 2050, y: 450, anchor: 'start' }
  },
  {
    id: 'supply',
    title: 'Supply',
    subtitle: 'Manufacturing & logistics',
    stage2: { x: 1350, y: 1325, anchor: 'end' },
    stage3: { x: 850, y: 1550, anchor: 'end' }
  },
  {
    id: 'assist',
    title: 'Assist',
    subtitle: 'Customer support & services',
    stage2: { x: 1500, y: 1800, anchor: 'start' },
    stage3: { x: 2050, y: 1550, anchor: 'start' }
  },
];

// Stage 3 offset adjustment
const STAGE3_OFFSET_X = 0;
const STAGE3_OFFSET_Y = 0;

interface JourneyLabelsAnimatedProps {
  stage: 2 | 3;
}

const JourneyLabelsAnimated = ({ stage }: JourneyLabelsAnimatedProps) => {
  return (
    <svg
      width="2878"
      height="2088"
      viewBox="0 0 2878 2088"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    >
      {labels.map((label) => {
        const position = stage === 2 ? label.stage2 : label.stage3;
        const offsetX = stage === 3 ? STAGE3_OFFSET_X : 0;
        const offsetY = stage === 3 ? STAGE3_OFFSET_Y : 0;

        return (
          <motion.g
            key={label.id}
            initial={{
              x: label.stage2.x,
              y: label.stage2.y,
              opacity: 0,
            }}
            animate={{
              x: position.x + offsetX,
              y: position.y + offsetY,
              opacity: 1,
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut"
            }}
          >
            {/* Title */}
            <text
              x={0}
              y={0}
              fill="#6443FE"
              fontSize="98"
              fontWeight="600"
              fontFamily="Inter, sans-serif"
              textAnchor={position.anchor}
            >
              {label.title}
            </text>
            {/* Subtitle */}
            <text
              x={0}
              y={112}
              fill="var(--color-text)"
              fontSize="72"
              fontWeight="400"
              fontFamily="Inter, sans-serif"
              textAnchor={position.anchor}
            >
              {label.subtitle}
            </text>
          </motion.g>
        );
      })}

      {/* Center text - only visible in stage 3 */}
      {stage === 3 && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1.0,
            delay: 0.5,
            ease: "easeInOut"
          }}
        >
          {/* Main title */}
          <text
            x={1439 + STAGE3_OFFSET_X}
            y="825"
            fill="#6443FE"
            fontSize="98"
            fontWeight="700"
            fontFamily="Inter, sans-serif"
            textAnchor="middle"
          >
            RLTCare
          </text>
          {/* Description - split into multiple lines for narrow width */}
          <text
            x={1439 + STAGE3_OFFSET_X}
            y="925"
            fill="var(--color-text)"
            fontSize="64"
            fontWeight="400"
            fontFamily="Inter, sans-serif"
            textAnchor="middle"
          >
            <tspan x={1439 + STAGE3_OFFSET_X} dy="0">An all-encompassing</tspan>
            <tspan x={1439 + STAGE3_OFFSET_X} dy="82">service ecosystem</tspan>
            <tspan x={1439 + STAGE3_OFFSET_X} dy="82">designed to simplify</tspan>
            <tspan x={1439 + STAGE3_OFFSET_X} dy="82">therapy adoption and</tspan>
            <tspan x={1439 + STAGE3_OFFSET_X} dy="82">minimise time to treatment</tspan>
          </text>
        </motion.g>
      )}
    </svg>
  );
};

export default JourneyLabelsAnimated;
