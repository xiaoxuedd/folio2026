interface Label {
  title: string;
  subtitle: string;
  x: number;
  y: number;
  anchor: 'start' | 'middle' | 'end';
}

const labels: Label[] = [
  // Top left corner
  {
    title: 'Learn',
    subtitle: 'Centre training & resources',
    x: 700,
    y: 250,
    anchor: 'start'
  },
  // Top right corner
  {
    title: 'Schedule',
    subtitle: 'Ordering & scheduling',
    x: 2200,
    y: 250,
    anchor: 'end'
  },
  // Bottom right corner
  {
    title: 'Assist',
    subtitle: 'Customer support & services',
    x: 2200,
    y: 1800,
    anchor: 'end'
  },
  // Bottom left corner
  {
    title: 'Apply',
    subtitle: 'Treatment application',
    x: 700,
    y: 1800,
    anchor: 'start'
  },
];

const JourneyLabelsStage3 = () => {
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
      {labels.map((label, index) => (
        <g key={index}>
          {/* Title */}
          <text
            x={label.x}
            y={label.y}
            fill="#6443FE"
            fontSize="70"
            fontWeight="600"
            fontFamily="Inter, sans-serif"
            textAnchor={label.anchor}
          >
            {label.title}
          </text>
          {/* Subtitle */}
          <text
            x={label.x}
            y={label.y + 80}
            fill="#072932"
            fontSize="52"
            fontWeight="400"
            fontFamily="Inter, sans-serif"
            textAnchor={label.anchor}
          >
            {label.subtitle}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default JourneyLabelsStage3;
