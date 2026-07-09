'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** True when the visitor prefers reduced motion. SSR-safe (false on the server). */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return reduced;
}

/** IntersectionObserver → [ref, inView]. Fires once by default. */
export function useInView<T extends Element>(
  options: IntersectionObserverInit = { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
  once = true,
): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        if (once) io.disconnect();
      } else if (!once) {
        setInView(false);
      }
    }, options);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [once]);
  return [ref, inView];
}

/** Fieldnote's signature settle easing as a JS function (mirrors --ease in CSS). */
export const settle = (t: number) => 1 - Math.pow(1 - t, 3.6);

/**
 * Count toward `target` once `run` is true. Renders the final value on the
 * server (SEO / no-JS), then animates 0 → value on the client. Reduced motion
 * snaps instantly.
 */
export function useCountUp(target: number, run: boolean, duration = 1500): number {
  const [value, setValue] = useState(target);
  const reduced = useReducedMotion();
  const started = useRef(false);
  useEffect(() => {
    if (!run || started.current) return;
    started.current = true;
    if (reduced) {
      setValue(target);
      return;
    }
    setValue(0);
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = settle(Math.min(1, (now - t0) / duration));
      setValue(target * k);
      if (k < 1) raf = requestAnimationFrame(step);
      else setValue(target);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, target, duration, reduced]);
  return value;
}

/** True after hydration — for affordances that only exist client-side. */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/** Detect the platform modifier key for accurate ⌘/Ctrl hints. */
export function useMetaKey(): '⌘' | 'Ctrl' {
  const [key, setKey] = useState<'⌘' | 'Ctrl'>('⌘');
  useEffect(() => {
    const isMac = /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent);
    setKey(isMac ? '⌘' : 'Ctrl');
  }, []);
  return key;
}

/** Trap Tab focus within `ref` while `active`. Returns nothing; wire onKeyDown yourself for Esc. */
export function useFocusTrap(ref: React.RefObject<HTMLElement>, active: boolean) {
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!active || e.key !== 'Tab' || !ref.current) return;
      const focusable = ref.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [active, ref],
  );
  useEffect(() => {
    if (!active) return;
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [active, onKeyDown]);
}
