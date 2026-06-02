import React from 'react';
import { Highlighter } from '@/registry/magicui/highlighter';

const ClosingStatement: React.FC = () => {
  return (
    <p
      style={{
        fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
        fontWeight: 'var(--font-weight-bold)',
        lineHeight: 1.25,
        letterSpacing: '-0.02em',
        color: 'var(--color-text)',
        margin: 0,
        transition: 'color 0.3s ease',
      }}
    >
      I believe in{' '}
      <Highlighter
        action="underline"
        color="var(--color-primary)"
        strokeWidth={2}
        padding={0}
        animationDuration={600}
        delay={400}
      >
        Design Doing
      </Highlighter>
      {' '}over{' '}
      <Highlighter
        action="underline"
        color="var(--color-primary)"
        strokeWidth={2}
        padding={0}
        animationDuration={600}
        delay={800}
      >
        Design Thinking
      </Highlighter>
      {' '}— not because ideas don't matter, but an insight that never becomes
      action is just wasted potential. So if you've got a gnarly problem or a
      half-baked idea, let's make something happen.
    </p>
  );
};

export default ClosingStatement;
