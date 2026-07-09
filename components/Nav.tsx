'use client';

import { usePalette } from './PaletteProvider';
import { useMetaKey } from '@/lib/hooks';

export default function Nav() {
  const { open } = usePalette();
  const meta = useMetaKey();
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a className="brand" href="./" aria-label="Fieldnote home">
          <span className="brand-mark" aria-hidden="true" />
          <span>Fieldnote</span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a className="nav-hide" href="#steps">How it works</a>
          <a className="nav-hide" href="#graph">Graph</a>
          <a className="nav-hide" href="#pricing">Pricing</a>
          <a className="nav-hide" href="./guide/">Guide</a>
          <button className="nav-k" onClick={open} aria-label="Open command palette">
            <span aria-hidden="true">Search</span>
            <kbd className="kbd">{meta}K</kbd>
          </button>
        </nav>
      </div>
    </header>
  );
}
