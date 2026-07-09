'use client';

import React from 'react';
import { useInView } from '@/lib/hooks';

/**
 * Scroll-in reveal. Children are server-rendered (present in the HTML); the
 * hidden start state is applied only under `html.js`, and reduced motion
 * disables the transform entirely, so nothing is ever permanently hidden.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  delay?: number;
  className?: string;
}) {
  const [ref, inView] = useInView<HTMLElement>();
  const El = Tag as any;
  return (
    <El
      ref={ref}
      className={`reveal ${inView ? 'in' : ''} ${className}`.trim()}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </El>
  );
}
