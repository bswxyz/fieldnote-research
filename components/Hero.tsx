'use client';

import { useEffect, useState } from 'react';
import PaletteBody from './PaletteBody';
import { usePalette } from './PaletteProvider';
import { useMetaKey } from '@/lib/hooks';

export default function Hero() {
  const { open } = usePalette();
  const meta = useMetaKey();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <section className={`hero ${ready ? 'ready' : ''}`}>
      <div className="wrap hero-inner">
        <p className="eyebrow reveal in">Research notebook · citations as objects</p>

        <h1 className="hero-title" aria-label="Every claim has a receipt.">
          <span className="line" style={{ ['--d' as any]: '80ms' }} aria-hidden="true"><span>Every claim</span></span>
          <span className="line" style={{ ['--d' as any]: '200ms' }} aria-hidden="true"><span>has a <em>receipt.</em></span></span>
        </h1>

        <p className="hero-sub reveal in">
          Fieldnote is a research notebook where every citation is a first-class object — a real DOI you
          can point at, deduplicated across the whole lab. Protocols version like code. Your knowledge
          graph is one keystroke away.
        </p>

        <div className="hero-actions reveal in">
          <button className="btn btn-primary" onClick={open}>
            Open the palette <kbd className="kbd" aria-hidden="true">{meta}K</kbd>
          </button>
          <a className="btn btn-ghost" href="#steps">See how it works →</a>
        </div>

        <div className="hero-demo">
          <PaletteBody idPrefix="hero" />
          <p className="demo-caption">
            <b>Live demo.</b> Type to fuzzy-search fictional notes · arrow keys to move · Enter to open.
          </p>
        </div>
      </div>
    </section>
  );
}
