import { useEffect, useRef, useState } from 'react';
import './ImpactBento.css';

export interface BentoStat {
  /** Eyebrow label above the headline (lead/side variants). */
  eyebrow?: string;
  /** Numeric target — when set, counts up on scroll-in. */
  number?: number;
  prefix?: string;
  suffix?: string;
  /** Static display value when there's nothing to count (e.g. "£3.2M"). */
  value?: string;
  title: string;
  description?: string;
  variant: 'lead' | 'side' | 'wide';
}

interface Props {
  stats: BentoStat[];
}

/** Counts from a little below the target up to it once `run` flips true. */
function useCountUp(target: number | undefined, run: boolean) {
  const offset = target === undefined ? 0 : Math.max(Math.ceil(target * 0.2), 3);
  const start = target === undefined ? 0 : Math.max(0, target - offset);
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (!run || target === undefined) return;
    const steps = 40;
    const increment = (target - start) / steps;
    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 1000 / steps);
    return () => clearInterval(timer);
  }, [run, target, start]);

  return count;
}

function StatValue({ stat, run }: { stat: BentoStat; run: boolean }) {
  const count = useCountUp(stat.number, run);
  if (stat.number !== undefined) {
    return (
      <>
        {stat.prefix ?? ''}
        {count}
        {stat.suffix ?? ''}
      </>
    );
  }
  return <>{stat.value}</>;
}

export default function ImpactBento({ stats }: Props) {
  const [run, setRun] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setRun(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const lead = stats.find((s) => s.variant === 'lead');
  const sides = stats.filter((s) => s.variant === 'side');
  const wides = stats.filter((s) => s.variant === 'wide');

  return (
    <div className="impact-bento" ref={ref}>
      <div className="impact-bento__top">
        {lead && (
          <div className="impact-card impact-card--lead">
            <div className="impact-card__glow" aria-hidden="true" />
            {lead.eyebrow && <span className="impact-card__eyebrow">{lead.eyebrow}</span>}
            <span className="impact-card__figure impact-card__figure--lead">
              <StatValue stat={lead} run={run} />
            </span>
            <h3 className="impact-card__title">{lead.title}</h3>
            {lead.description && <p className="impact-card__desc">{lead.description}</p>}
          </div>
        )}

        <div className="impact-bento__side">
          {sides.map((stat, i) => (
            <div className="impact-card impact-card--side" key={i}>
              <span className="impact-card__figure">
                <StatValue stat={stat} run={run} />
              </span>
              <span className="impact-card__label">{stat.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="impact-bento__bottom">
        {wides.map((stat, i) => (
          <div className="impact-card impact-card--wide" key={i}>
            <span className="impact-card__label">{stat.title}</span>
            <span className="impact-card__figure impact-card__figure--inline">
              <StatValue stat={stat} run={run} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
