import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How Fieldnote was built — the guide',
  description:
    'A walkthrough of Fieldnote’s signature techniques: a working ⌘K command palette and citations as first-class objects with DOI hover-cards, built on a Next.js static export.',
};

export default function Guide() {
  return (
    <div className="guide">
      <div className="guide-top">
        <a href="../">← Fieldnote</a>
        <span>THE GUIDE · how it was built</span>
      </div>

      <span className="ey">Design showcase · build notes</span>
      <h1>A research tool that <em>proves</em> itself.</h1>
      <p className="sub">
        Fieldnote looks like a shipped dev-tool: a ⌘K palette that really searches, citations that pop a
        source card, a knowledge graph that lights up. It is a Next.js static export — no server, no
        database — that deploys to GitHub Pages as flat files. Here is how the illusion holds.
      </p>

      <h2>The idea</h2>
      <p>
        Scientists don’t lose their data — they lose the <em>why</em>. Which paper backed this claim? Which
        version of the protocol produced that figure? Fieldnote’s thesis is that a citation should be a
        <strong> first-class object</strong>, not a footnote: one canonical, resolvable DOI, deduplicated
        across the whole lab, attached directly to the sentence it supports. The site had to make that
        feel real in five seconds — so the hero <em>is</em> the product. You type; it searches; a source
        card shows the receipt. Everything else is proof the feeling holds up.
      </p>

      <h2>The stack</h2>
      <ul>
        <li><strong>Next.js (App Router) with <code>output: &apos;export&apos;</code>.</strong> The whole
          site pre-renders to static HTML/CSS/JS. React earns its place here because the palette,
          citation cards, and graph are genuinely stateful — a vanilla build would reinvent a small
          component framework.</li>
        <li><strong>Zero runtime backend.</strong> There is no API. The &quot;search index&quot; is a
          hand-authored fixture and an in-memory fuzzy matcher (a subsequence scorer, ~40 lines). That is
          the honest boundary — see the README&apos;s demo-vs-real map.</li>
        <li><strong>Geist / Geist / Geist Mono.</strong> One family across display, body, and mono. The
          restraint is the identity: a dev tool speaks in one confident, tabular voice.</li>
      </ul>
      <p>Because it is a project site at <code>/fieldnote-research/</code>, the config sets the base path
        and asset prefix so every URL resolves under that folder on Pages:</p>
      <pre><code><span className="c">{'// next.config.mjs'}</span>{`
const nextConfig = {
  output: `}<span className="g">{"'export'"}</span>{`,
  basePath: `}<span className="g">{"'/fieldnote-research'"}</span>{`,
  assetPrefix: `}<span className="g">{"'/fieldnote-research/'"}</span>{`,
  trailingSlash: `}<span className="k">true</span>{`,
  images: { unoptimized: `}<span className="k">true</span>{` },
};`}</code></pre>

      <h2>Signature technique #1 — a real ⌘K palette</h2>
      <p>
        The palette is not a screenshot. One <code>PaletteBody</code> component owns the query, the result
        set, and the active row; it renders both inline in the hero and inside a focus-trapped overlay
        dialog. The fuzzy matcher is a subsequence scorer that also returns the matched indices, so the
        UI can highlight exactly the letters you typed:
      </p>
      <pre><code>{`export function fuzzy(text, q) {
  let ti = 0, score = 0, prev = -2;
  const indices = [];
  for (const ch of q.toLowerCase()) {
    const found = text.toLowerCase().indexOf(ch, ti);
    if (found === -1) `}<span className="k">return null</span>{`;      `}<span className="c">{'// not a subsequence'}</span>{`
    score += found - prev - 1;                `}<span className="c">{'// penalise gaps'}</span>{`
    if (isBoundary(text, found)) score -= 2;  `}<span className="c">{'// reward word starts'}</span>{`
    indices.push(found); prev = found; ti = found + 1;
  }
  return { score, indices };
}`}</code></pre>
      <p>The keyboard contract is the whole point of a command palette, so it is exhaustive: a global
        <code> {'⌘'}/Ctrl-K</code> listener toggles the overlay; the input is a
        <code> role=&quot;combobox&quot;</code> that points <code>aria-activedescendant</code> at the
        selected <code>role=&quot;option&quot;</code>; arrows / Home / End move it, Enter opens, Esc
        clears then closes. The dialog is <code>aria-modal</code> with a Tab focus-trap and restores focus
        to the trigger on close.</p>
      <div className="callout">
        Reduced motion is respected everywhere: the overlay pop and ticker freeze, the graph stops
        pulsing, and reveals render in place — the palette still opens instantly.
      </div>

      <h2>Signature technique #2 — citations as objects</h2>
      <p>
        In the note mock, certain phrases are <code>CitationChip</code> components rather than plain text.
        The chip is a real button — hover or focus pops a card, click pins it for touch, Escape closes —
        and the card reads a shared <code>SOURCES</code> record, so the same DOI can be cited in many
        notes and counted once:
      </p>
      <pre><code>{`<span role="button" tabIndex={0} aria-expanded={pinned}
      aria-describedby={cardId}>
  {text}<sup>[{src.ref}]</sup>
  <span className="cite-card" id={cardId} role="tooltip">
    <b>{src.title}</b>
    <row>doi   `}<span className="g">{'{src.doi}'}</span>{`</row>
    <row>venue {src.venue} · {src.year}</row>
  </span>
</span>`}</code></pre>
      <p>The backlinks rail beside the note lists the other notes that reference it — the human-readable
        edge of the same graph the <code>#graph</code> section draws as an SVG. Hover a node there and its
        neighbourhood lights up along the exact edges the search would traverse.</p>

      <h2>Details that matter</h2>
      <ul>
        <li><strong>Progressive enhancement.</strong> A one-line inline script adds <code>.js</code> to
          <code> &lt;html&gt;</code> before paint; every hidden reveal state is gated on it, so with
          scripts off the page is fully readable and the palette input still renders.</li>
        <li><strong>No hydration warnings.</strong> Counters and tweened values render their final value on
          the server and only animate after mount, so server and client markup match.</li>
        <li><strong>Tabular numerals</strong> on every metric, DOI, and result count — numbers never
          shift width as they animate.</li>
        <li><strong>Contrast &amp; focus.</strong> Dim text clears WCAG AA on the near-black stage, and
          <code> :focus-visible</code> rings sit on every interactive element, including SVG graph nodes.</li>
      </ul>

      <h2>Ship it on GitHub Pages</h2>
      <p>Static export writes to <code>out/</code>. GitHub Pages serves this repo from <code>/docs</code>,
        so the build output is copied there with a <code>.nojekyll</code> marker (so Pages doesn&apos;t
        strip the <code>_next</code> folder):</p>
      <pre><code><span className="c">{'# build → copy to docs → publish'}</span>{`
npm run build
rm -rf docs && cp -r out docs && touch docs/.nojekyll

gh repo create bswxyz/fieldnote-research --public --source . --push
`}<span className="c">{'# Settings → Pages → main / docs'}</span>{`
`}<span className="c">{'# live at https://bswxyz.github.io/fieldnote-research/'}</span></code></pre>
      <p>Because <code>basePath</code> and <code>assetPrefix</code> are set, every asset resolves under the
        project subpath, and <code>trailingSlash</code> keeps <code>/guide/</code> working as a folder.</p>

      <hr className="rule" />
      <p style={{ color: 'var(--faint)', fontSize: '0.9rem' }}>
        Fieldnote is a design-showcase concept. The notes, protocols, labs, and citations are fictional;
        search runs in memory with no real index, resolver, sync, or auth. See the repository README for
        the full demo-vs-real map.
      </p>
      <a className="back" href="../">← Back to Fieldnote</a>
    </div>
  );
}
