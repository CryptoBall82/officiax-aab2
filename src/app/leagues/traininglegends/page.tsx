// src/app/leagues/traininglegends/page.tsx
'use client';

import React from 'react';
import { DefaultHeader } from '@/components/DefaultHeader';
import { NavbarLeagues } from '@/components/NavbarLeagues';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// REMOVED: import tlImage from '../../../../public/assets/training_legends175.png';

export default function TrainingLegendsPage() {
  const router = useRouter();

  // Placeholder actions, replace with actual navigation paths when available
  const handleButtonClick = (ruleType: string) => {
    console.log(`${ruleType} button clicked`);
    // Example navigation:
      if (ruleType === 'All-star') {
        router.push('/leagues/traininglegends/allstar-rules'); // Navigate to All-star rules page
      } else if (ruleType === 'Travel') {
        router.push('/leagues/traininglegends/travel-rules'); // Navigate to Travel rules page
      }
  };

  // REMOVED: const tlLogoUrl = {tlImage}; // This variable is no longer needed as src is direct

  return (
    <div className="flex flex-col h-screen items-center mx-auto max-w-[500px]">
      <DefaultHeader />
      <div className="flex-grow relative w-full">
          <div className="flex justify-center relative mb-4">
            {/* Page Title */}
            <span
              className="absolute font-bold text-2xl text-white whitespace-nowrap"
              style={{
                  top: '100px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                 }}
            >
              Training Legends
            </span>
            {/* Training Legends Logo */}
            <Image
              src="/assets/training_legends175.png" // CHANGED: Directly referencing from public folder
              alt="Training Legends Logo"
              data-ai-hint="training legends logo baseball"
              width={295} // Updated width
              height={175} // Updated height
              style={{
                position: 'absolute',
                top: '130px', // Position below title
                left: '50%',
                transform: 'translateX(-50%)',
                height: '175px', // ADDED: Explicit height in style
                width: 'auto',   // ADDED: Explicit width in style
              }}
              priority
              unoptimized={true}
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://picsum.photos/295/175'; // Fallback with new dimensions
              }}
            />
          </div>

          {/* Buttons Container */}
          <div className="absolute bottom-[105px] left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-6 w-full px-4"> {/* Increased gap */}
            {/* TL All-star Rules Button */}
            <Button
                className="w-[240px] h-[80px] bg-white text-black border-2 border-[rgba(204,0,0,1)] hover:bg-gray-100 rounded-md shadow-[0_0_8px_4px_rgba(0,0,0,.5)] hover:scale-105 transition-transform relative font-bold flex items-center justify-center text-lg" // Center text
                onClick={() => handleButtonClick('All-star')}
            >
                TL All-star Rules
            </Button>

            {/* TL Travel Rules Button */}
            <Button
                className="w-[240px] h-[80px] bg-white text-black border-2 border-[rgba(204,0,0,1)] hover:bg-gray-100 rounded-md shadow-[0_0_8px_4px_rgba(0,0,0,.5)] hover:scale-105 transition-transform relative font-bold flex items-center justify-center text-lg" // Center text
                onClick={() => handleButtonClick('Travel')}
            >
                TL Travel Rules
            </Button>
          </div>
      </div>
      <NavbarLeagues />
    </div>
  );
}
