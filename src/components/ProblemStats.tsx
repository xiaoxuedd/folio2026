import { useEffect, useRef, useState } from 'react';
import './ProblemStats.css';

export interface ProblemStat {
  /** Numeric target that counts up on scroll-in. */
  figure: number;
  prefix?: string;
  suffix?: string;
  /** Supporting line under the figure. */
  label: string;
  /** Source citation, revealed on hover/focus. */
  source: string;
}

interface Props {
  stats: ProblemStat[];
}

function useCountUp(target: number, run: boolean) {
  const offset = Math.max(Math.ceil(target * 0.25), 2);
  const start = Math.max(0, target - offset);
  const [count, setCount] = useState(start);
  useEffect(() => {
    if (!run) return;
    const steps = 32;
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
    }, 900 / steps);
    return () => clearInterval(timer);
  }, [run, target, start]);
  return count;
}

function StatRow({ stat, run }: { stat: ProblemStat; run: boolean }) {
  const count = useCountUp(stat.figure, run);
  return (
    <li className="problem-stat" tabIndex={0}>
      <span className="problem-stat__figure">
        {stat.prefix ?? ''}
        {count}
        {stat.suffix ?? ''}
      </span>
      <span className="problem-stat__label">{stat.label}</span>
      <span className="problem-stat__source">{stat.source}</span>
    </li>
  );
}

export default function ProblemStats({ stats }: Props) {
  const [run, setRun] = useState(false);
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setRun(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <ul className="problem-stats" ref={ref}>
      {stats.map((stat, i) => (
        <StatRow stat={stat} run={run} key={i} />
      ))}
    </ul>
  );
}
