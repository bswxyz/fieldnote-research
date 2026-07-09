'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { SOURCES } from '@/lib/data';

/**
 * A citation rendered as an object. Hovering or focusing the chip pops a source
 * card with DOI-style metadata; clicking/tapping pins it open (touch-friendly),
 * and Escape closes it. Keyboard-reachable as a button.
 */
export default function CitationChip({ text, sourceId }: { text: string; sourceId: string }) {
  const src = SOURCES[sourceId];
  const [pinned, setPinned] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const cardId = useId();

  useEffect(() => {
    if (!pinned) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setPinned(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPinned(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [pinned]);

  if (!src) return <span>{text}</span>;

  return (
    <span
      ref={ref}
      className="cite-chip"
      role="button"
      tabIndex={0}
      aria-describedby={cardId}
      aria-expanded={pinned}
      onClick={() => setPinned((v) => !v)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPinned((v) => !v); } }}
    >
      {text}
      <sup aria-hidden="true">[{src.ref}]</sup>
      <span className={`cite-card ${pinned ? 'open' : ''}`} id={cardId} role="tooltip">
        <span className="cite-card-top">
          <span>Source · peer-reviewed</span>
          <span className="badge">✓ resolved</span>
        </span>
        <span className="cite-card-title">{src.title}</span>
        <span className="cite-card-row"><span>authors</span><span>{src.authors}</span></span>
        <span className="cite-card-row"><span>venue</span><span>{src.venue} · {src.year}</span></span>
        <span className="cite-card-row"><span>doi</span><span className="cite-card-doi">{src.doi}</span></span>
        <span className="cite-card-row"><span>cited by</span><span>{src.cited.toLocaleString()}</span></span>
      </span>
    </span>
  );
}
