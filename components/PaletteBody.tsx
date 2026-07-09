'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { search, groupResults, type Result } from '@/lib/search';
import type { Kind } from '@/lib/data';

const KIND_GLYPH: Record<Kind, string> = { action: '⌥', note: '¶', protocol: '{}', citation: '”' };

function Highlight({ text, indices }: { text: string; indices: number[] }) {
  if (indices.length === 0) return <>{text}</>;
  const set = new Set(indices);
  const out: React.ReactNode[] = [];
  let run = '';
  let markRun = '';
  const flush = () => { if (run) { out.push(run); run = ''; } };
  const flushMark = () => { if (markRun) { out.push(<mark key={out.length}>{markRun}</mark>); markRun = ''; } };
  for (let i = 0; i < text.length; i++) {
    if (set.has(i)) { flush(); markRun += text[i]; }
    else { flushMark(); run += text[i]; }
  }
  flush(); flushMark();
  return <>{out}</>;
}

export default function PaletteBody({
  idPrefix,
  autoFocus = false,
  onSelect,
  onEscape,
}: {
  idPrefix: string;
  autoFocus?: boolean;
  onSelect?: (r: Result) => void;
  onEscape?: () => void;
}) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [echo, setEcho] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => search(query), [query]);
  const groups = useMemo(() => groupResults(results), [results]);

  // clamp active index whenever the result set changes
  useEffect(() => { setActive(0); }, [query]);
  useEffect(() => {
    if (active > results.length - 1) setActive(Math.max(0, results.length - 1));
  }, [results.length, active]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // keep the active row scrolled into view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`#${idPrefix}-opt-${active}`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [active, idPrefix]);

  const commit = (r?: Result) => {
    const chosen = r ?? results[active];
    if (!chosen) return;
    onSelect?.(chosen);
    setEcho(`→ opened ${chosen.item.title}`);
    window.clearTimeout((commit as any)._t);
    (commit as any)._t = window.setTimeout(() => setEcho(''), 2200);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(results.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(0, i - 1)); }
    else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
    else if (e.key === 'End') { e.preventDefault(); setActive(results.length - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); commit(); }
    else if (e.key === 'Escape') {
      if (query) { setQuery(''); }
      else onEscape?.();
    }
  };

  const activeId = results[active] ? `${idPrefix}-opt-${active}` : undefined;
  let flat = -1; // running flat index across groups

  return (
    <div className="palette">
      <div className="palette-input-row">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M20 20l-3.2-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          className="palette-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search notes, protocols, citations…"
          role="combobox"
          aria-expanded="true"
          aria-controls={`${idPrefix}-listbox`}
          aria-activedescendant={activeId}
          aria-label="Search the lab"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <span className="palette-esc" aria-hidden="true">esc</span>
      </div>

      <div className="palette-list" ref={listRef} id={`${idPrefix}-listbox`} role="listbox" aria-label="Results">
        {results.length === 0 && (
          <div className="palette-empty">
            No matches for <code>{query}</code>. Try “ripple”, “patch”, or “DOI”.
          </div>
        )}
        {groups.map((group) => (
          <div className="palette-group" key={group.kind} role="group" aria-label={group.label}>
            <div className="palette-group-label">{group.label}</div>
            {group.results.map((r) => {
              flat += 1;
              const idx = flat;
              return (
                <div
                  key={r.item.id}
                  id={`${idPrefix}-opt-${idx}`}
                  className="palette-row"
                  role="option"
                  aria-selected={idx === active}
                  onMouseMove={() => setActive(idx)}
                  onClick={() => commit(r)}
                >
                  <span className="palette-glyph" aria-hidden="true">{KIND_GLYPH[r.item.kind]}</span>
                  <span className="palette-body">
                    <span className="palette-title"><Highlight text={r.item.title} indices={r.indices} /></span>
                  </span>
                  <span className="palette-meta">{r.item.meta}</span>
                  {r.item.hint && <span className="palette-hint" aria-hidden="true">{r.item.hint}</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="palette-foot">
        <span className="legend" aria-hidden="true">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> {onEscape ? 'close' : 'clear'}</span>
        </span>
        <span className="palette-count" aria-live="polite">
          {echo ? <span className="palette-echo">{echo}</span> : <><b>{results.length}</b> result{results.length === 1 ? '' : 's'}</>}
        </span>
      </div>
    </div>
  );
}
