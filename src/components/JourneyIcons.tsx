import {
  GraduationCap,
  Hospital,
  Stethoscope,
  Scan,
  CalendarClock,
  Cylinder,
  PackageOpen,
  Truck,
  Plane,
  Syringe,
  FileText,
  FolderPlus
} from 'lucide-react';

const icons = [
  { Icon: GraduationCap, x: 820, y: 565, size: 180 },
  { Icon: Hospital, x: 1428, y: 565, size: 180 },
  { Icon: Stethoscope, x: 2037, y: 565, size: 180 },
  { Icon: Scan, x: 2665, y: 735, size: 180 }, // abs/torso/xray
  { Icon: CalendarClock, x: 2037, y: 1190, size: 180 },
  { Icon: Cylinder, x: 1428, y: 1190, size: 180 }, // outer cylinder 1
  { Icon: Cylinder, x: 1428, y: 1190, size: 180 }, // outer cylinder 2
  { Icon: Cylinder, x: 1428, y: 1190, size: 70 }, // inner cylinder
  { Icon: PackageOpen, x: 820, y: 1190, size: 180 },
  { Icon: Truck, x: 210, y: 1375, size: 150 },
  { Icon: Plane, x: 200, y: 1290, size: 120 }, // plane directly above truck
  { Icon: Syringe, x: 819, y: 1525, size: 180 }, // icon above node
  { Icon: FileText, x: 1428, y: 1525, size: 180 }, // icon above node
  { Icon: FolderPlus, x: 2037, y: 1525, size: 180 }, // icon above node
];

const JourneyIcons = () => {
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
      {icons.map((item, index) => {
        const { Icon, x, y, size } = item;
        return (
          <g key={index} transform={`translate(${x - size/2}, ${y - size/2})`}>
            <foreignObject width={size} height={size}>
              <div style={{
                width: size,
                height: size,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={size * 0.8} color="var(--color-text)" strokeWidth={1.5} />
              </div>
            </foreignObject>
          </g>
        );
      })}

      {/* Special case: x5 text next to syringe */}
      <text
        x={870}
        y={1560}
        fill="var(--color-text)"
        fontSize="42"
        fontWeight="600"
        fontFamily="Inter, sans-serif"
      >
        x5
      </text>
    </svg>
  );
};

export default JourneyIcons;
