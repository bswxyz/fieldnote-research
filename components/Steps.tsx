'use client';

import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';
import CitationChip from './CitationChip';
import { STEPS, NOTE, BACKLINKS } from '@/lib/data';

function EditorMock() {
  return (
    <div className="editor-mock" aria-hidden="true">
      <div className="mock-bar">
        <span className="mock-dot" /><span className="mock-dot" /><span className="mock-dot" />
        <span className="mock-path">lab/hippocampus/replay.note · unsaved</span>
      </div>
      <div className="editor-body">
        <div className="editor-line"><span className="ln">1</span><span className="tx"><b># Replay during slow-wave sleep</b></span></div>
        <div className="editor-line"><span className="ln">2</span><span className="tx" /></div>
        <div className="editor-line"><span className="ln">3</span><span className="tx">Place-cell sequences are <span className="claim">reactivated in compressed order</span>.</span></div>
        <div className="editor-line"><span className="ln">4</span><span className="tx"><span className="slash">/cite</span> ⌁ paste a DOI…</span></div>
        <div className="editor-line"><span className="ln">5</span><span className="tx">Density scales with the prior day’s <span className="claim">learning load</span>.</span></div>
      </div>
    </div>
  );
}

function NoteMock() {
  return (
    <div className="note-wrap">
      <div className="note-doc">
        <div className="note-head">
          <span className="note-title">{NOTE.title}</span>
          <span className="note-vtag">{NOTE.updated}</span>
        </div>
        <span className="note-path">{NOTE.path}</span>
        <p className="note-body">
          {NOTE.body.map((seg, i) =>
            'cite' in seg
              ? <CitationChip key={i} text={seg.t} sourceId={(seg as any).cite} />
              : <span key={i}>{seg.t}</span>,
          )}
        </p>
      </div>
      <div className="note-rail" aria-label="Backlinks">
        <div className="note-rail-h"><span>Backlinks</span><span className="cnt">{BACKLINKS.length}</span></div>
        {BACKLINKS.map((b) => (
          <a className="backlink" href="#steps" key={b.id} onClick={(e) => e.preventDefault()}>
            <span className="backlink-t">{b.title}</span>
            <span className="backlink-m">{b.meta}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function Steps() {
  const [active, setActive] = useState(0);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            setActive(idx);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    panelRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const jump = (i: number) => {
    panelRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="section" id="steps">
      <div className="wrap">
        <div className="section-head">
          <Reveal as="p" className="eyebrow">The workflow</Reveal>
          <Reveal as="h2">Capture, cite, connect.</Reveal>
          <Reveal as="p" className="lede">
            Three moves take a raw observation to a linked, cited, searchable claim. Each one is a real
            surface in Fieldnote — scroll, and the rail follows.
          </Reveal>
        </div>

        <div className="steps-grid">
          <div className="step-rail" role="tablist" aria-label="Workflow steps">
            {STEPS.map((s, i) => (
              <button
                key={s.key}
                className={`step-tab ${i === active ? 'active' : ''}`}
                role="tab"
                aria-selected={i === active}
                onClick={() => jump(i)}
              >
                <span className="step-n">STEP {s.n}</span>
                <span className="step-t">{s.title}</span>
                <span className="step-d">{s.lede}</span>
              </button>
            ))}
          </div>

          <div className="step-panels">
            {STEPS.map((s, i) => (
              <div
                key={s.key}
                className="step-panel"
                data-idx={i}
                ref={(el) => { panelRefs.current[i] = el; }}
              >
                <Reveal>
                  <div className="step-panel-head">
                    <span className="big-n">{s.n}</span>
                    <h3>{s.title}</h3>
                  </div>
                  <p className="step-lede">{s.lede}</p>
                  <ul className="step-points">
                    {s.points.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                  {s.key === 'capture' && <EditorMock />}
                  {s.key === 'cite' && <NoteMock />}
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
