import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <main 
      className={cn(
        "flex-1 overflow-y-auto", 
        // Apply padding to account for fixed header and footer
        // Header: h-16 (mobile), h-[4.5rem] (desktop) -> approx 64px / 72px
        // Footer: h-16 -> approx 64px
        // Adding 1rem (16px) buffer
        "pt-[calc(64px+16px)] pb-[calc(64px+16px)] md:pt-[calc(72px+16px)] px-4",
        className
      )}
    >
      <div className="container mx-auto max-w-5xl">
        {children}
      </div>
    </main>
  );
}
