// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';

import { AuthProvider } from '@/context/auth-context';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'OfficiaX',
  description: 'Empowering Officials with Advanced Tools & AI',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased bg-background text-foreground`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
