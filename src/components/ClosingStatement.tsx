import React from 'react';
import { Highlighter } from '@/registry/magicui/highlighter';

const ClosingStatement: React.FC = () => {
  return (
    <div
      className="closing-statement"
      style={{
        marginTop: 'var(--spacing-lg)',
        padding: '0 var(--spacing-md)',
        maxWidth: '900px',
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center'
      }}
    >
      <p
        className="closing-text"
        style={{
          fontSize: 'var(--font-size-body-0)',
          lineHeight: 'var(--line-height-body)',
          color: 'var(--color-text-light)',
          margin: 0,
          transition: 'color 0.3s ease'
        }}
      >
        I believe in{" "}
        <Highlighter
          action="underline"
          color="var(--color-primary)"
          strokeWidth={2}
          padding={0}
          animationDuration={600}
          delay={800}
        >
          Design Doing
        </Highlighter>
        {" "}over{" "}
        <Highlighter
          action="underline"
          color="var(--color-primary)"
          strokeWidth={2}
          padding={0}
          animationDuration={600}
          delay={1200}
        >
          Design Thinking
        </Highlighter>
        , turning insight into action and strategy into reality. Whether you're tackling a gnarly problem or exploring new possibilities, <br />I'd love to hear from you.
      </p>
    </div>
  );
};

export default ClosingStatement;
