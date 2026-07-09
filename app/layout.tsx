import type { Metadata, Viewport } from 'next';
import './globals.css';
import PaletteProvider from '@/components/PaletteProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://bswxyz.github.io/fieldnote-research/'),
  title: 'Fieldnote — every claim has a receipt',
  description:
    'Fieldnote is a research notebook where citations are first-class objects: every claim links to a real, deduplicated DOI, protocols version like code, and your lab’s knowledge graph is one keystroke away. Try the working ⌘K palette.',
  applicationName: 'Fieldnote',
  authors: [{ name: 'Fable' }],
  keywords: ['research notes', 'citations', 'DOI', 'knowledge graph', 'protocols', 'command palette', 'science', 'academia'],
  openGraph: {
    title: 'Fieldnote — every claim has a receipt',
    description: 'Research notes with citations as first-class objects. A working ⌘K command palette, citation hover-cards, and a searchable knowledge graph.',
    type: 'website',
    url: 'https://bswxyz.github.io/fieldnote-research/',
  },
};

export const viewport: Viewport = {
  themeColor: '#0b0d10',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* progressive enhancement: gate the hidden reveal states on JS before paint */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="bg-layer bg-glow" aria-hidden="true" />
        <div className="bg-layer bg-grid" aria-hidden="true" />
        <PaletteProvider>{children}</PaletteProvider>
      </body>
    </html>
  );
}
