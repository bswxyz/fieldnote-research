'use client';

import Reveal from './Reveal';
import { usePalette } from './PaletteProvider';
import { useMetaKey } from '@/lib/hooks';

export default function CTA() {
  const { open } = usePalette();
  const meta = useMetaKey();
  return (
    <section className="cta">
      <div className="wrap">
        <Reveal as="p" className="eyebrow eyebrow--green">Start the notebook</Reveal>
        <Reveal as="h2">
          <>Stop losing the <em>why</em> behind the what.</>
        </Reveal>
        <Reveal as="p" className="lede">
          Every note you take in Fieldnote arrives cited, linked, and searchable. Open the palette and
          feel it — no signup for the demo.
        </Reveal>
        <Reveal as="div" className="cta-actions">
          <>
            <button className="btn btn-primary" onClick={open}>
              Search the lab <kbd className="kbd" aria-hidden="true">{meta}K</kbd>
            </button>
            <a className="btn btn-ghost" href="./guide/">How this was built →</a>
          </>
        </Reveal>
      </div>
    </section>
  );
}
