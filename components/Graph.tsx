'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Reveal from './Reveal';
import { GRAPH_NODES, GRAPH_EDGES } from '@/lib/data';
import { useInView, useReducedMotion } from '@/lib/hooks';

const COLOR: Record<string, string> = { note: 'var(--violet)', citation: 'var(--green)', protocol: '#e0b95a' };

export default function Graph() {
  const [wrapRef, inView] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const reduced = useReducedMotion();
  const [lit, setLit] = useState(0);
  const [hover, setHover] = useState<string | null>(null);
  const timer = useRef<number>();

  const nodeMap = useMemo(() => {
    const m: Record<string, (typeof GRAPH_NODES)[number]> = {};
    GRAPH_NODES.forEach((n) => (m[n.id] = n));
    return m;
  }, []);

  // neighbours of the hovered/focused node
  const neighbours = useMemo(() => {
    if (!hover) return new Set<string>();
    const s = new Set<string>([hover]);
    GRAPH_EDGES.forEach((e) => {
      if (e.a === hover) s.add(e.b);
      if (e.b === hover) s.add(e.a);
    });
    return s;
  }, [hover]);

  useEffect(() => {
    if (!inView) return;
    if (reduced) { setLit(GRAPH_NODES.length); return; }
    setLit(0);
    let i = 0;
    timer.current = window.setInterval(() => {
      i += 1;
      setLit(i);
      if (i >= GRAPH_NODES.length) window.clearInterval(timer.current);
    }, 180);
    return () => window.clearInterval(timer.current);
  }, [inView, reduced]);

  const isLit = (idx: number) => idx < lit;
  const litIds = new Set(GRAPH_NODES.filter((_, i) => isLit(i)).map((n) => n.id));

  const edgeLit = (a: string, b: string) => {
    if (hover) return neighbours.has(a) && neighbours.has(b);
    return litIds.has(a) && litIds.has(b);
  };

  return (
    <section className="section" id="graph">
      <div className="wrap">
        <div className="section-head">
          <Reveal as="p" className="eyebrow eyebrow--green">The knowledge graph</Reveal>
          <Reveal as="h2">One lab. One graph. One keystroke.</Reveal>
          <Reveal as="p" className="lede">
            Backlinks and shared citations connect every note. Hover a node to light its neighbourhood —
            the same edges Fieldnote traverses when you search. Nothing here is entered twice.
          </Reveal>
        </div>

        <Reveal>
          <div className="graph-shell" ref={wrapRef}>
            <div className="graph-topbar">
              <span>graph · {GRAPH_NODES.length} nodes · {GRAPH_EDGES.length} edges</span>
              <span className="graph-legend" aria-hidden="true">
                <span><i className="dot note" /> note</span>
                <span><i className="dot citation" /> citation</span>
                <span><i className="dot protocol" /> protocol</span>
              </span>
            </div>
            <svg
              className="graph-svg"
              viewBox="0 0 760 430"
              role="img"
              aria-label="A knowledge graph of ten interconnected research nodes — notes, citations, and protocols — linked by shared references and backlinks."
            >
              <g>
                {GRAPH_EDGES.map((e, i) => {
                  const a = nodeMap[e.a];
                  const b = nodeMap[e.b];
                  return (
                    <line
                      key={i}
                      className={`graph-edge ${edgeLit(e.a, e.b) ? 'lit' : ''}`}
                      x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    />
                  );
                })}
              </g>
              <g>
                {GRAPH_NODES.map((n, i) => {
                  const on = isLit(i) || (hover != null && neighbours.has(n.id));
                  const dim = hover != null && !neighbours.has(n.id);
                  const color = COLOR[n.kind];
                  return (
                    <g
                      key={n.id}
                      className={`graph-node ${on ? 'on' : ''} ${hover === n.id ? 'hover' : ''}`}
                      tabIndex={0}
                      role="button"
                      aria-label={`${n.label} (${n.kind})`}
                      onMouseEnter={() => setHover(n.id)}
                      onMouseLeave={() => setHover(null)}
                      onFocus={() => setHover(n.id)}
                      onBlur={() => setHover(null)}
                      style={{ outline: 'none' }}
                    >
                      {on && !reduced && (
                        <circle className="graph-pulse" cx={n.x} cy={n.y} r={n.r} fill="none" stroke={color} strokeWidth="1.2" opacity="0.5">
                          <animate attributeName="r" from={n.r} to={n.r + 12} dur="2.4s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
                          <animate attributeName="opacity" from="0.5" to="0" dur="2.4s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
                        </circle>
                      )}
                      <circle
                        className="graph-node-dot"
                        cx={n.x} cy={n.y} r={n.r}
                        fill={on ? color : 'var(--panel-2)'}
                        stroke={on ? color : 'var(--line)'}
                        strokeWidth={on ? 0 : 1}
                        opacity={dim ? 0.28 : 1}
                        style={{ filter: on ? `drop-shadow(0 0 8px ${color})` : 'none', transition: 'opacity .3s var(--ease)' }}
                      />
                      <circle className="graph-node-hit" cx={n.x} cy={n.y} r={n.r + 14} fill="transparent" />
                      <text className="graph-node-label" x={n.x} y={n.y + n.r + 14} textAnchor="middle" opacity={dim ? 0.4 : 1}>
                        {n.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
