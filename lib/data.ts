// Fictional lab data. Nothing here is a real search index, DOI resolver, or database —
// it is a hand-authored fixture that makes the demo feel like a working research tool.
// See README "Demo vs. real" for the honest map.

export type Kind = 'note' | 'protocol' | 'citation' | 'action';

export interface Item {
  id: string;
  kind: Kind;
  title: string;
  meta: string; // right-aligned mono metadata in the palette row
  tags: string[]; // extra fuzzy-search surface, never shown
  hint?: string; // key hint glyph for actions
}

// ── Palette corpus: notes, protocols, citations, actions ──────────────────────
export const ITEMS: Item[] = [
  // actions (pinned intent)
  { id: 'a-new-note', kind: 'action', title: 'New note', meta: 'create', tags: ['add', 'compose', 'write'], hint: 'N' },
  { id: 'a-new-proto', kind: 'action', title: 'New protocol', meta: 'create', tags: ['method', 'sop'], hint: 'P' },
  { id: 'a-cite', kind: 'action', title: 'Cite from DOI…', meta: 'resolve', tags: ['reference', 'crossref', 'source'], hint: 'C' },
  { id: 'a-graph', kind: 'action', title: 'Open knowledge graph', meta: 'view', tags: ['map', 'links', 'network'], hint: 'G' },

  // notes
  { id: 'n-replay', kind: 'note', title: 'Hippocampal replay during slow-wave sleep', meta: 'note · 14 claims', tags: ['sleep', 'memory', 'ripple', 'ca1'] },
  { id: 'n-astro', kind: 'note', title: 'Astrocyte calcium waves — pilot n=6', meta: 'note · 8 claims', tags: ['glia', 'imaging', 'calcium'] },
  { id: 'n-drift', kind: 'note', title: 'Membrane-potential drift in aged neurons', meta: 'note · 11 claims', tags: ['ageing', 'patch', 'vm'] },
  { id: 'n-offtarget', kind: 'note', title: 'CRISPR off-target survey — batch 12', meta: 'note · 21 claims', tags: ['genome', 'editing', 'guide'] },
  { id: 'n-behav', kind: 'note', title: 'Open-field behaviour after CNO', meta: 'note · 6 claims', tags: ['dreadd', 'chemogenetic', 'assay'] },
  { id: 'n-meta', kind: 'note', title: 'Meta-analysis: sharp-wave ripple density', meta: 'note · 33 claims', tags: ['review', 'ripple', 'stats'] },

  // protocols (versioned like code)
  { id: 'p-patch', kind: 'protocol', title: 'Patch-clamp rig calibration', meta: 'v4.2 · signed', tags: ['electrophysiology', 'setup', 'seal'] },
  { id: 'p-clarity', kind: 'protocol', title: 'Tissue clearing — CLARITY', meta: 'v2.1 · 3 forks', tags: ['histology', 'imaging', 'brain'] },
  { id: 'p-rna', kind: 'protocol', title: 'RNA extraction — cold protocol', meta: 'v7.0 · signed', tags: ['molecular', 'prep', 'rnase'] },
  { id: 'p-2p', kind: 'protocol', title: 'Two-photon alignment SOP', meta: 'v3.4 · draft', tags: ['optics', 'laser', 'psf'] },
  { id: 'p-perfuse', kind: 'protocol', title: 'Transcardial perfusion', meta: 'v1.9 · signed', tags: ['surgery', 'fixation', 'pfa'] },

  // citations (first-class objects — link to Source below)
  { id: 'c-buzsaki', kind: 'citation', title: 'Buzsáki 2015 — Hippocampal sharp wave-ripples', meta: '10.1002/hipo · 4.1k', tags: ['ripple', 'memory', 'review'] },
  { id: 'c-tononi', kind: 'citation', title: 'Tononi & Cirelli 2014 — Synaptic homeostasis', meta: '10.1016/neuron · 3.2k', tags: ['sleep', 'plasticity'] },
  { id: 'c-chung', kind: 'citation', title: 'Chung & Deisseroth 2013 — CLARITY', meta: '10.1038/nature · 2.7k', tags: ['clearing', 'imaging', 'method'] },
  { id: 'c-doudna', kind: 'citation', title: 'Jinek et al. 2012 — Programmable dual-RNA', meta: '10.1126/science · 12k', tags: ['crispr', 'cas9', 'editing'] },
  { id: 'c-wilson', kind: 'citation', title: 'Wilson & McNaughton 1994 — Reactivation', meta: '10.1126/science · 3.9k', tags: ['replay', 'place', 'sleep'] },
];

// ── Sources: DOI-style cards shown by the citation hover-card ──────────────────
export interface Source {
  id: string;
  ref: string; // in-text marker, e.g. [1]
  authors: string;
  title: string;
  venue: string;
  year: number;
  doi: string;
  cited: number;
}

export const SOURCES: Record<string, Source> = {
  s1: {
    id: 's1', ref: '1',
    authors: 'Wilson, M. A. & McNaughton, B. L.',
    title: 'Reactivation of hippocampal ensemble memories during sleep',
    venue: 'Science', year: 1994, doi: '10.1126/science.8036517', cited: 3912,
  },
  s2: {
    id: 's2', ref: '2',
    authors: 'Buzsáki, G.',
    title: 'Hippocampal sharp wave-ripple: A cognitive biomarker',
    venue: 'Hippocampus', year: 2015, doi: '10.1002/hipo.22488', cited: 4130,
  },
  s3: {
    id: 's3', ref: '3',
    authors: 'Tononi, G. & Cirelli, C.',
    title: 'Sleep and the price of plasticity',
    venue: 'Neuron', year: 2014, doi: '10.1016/j.neuron.2013.12.025', cited: 3204,
  },
};

// A short note document. Segments marked with `cite` render as citation chips.
export type Segment = { t: string } | { t: string; cite: string };

export const NOTE = {
  id: 'n-replay',
  title: 'Hippocampal replay during slow-wave sleep',
  path: 'lab/hippocampus/replay.note',
  updated: '2 hours ago · v12',
  body: [
    { t: 'During slow-wave sleep, place-cell sequences recorded in waking are ' },
    { t: 'reactivated in compressed order', cite: 's1' },
    { t: ', a phenomenon we treat as the substrate of consolidation. Each replay event rides on a ' },
    { t: 'sharp-wave ripple', cite: 's2' },
    { t: ' in CA1, and its density scales with the prior day’s learning. This links directly to the ' },
    { t: 'synaptic-homeostasis account', cite: 's3' },
    { t: ', where sleep renormalises the weights that waking experience drove up.' },
  ] as Segment[],
};

// Notes that reference this one — the backlinks rail.
export const BACKLINKS = [
  { id: 'b1', title: 'Meta-analysis: sharp-wave ripple density', meta: 'links “ripple density” · §3' },
  { id: 'b2', title: 'Open-field behaviour after CNO', meta: 'links “consolidation” · §1' },
  { id: 'b3', title: 'Protocol · Patch-clamp rig calibration v4.2', meta: 'cited as method · v4.2' },
];

// ── STEP scroll ───────────────────────────────────────────────────────────────
export const STEPS = [
  {
    n: '01',
    key: 'capture',
    title: 'Capture',
    lede: 'Write in plain Markdown. Fieldnote parses every sentence into a claim you can point at — no forms, no fields to fill.',
    points: ['Block editor with slash commands', 'Auto-links to existing notes as you type', 'Offline-first, keystroke-versioned'],
  },
  {
    n: '02',
    key: 'cite',
    title: 'Cite',
    lede: 'Attach a source to any claim and it becomes an object — a real DOI, resolvable, deduplicated across the whole lab. Hover a citation to read its receipt.',
    points: ['Paste a DOI, get a formatted source', 'One source, cited everywhere, counted once', 'Hover-card shows authors, venue, year'],
  },
  {
    n: '03',
    key: 'connect',
    title: 'Connect',
    lede: 'Backlinks and shared citations weave your notes into a graph. Search it in one keystroke; watch a question light up its neighbourhood.',
    points: ['Bidirectional backlinks, automatic', 'Shared-citation edges between notes', '⌘K jumps anywhere in ~7 ms'],
  },
];

// ── Trust / stats counters ─────────────────────────────────────────────────────
export const STATS = [
  { to: 2.4, dec: 1, suffix: 'M', label: 'citations linked' },
  { to: 1840, dec: 0, suffix: '', label: 'labs onboarded' },
  { to: 96000, dec: 0, suffix: '', label: 'protocols versioned', compact: true },
  { to: 7, dec: 0, suffix: 'ms', label: 'median search latency' },
];

// ── Knowledge graph ─────────────────────────────────────────────────────────────
export interface GNode { id: string; x: number; y: number; r: number; label: string; kind: Kind }
export interface GEdge { a: string; b: string }

export const GRAPH_NODES: GNode[] = [
  { id: 'g-replay', x: 300, y: 190, r: 13, label: 'Replay', kind: 'note' },
  { id: 'g-ripple', x: 470, y: 110, r: 9, label: 'SW-ripple', kind: 'citation' },
  { id: 'g-sleep', x: 165, y: 108, r: 9, label: 'SWS', kind: 'note' },
  { id: 'g-homeo', x: 505, y: 250, r: 8, label: 'Homeostasis', kind: 'citation' },
  { id: 'g-patch', x: 120, y: 268, r: 8, label: 'Patch v4.2', kind: 'protocol' },
  { id: 'g-place', x: 355, y: 320, r: 7, label: 'Place cells', kind: 'note' },
  { id: 'g-meta', x: 210, y: 355, r: 8, label: 'Meta-analysis', kind: 'note' },
  { id: 'g-crispr', x: 610, y: 175, r: 7, label: 'CRISPR', kind: 'citation' },
  { id: 'g-astro', x: 560, y: 340, r: 7, label: 'Astrocytes', kind: 'note' },
  { id: 'g-2p', x: 655, y: 285, r: 6, label: '2P align', kind: 'protocol' },
];

export const GRAPH_EDGES: GEdge[] = [
  { a: 'g-replay', b: 'g-ripple' },
  { a: 'g-replay', b: 'g-sleep' },
  { a: 'g-replay', b: 'g-homeo' },
  { a: 'g-replay', b: 'g-place' },
  { a: 'g-replay', b: 'g-meta' },
  { a: 'g-sleep', b: 'g-patch' },
  { a: 'g-ripple', b: 'g-homeo' },
  { a: 'g-ripple', b: 'g-crispr' },
  { a: 'g-meta', b: 'g-place' },
  { a: 'g-meta', b: 'g-patch' },
  { a: 'g-homeo', b: 'g-astro' },
  { a: 'g-astro', b: 'g-2p' },
];

// ── Ticker microcopy ────────────────────────────────────────────────────────────
export const TICKER = [
  'protocols versioned like code',
  'claims cited, not asserted',
  'graphs searchable in one keystroke',
  'every source deduplicated',
  'backlinks, automatic',
  'DOIs resolved and counted',
  'offline-first, keystroke-versioned',
  'one lab, one knowledge graph',
];

// ── Pricing ─────────────────────────────────────────────────────────────────────
export interface Tier {
  name: string;
  price: string;
  unit: string;
  blurb: string;
  cta: string;
  featured?: boolean;
  features: string[];
}

export const TIERS: Tier[] = [
  {
    name: 'Scholar',
    price: '$0',
    unit: 'forever',
    blurb: 'For a single researcher and their notebook.',
    cta: 'Start free',
    features: ['Unlimited notes & citations', 'Full-text + citation search', 'Knowledge graph', '1 000 DOI resolves / mo', 'Local export (Markdown + BibTeX)'],
  },
  {
    name: 'Lab',
    price: '$12',
    unit: 'per seat / mo',
    blurb: 'For a group that shares protocols and a graph.',
    cta: 'Start 30-day trial',
    featured: true,
    features: ['Everything in Scholar', 'Shared lab graph & backlinks', 'Protocol versioning & sign-off', 'Unlimited DOI resolves', 'Roles & audit log', 'Priority support'],
  },
  {
    name: 'Institution',
    price: 'Custom',
    unit: 'annual',
    blurb: 'For departments, cores, and consortia.',
    cta: 'Talk to us',
    features: ['Everything in Lab', 'SSO / SAML & SCIM', 'On-prem or private cloud', 'ORCID & repository sync', 'Data-residency controls', 'Named onboarding engineer'],
  },
];
