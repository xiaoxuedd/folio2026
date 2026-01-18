interface Label {
  text: string;
  x: number;
  y: number;
  anchor: 'start' | 'middle' | 'end';
  maxWidth?: number;
}

const labels: Label[] = [
  // Top row - text above nodes (icons below)
  { text: 'Awareness &\nConsideration', x: 820, y: 350, anchor: 'middle' },
  { text: 'Treatment Site\nOnboarding', x: 1428, y: 350, anchor: 'middle' },
  { text: 'Imaging referral and\nTreatment referral', x: 2037, y: 350, anchor: 'middle' },

  // Right side - text left of node (icon right)
  { text: 'Evaluation &\nPrescription', x: 2460, y: 785, anchor: 'end' },

  // Middle row - text above nodes (icons below)
  { text: 'Scheduling &\nTherapy Ordering', x: 2037, y: 965, anchor: 'middle' },
  { text: 'Manufacturing', x: 1428, y: 975, anchor: 'middle' },
  { text: 'Product Release', x: 820, y: 975, anchor: 'middle' },

  // Left side - text right of node (icon left)
  { text: 'Final Product\nShipment', x: 410, y: 1410, anchor: 'start' },

  // Bottom row - text below nodes (icons above)
  { text: 'Preparation and\ninfusion', x: 819, y: 1770, anchor: 'middle' },
  { text: 'Billing &\nReimbursement', x: 1428, y: 1770, anchor: 'middle' },
  { text: 'Treatment\nFollow-up', x: 2037, y: 1770, anchor: 'middle' },
];

const JourneyLabels = () => {
  const lineSpacing = 80; // Scaled up from 68

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
      {labels.map((label, index) => {
        const lines = label.text.split('\n');
        const numLines = lines.length;
        // Only bottom-align if y < 1700 (labels above nodes)
        // Bottom row labels (y=1750) should be top-aligned
        const shouldBottomAlign = label.y < 1700;
        const adjustedY = shouldBottomAlign ? label.y - ((numLines - 1) * lineSpacing) : label.y;

        return (
          <text
            key={index}
            x={label.x}
            y={adjustedY}
            fill="var(--color-text)"
            fontSize="64"
            fontWeight="500"
            fontFamily="Inter, sans-serif"
            textAnchor={label.anchor}
          >
            {lines.map((line, lineIndex) => (
              <tspan
                key={lineIndex}
                x={label.x}
                dy={lineIndex === 0 ? 0 : lineSpacing}
              >
                {line}
              </tspan>
            ))}
          </text>
        );
      })}
    </svg>
  );
};

export default JourneyLabels;
