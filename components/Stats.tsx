'use client';

import Reveal from './Reveal';
import { STATS } from '@/lib/data';
import { useCountUp, useInView } from '@/lib/hooks';

function StatCell({ stat, run }: { stat: (typeof STATS)[number]; run: boolean }) {
  const compact = (stat as any).compact === true;
  const target = compact ? stat.to / 1000 : stat.to;
  const suffix = compact ? 'K' : stat.suffix;
  const value = useCountUp(target, run);
  const dec = stat.dec;
  const display = value.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  return (
    <div className="stat">
      <div className="stat-num">
        <span>{display}</span>
        {suffix && <span className="suf">{suffix}</span>}
      </div>
      <div className="stat-label">{stat.label}</div>
    </div>
  );
}

export default function Stats() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.4 });
  return (
    <section className="section" aria-label="Fieldnote by the numbers">
      <div className="wrap">
        <div className="section-head">
          <Reveal as="p" className="eyebrow">By the numbers</Reveal>
          <Reveal as="h2">Built to be trusted with the record.</Reveal>
        </div>
        <Reveal>
          <div className="stats-grid" ref={ref}>
            {STATS.map((s) => <StatCell key={s.label} stat={s} run={inView} />)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
