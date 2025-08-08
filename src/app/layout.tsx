// src/app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import { Toaster } from "@/components/ui/toaster";
import BackButtonHandler from '@/components/BackButtonHandler'; // Adjust path if needed

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased bg-background text-foreground`}>
        <AuthProvider>
          {children}
          <Toaster />
          <BackButtonHandler /> {/* Add the handler component here */}
        </AuthProvider>
      </body>
    </html>
  );
}