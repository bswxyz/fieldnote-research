'use client';

import Reveal from './Reveal';
import { TIERS } from '@/lib/data';
import { usePalette } from './PaletteProvider';

export default function Pricing() {
  const { open } = usePalette();
  return (
    <section className="section" id="pricing">
      <div className="wrap">
        <div className="section-head">
          <Reveal as="p" className="eyebrow">Pricing</Reveal>
          <Reveal as="h2">Priced for a notebook, then a lab.</Reveal>
          <Reveal as="div">
            <div className="price-callout">
              <b>Academic?</b>
              <span>Verified students, postdocs, and non-profit labs get <b>Lab</b> free. The graph should never be a paywall between you and your own work.</span>
            </div>
          </Reveal>
        </div>

        <div className="price-grid">
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 80}>
              <article className={`tier ${t.featured ? 'featured' : ''}`}>
                {t.featured && <span className="tier-badge">Most labs</span>}
                <h3 className="tier-name">{t.name}</h3>
                <p className="tier-blurb">{t.blurb}</p>
                <div className="tier-price">
                  <span className="price">{t.price}</span>
                  <span className="unit">{t.unit}</span>
                </div>
                <button className="btn tier-cta" onClick={open}>{t.cta}</button>
                <ul className="tier-features">
                  {t.features.map((f) => <li key={f}>{f}</li>)}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
