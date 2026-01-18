import { useRef, useEffect, useState } from 'react';
import { Beaker, Microscope, Truck, Lightbulb, UserCheck, Share2, Globe, ShieldCheck, Hospital } from 'lucide-react';
import './ChallengeDiagram.css';

export function ChallengeDiagram() {
  const circleRef = useRef<SVGCircleElement>(null);
  const deliveryRef = useRef<HTMLDivElement>(null);
  const accessRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationReady, setAnimationReady] = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState<'delivery' | 'access' | null>(null);
  const [textPositions, setTextPositions] = useState({ delivery: 360, access: 440 });

  const handleWrapperMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const threshold = rect.height * 0.52; // Slightly above middle to avoid icons near center

    if (y < threshold) {
      setHoveredGroup('delivery');
    } else {
      setHoveredGroup('access');
    }
  };

  const handleWrapperMouseLeave = () => {
    setHoveredGroup(null);
  };

  // Points evenly distributed around the circle (9 points, 40 degrees apart)
  // Rotated so HCP readiness, Healthcare systems, Geography coverage,
  // and Diverse regulatory systems are in the bottom half
  // Animation order: Infrastructure (190°) animates first, then clockwise
  const points = [
    { icon: Beaker, label: 'Made to order', angle: -130, group: 'delivery', animationOrder: 1 },
    { icon: Microscope, label: 'Precision\ndiagnostics', angle: -90, group: 'delivery', animationOrder: 2 },
    { icon: Truck, label: 'Complex\nlogistics', angle: -50, group: 'delivery', animationOrder: 3 },
    { icon: Lightbulb, label: 'Service\ndifferentiation', angle: -10, group: 'delivery', animationOrder: 4 },
    { icon: UserCheck, label: 'HCP\nreadiness', angle: 30, group: 'access', animationOrder: 5 },
    { icon: Share2, label: 'Healthcare\nsystems', angle: 70, group: 'access', animationOrder: 6 },
    { icon: Globe, label: 'Geography\ncoverage', angle: 110, group: 'access', animationOrder: 7 },
    { icon: ShieldCheck, label: 'Diverse\nregulatory systems', angle: 150, group: 'access', animationOrder: 8 },
    { icon: Hospital, label: 'Infrastructure and\nsite readiness', angle: 190, group: 'delivery', animationOrder: 0 },
  ];

  // Configuration for easy adjustment
  const radius = 200; // Reduced from 216
  const offsetX = 10; // Adjust horizontal position (positive = right, negative = left)
  const offsetY = 0; // Adjust vertical position (positive = down, negative = up)
  const centerX = 400 + offsetX;
  const centerY = 400 + offsetY;

  useEffect(() => {
    const circle = circleRef.current;

    if (!circle) return;

    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;

    // Animate circle on mount
    requestAnimationFrame(() => {
      circle.style.transition = 'stroke-dashoffset 1.5s ease-out';
      circle.style.strokeDashoffset = '0';
    });

    // Trigger icon animations after circle is mostly drawn
    const iconAnimationTimer = setTimeout(() => {
      setAnimationReady(true);
    }, 800);

    // Calculate actual text positions
    const updateTextPositions = () => {
      if (deliveryRef.current && accessRef.current && wrapperRef.current) {
        const wrapperRect = wrapperRef.current.getBoundingClientRect();
        const deliveryRect = deliveryRef.current.getBoundingClientRect();
        const accessRect = accessRef.current.getBoundingClientRect();

        // Calculate center positions relative to the wrapper, then convert to SVG coords (800x800)
        const deliveryY = ((deliveryRect.top + deliveryRect.height / 2 - wrapperRect.top) / wrapperRect.height) * 800;
        const accessY = ((accessRect.top + accessRect.height / 2 - wrapperRect.top) / wrapperRect.height) * 800;

        setTextPositions({
          delivery: deliveryY,
          access: accessY
        });
      }
    };

    updateTextPositions();
    window.addEventListener('resize', updateTextPositions);

    return () => {
      clearTimeout(iconAnimationTimer);
      window.removeEventListener('resize', updateTextPositions);
    };
  }, []);

  return (
    <div className="challenge-diagram-container" ref={containerRef}>
      <div
        className="challenge-diagram-wrapper"
        ref={wrapperRef}
        onMouseMove={handleWrapperMouseMove}
        onMouseLeave={handleWrapperMouseLeave}
      >
        {/* Center text */}
        <div
          className="challenge-center-text"
          style={{
            left: `${(centerX / 800) * 100}%`,
            top: `${(centerY / 800) * 100}%`
          }}
        >
          <div
            ref={deliveryRef}
            className={`challenge-delivery ${hoveredGroup === 'delivery' ? 'highlighted' : ''}`}
          >
            Delivery
          </div>
          <div className="challenge-title">Challenge</div>
          <div
            ref={accessRef}
            className={`challenge-access ${hoveredGroup === 'access' ? 'highlighted' : ''}`}
          >
            Access
          </div>
        </div>

        {/* Dotted circle */}
        <svg
          className="challenge-circle-svg"
          viewBox="0 0 800 800"
          aria-hidden="true"
        >
          <circle
            ref={circleRef}
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="challenge-circle-path"
            transform={`rotate(190 ${centerX} ${centerY})`}
          />
        </svg>

        {/* All challenge points in one container */}
        <div className="challenge-points-container">
          {points.map((point, index) => {
            const angleRad = (point.angle * Math.PI) / 180;
            const x = centerX + radius * Math.cos(angleRad);
            const y = centerY + radius * Math.sin(angleRad);

            const Icon = point.icon;

            // Calculate label position (further out from the circle)
            // Add extra horizontal spread based on position
            const labelRadius = radius + 80;

            const baseX = centerX + labelRadius * Math.cos(angleRad);
            const baseY = centerY + labelRadius * Math.sin(angleRad);

            // Add horizontal spread: push labels further left/right based on their x position
            const horizontalSpread = 1.18; // 18% more horizontal spread
            let labelX = centerX + (baseX - centerX) * horizontalSpread;

            // Add vertical spread: push labels up/down more based on distance from center Y
            const verticalSpread = 1.03; // 3% more vertical spread

            const labelY = centerY + (baseY - centerY) * verticalSpread;

            // Special adjustment for "Infrastructure and site readiness" label (angle 190)
            if (point.angle === 190) {
              labelX -= 10; // Push left by 20 units
            }

            return (
              <div key={index}>
                {/* Icon circle */}
                <div
                  className={`challenge-icon-wrapper ${animationReady ? 'ready' : ''} ${
                    hoveredGroup && point.group === hoveredGroup ? 'highlighted' : ''
                  } ${hoveredGroup && point.group !== hoveredGroup ? 'dimmed' : ''}`}
                  style={{
                    left: `${(x / 800) * 100}%`,
                    top: `${(y / 800) * 100}%`,
                    ['--animation-delay' as any]: `${point.animationOrder * 0.1}s`,
                  }}
                  data-index={index}
                >
                  <div className="challenge-icon-circle">
                    <div className="challenge-icon-circle-overlay"></div>
                    <Icon className="challenge-icon" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Label */}
                <div
                  className={`challenge-label ${animationReady ? 'ready' : ''} ${
                    hoveredGroup && point.group === hoveredGroup ? 'highlighted' : ''
                  } ${hoveredGroup && point.group !== hoveredGroup ? 'dimmed' : ''}`}
                  style={{
                    left: `${(labelX / 800) * 100}%`,
                    top: `${(labelY / 800) * 100}%`,
                  }}
                  data-index={index}
                >
                  {point.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
