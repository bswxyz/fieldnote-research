import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Steps from '@/components/Steps';
import Graph from '@/components/Graph';
import Ticker from '@/components/Ticker';
import Stats from '@/components/Stats';
import Pricing from '@/components/Pricing';
import CTA from '@/components/CTA';

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Ticker />
        <Steps />
        <Graph />
        <Stats />
        <Pricing />
        <CTA />
      </main>
      <footer className="footer">
        <div className="wrap">
          <div className="foot-top">
            <a className="brand" href="./" aria-label="Fieldnote home">
              <span className="brand-mark" aria-hidden="true" />
              <span>Fieldnote</span>
            </a>
            <nav className="foot-links" aria-label="Footer">
              <a href="#steps">How it works</a>
              <a href="#graph">Graph</a>
              <a href="#pricing">Pricing</a>
              <a href="./guide/">Guide</a>
            </nav>
          </div>
          <div className="foot-bottom">
            <span>© 2026 Fieldnote — a design-showcase concept, not a shipping product.</span>
            <span>Designed &amp; built by Fable · <a href="./guide/">How this was built →</a></span>
          </div>
        </div>
      </footer>
    </>
  );
}
