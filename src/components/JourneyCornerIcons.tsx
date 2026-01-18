import { motion } from 'framer-motion';
import { Book, CalendarCheck, MessageSquare, Package } from 'lucide-react';

interface CornerIcon {
  Icon: any;
  angle: number;  // degrees, 0 = right, 90 = bottom, 180 = left, 270 = top
  radius: number; // distance from center
}

const cornerIcons: CornerIcon[] = [
  { Icon: Book, angle: 315, radius: 635 },          // Top left - Learn
  { Icon: CalendarCheck, angle: 45, radius: 640 }, // Top right - Schedule
  { Icon: MessageSquare, angle: 135, radius: 615 },  // Bottom right - Assist
  { Icon: Package, angle: 225, radius: 605 },       // Bottom left - Supply
];

// Center of the viewBox
const CENTER_X = 2878 / 2; // 1439
const CENTER_Y = 2088 / 2; // 1044

// Stage 3 offset adjustment
const STAGE3_OFFSET_X = 0;
const STAGE3_OFFSET_Y = 0;

interface JourneyCornerIconsProps {
  stage: 3;
}

const JourneyCornerIcons = ({ stage }: JourneyCornerIconsProps) => {
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
      {cornerIcons.map((item, index) => {
        const circleRadius = 90;
        const iconSize = 90;

        // Convert polar to Cartesian coordinates
        const angleRad = (item.angle - 90) * (Math.PI / 180); // Subtract 90 to make 0° = top
        const x = CENTER_X + STAGE3_OFFSET_X + item.radius * Math.cos(angleRad);
        const y = CENTER_Y + STAGE3_OFFSET_Y + item.radius * Math.sin(angleRad);

        return (
          <motion.g
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              duration: 0.6,
              delay: 0.8 + index * 0.15,
              ease: "easeOut"
            }}
          >
            {/* Purple circle */}
            <circle
              cx={x}
              cy={y}
              r={circleRadius}
              fill="#6443FE"
            />
            {/* White icon */}
            <foreignObject
              x={x - iconSize / 2}
              y={y - iconSize / 2}
              width={iconSize}
              height={iconSize}
            >
              <div
                style={{
                  width: iconSize,
                  height: iconSize,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <item.Icon size={iconSize * 0.95} color="white" strokeWidth={2} />
              </div>
            </foreignObject>
          </motion.g>
        );
      })}
    </svg>
  );
};

export default JourneyCornerIcons;
