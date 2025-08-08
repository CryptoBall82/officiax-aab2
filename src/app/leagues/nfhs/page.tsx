// src/app/leagues/nfhs/page.tsx
'use client';

import React from 'react';
import { DefaultHeader } from '@/components/DefaultHeader';
import { NavbarLeagues } from '@/components/NavbarLeagues';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// Removed: import nfhsImage from '../../../../public/assets/nfhs.png';

export default function NFHSPage() {
  const router = useRouter();

  const handleButtonClick = (level: string) => {
    if (level === 'Middle School') {
      router.push('/leagues/nfhs/middleschool');
    } else if (level === 'High School') {
      router.push('/leagues/nfhs/highschool');
    } else {
       console.log(`${level} button clicked`);
    }
  };

  return (
    <div className="flex flex-col h-screen items-center mx-auto max-w-[4500px]">
      <DefaultHeader />
      <div className="flex-grow relative w-full">
          <div className="flex justify-center relative mb-4">
            <span
              className="absolute font-bold text-3xl text-white"
              style={{
                  top: '90px',
                  left: '50%',
                  transform: 'translateX(-50%)',
               }}
            >
              NFHS
            </span>
            <Image
              src="/assets/nfhs.png" // Corrected path
              alt="NFHS Logo"
              data-ai-hint="nfhs logo sports shield"
              width={175}
              height={225} // Updated height prop
              style={{
                position: 'absolute',
                top: '130px',
                left: '50%',
                transform: 'translateX(-50%)',
                height: '225px', // Updated style height
                width: 'auto',   // Width remains auto
              }}
              priority
              unoptimized={true}
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://placehold.co/175x225.png';
              }}
            />
          </div>

          <div className="absolute bottom-[100px] left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-6 w-full px-4">
            <Button
                className="w-[240px] h-[80px] bg-white text-black border-2 border-[rgba(204,0,0,1)] hover:bg-gray-100 rounded-md shadow-[0_0_8px_4px_rgba(0,0,0,.5)] hover:scale-105 transition-transform relative font-bold flex items-center justify-center text-lg"
                onClick={() => handleButtonClick('Middle School')}
            >
                Middle School
            </Button>

            <Button
                className="w-[240px] h-[80px] bg-white text-black border-2 border-[rgba(204,0,0,1)] hover:bg-gray-100 rounded-md shadow-[0_0_8px_4px_rgba(0,0,0,.5)] hover:scale-105 transition-transform relative font-bold flex items-center justify-center text-lg"
                onClick={() => handleButtonClick('High School')}
            >
                High School
            </Button>
          </div>
      </div>
      <NavbarLeagues />
    </div>
  );
}
