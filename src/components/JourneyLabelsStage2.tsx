interface Label {
  title: string;
  subtitle: string;
  x: number;
  y: number;
  anchor: 'start' | 'middle' | 'end';
}

const labels: Label[] = [
  // Above first three nodes (top row) - more right and higher
  {
    title: 'Learn',
    subtitle: 'Centre training & resources',
    x: 950,
    y: 200,
    anchor: 'start'
  },
  // Above nodes 5 & 6 (middle right area) - higher and left
  {
    title: 'Schedule',
    subtitle: 'Ordering & scheduling',
    x: 1500,
    y: 750,
    anchor: 'start'
  },
  // Below nodes 6 & 7 (middle left area) - lower
  {
    title: 'Supply',
    subtitle: 'Manufacturing & logistics',
    x: 750,
    y: 1325,
    anchor: 'start'
  },
  // Below last two nodes (bottom) - lower
  {
    title: 'Assist',
    subtitle: 'Customer support & services',
    x: 1300,
    y: 1850,
    anchor: 'start'
  },
];

const JourneyLabelsStage2 = () => {
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

export default JourneyLabelsStage2;
