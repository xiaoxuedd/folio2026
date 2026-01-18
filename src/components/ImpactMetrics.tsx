import { useEffect, useRef, useState } from 'react';
import { TrendingUp, Target } from 'lucide-react';
import GlassIcon from './GlassIcon';
import './ImpactMetrics.css';

interface Metric {
  value?: string;
  number?: number;
  suffix?: string;
  prefix?: string;
  description: string;
}

interface ImpactMetricsProps {
  title: string;
  metrics: Metric[];
}

const CountingNumber = ({
  target,
  suffix = '',
  prefix = '',
  shouldAnimate
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  shouldAnimate: boolean;
}) => {
  // Start from 15% below or 4 below, whichever is larger
  const offset = Math.max(Math.ceil(target * 0.15), 4);
  const startValue = Math.max(0, target - offset);
  const [count, setCount] = useState(startValue);

  useEffect(() => {
    if (!shouldAnimate) return;

    const duration = 1000;
    const steps = 40;
    const range = target - startValue;
    const increment = range / steps;
    const stepDuration = duration / steps;

    let current = startValue;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [shouldAnimate, target, startValue]);

  return (
    <span className="counting-number">
      {prefix}{count}{suffix}
    </span>
  );
};

export const ImpactMetrics = ({ title, metrics }: ImpactMetricsProps) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Different gradients for Delivery vs Value
  const isDelivery = title === 'Delivery';
  const deliveryGradient = 'linear-gradient(135deg, #ffc0e3 0%, #a0c4ff 50%, #c9b3e8 100%)';
  const valueGradient = 'linear-gradient(135deg, #a0c4ff 0%, #7c5cff 30%, #b794f6 60%, #ffd97d 100%)';

  return (
    <div ref={containerRef} className="impact-metrics-block">
      <GlassIcon
        icon={isDelivery ? <TrendingUp strokeWidth={1.5} /> : <Target strokeWidth={1.5} />}
        gradient={isDelivery ? deliveryGradient : valueGradient}
        size={80}
        iconSize={35}
      />
      <h4 className="impact-block-title">{title}</h4>
      <ul className="impact-list">
        {metrics.map((metric, index) => (
          <li key={index} className="impact-list-item">
            <span className="impact-number">
              {metric.number !== undefined ? (
                <CountingNumber
                  target={metric.number}
                  suffix={metric.suffix || ''}
                  prefix={metric.prefix || ''}
                  shouldAnimate={shouldAnimate}
                />
              ) : (
                <span className="counting-number">{metric.value}</span>
              )}
            </span>
            <span className="impact-text">{metric.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
