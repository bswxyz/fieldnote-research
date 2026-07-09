import { ITEMS, type Item, type Kind } from './data';

// Subsequence fuzzy match. Returns null if `q` is not a subsequence of `text`,
// otherwise a score (lower = better) plus the matched character indices so the
// UI can highlight them. Rewards contiguous runs and word-boundary hits — the
// same instincts a real command palette uses, just small enough to read.
export interface Match {
  score: number;
  indices: number[];
}

export function fuzzy(text: string, q: string): Match | null {
  if (!q) return { score: 0, indices: [] };
  const t = text.toLowerCase();
  const query = q.toLowerCase();
  const indices: number[] = [];
  let ti = 0;
  let score = 0;
  let prev = -2;
  for (let qi = 0; qi < query.length; qi++) {
    const ch = query[qi];
    let found = -1;
    for (let k = ti; k < t.length; k++) {
      if (t[k] === ch) { found = k; break; }
    }
    if (found === -1) return null;
    // penalise gaps; reward adjacency and start-of-word matches
    const gap = found - prev - 1;
    score += gap;
    const boundary = found === 0 || t[found - 1] === ' ' || t[found - 1] === '-' || t[found - 1] === '/';
    if (boundary) score -= 2;
    if (found === prev + 1) score -= 1;
    indices.push(found);
    prev = found;
    ti = found + 1;
  }
  score += (t.length - query.length) * 0.02; // gentle preference for tighter titles
  return { score, indices };
}

export interface Result {
  item: Item;
  indices: number[]; // highlight positions within item.title
  score: number;
}

const KIND_ORDER: Record<Kind, number> = { action: 0, note: 1, protocol: 2, citation: 3 };

/** Search the corpus. Empty query returns a curated default set (recent + actions). */
export function search(query: string): Result[] {
  const q = query.trim();
  if (!q) {
    // default view: the four actions, then a few recent notes/protocols
    const defaults = ITEMS.filter(
      (i) => i.kind === 'action' || ['n-replay', 'p-patch', 'c-buzsaki', 'n-meta'].includes(i.id),
    );
    return defaults.map((item) => ({ item, indices: [], score: 0 }));
  }
  const out: Result[] = [];
  const ql = q.toLowerCase();
  for (const item of ITEMS) {
    const tl = item.title.toLowerCase();
    // strongest signal: the query appears as a contiguous substring in the title
    const at = tl.indexOf(ql);
    if (at !== -1) {
      const indices = Array.from({ length: ql.length }, (_, k) => at + k);
      const boundary = at === 0 || tl[at - 1] === ' ' || tl[at - 1] === '-' || tl[at - 1] === '/';
      out.push({ item, indices, score: -20 + (boundary ? -6 : 0) + at * 0.05 });
      continue;
    }
    const onTitle = fuzzy(item.title, q);
    if (onTitle) {
      out.push({ item, indices: onTitle.indices, score: onTitle.score });
      continue;
    }
    // fall back to tag surface (no highlight), with a score penalty
    for (const tag of item.tags) {
      const onTag = fuzzy(tag, q);
      if (onTag) {
        out.push({ item, indices: [], score: onTag.score + 6 });
        break;
      }
    }
  }
  out.sort((a, b) => a.score - b.score || KIND_ORDER[a.item.kind] - KIND_ORDER[b.item.kind]);
  // if we have solid matches, drop the very-loose scattered ones so groups stay clean
  const hasGood = out.some((r) => r.score <= 8);
  return hasGood ? out.filter((r) => r.score <= 16) : out;
}

export const GROUP_LABEL: Record<Kind, string> = {
  action: 'Actions',
  note: 'Notes',
  protocol: 'Protocols',
  citation: 'Citations',
};

/**
 * Split results into kind-groups. Groups are ordered by their best (lowest)
 * score, so the section holding the strongest match surfaces first; ties fall
 * back to a stable kind order (which keeps Actions on top for the empty query).
 */
export function groupResults(results: Result[]): { kind: Kind; label: string; results: Result[] }[] {
  const order: Kind[] = ['action', 'note', 'protocol', 'citation'];
  return order
    .map((kind) => {
      const rs = results.filter((r) => r.item.kind === kind);
      const best = rs.length ? Math.min(...rs.map((r) => r.score)) : Infinity;
      return { kind, label: GROUP_LABEL[kind], results: rs, best };
    })
    .filter((g) => g.results.length > 0)
    .sort((a, b) => a.best - b.best || KIND_ORDER[a.kind] - KIND_ORDER[b.kind])
    .map(({ kind, label, results }) => ({ kind, label, results }));
}
