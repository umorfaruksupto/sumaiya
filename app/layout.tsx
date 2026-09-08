import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'For you, with love', description: 'A little corner of the universe, made with all my heart. Especially you. Always you.' };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
