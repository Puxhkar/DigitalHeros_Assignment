import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'DigitalHeros – Subscribe. Score. Win. Give.',
    template: '%s | DigitalHeros',
  },
  description:
    'A premium subscription platform where your golf scores enter you into monthly prize draws and contribute to life-changing charities. Compete. Win. Do good.',
  keywords: ['golf scores', 'charity', 'prize draw', 'stableford', 'monthly prizes', 'subscription'],
  openGraph: {
    title: 'DigitalHeros – Subscribe. Score. Win. Give.',
    description:
      'A premium subscription platform where your golf scores enter you into monthly prize draws and contribute to life-changing charities.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DigitalHeros',
    description: 'Golf scores. Monthly draws. Charity impact.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-surface-950 text-white min-h-screen`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#1e293b' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#1e293b' },
            },
          }}
        />
      </body>
    </html>
  );
}
