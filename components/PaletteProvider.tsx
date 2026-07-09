'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import PaletteBody from './PaletteBody';
import { useFocusTrap } from '@/lib/hooks';

interface Ctx { open: () => void; close: () => void; isOpen: boolean; }
const PaletteCtx = createContext<Ctx>({ open() {}, close() {}, isOpen: false });

export const usePalette = () => useContext(PaletteCtx);

export default function PaletteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement;
    setOpen(true);
  }, []);
  const close = useCallback(() => {
    setOpen(false);
    // restore focus to the trigger
    requestAnimationFrame(() => returnFocus.current?.focus?.());
  }, []);

  // global ⌘K / Ctrl-K toggle + "/" to open when not typing
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && k === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
        if (!isOpen) returnFocus.current = document.activeElement as HTMLElement;
      } else if (e.key === '/' && !isOpen) {
        const el = document.activeElement as HTMLElement;
        const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
        if (!typing) { e.preventDefault(); open(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, open]);

  // lock scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  useFocusTrap(dialogRef, isOpen);

  return (
    <PaletteCtx.Provider value={{ open, close, isOpen }}>
      {children}
      {isOpen && (
        <div
          className="overlay"
          onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette — search the lab"
            onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } }}
          >
            <PaletteBody idPrefix="ovl" autoFocus onSelect={() => close()} onEscape={close} />
          </div>
        </div>
      )}
    </PaletteCtx.Provider>
  );
}
