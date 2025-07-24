
'use client';

import React from 'react';
import {DefaultHeader} from '@/components/DefaultHeader';
import {NavbarLeagues} from '@/components/NavbarLeagues';
import {Button} from '@/components/ui/button';
import {useRouter} from 'next/navigation';
import Image from 'next/image';
// Removed: import leagueImage from '../../../public/assets/Leagues225.png';

export default function Leagues() {
  const buttonNames = ['AYBA', 'Ocee Park', 'NFHS', 'Perfect Game', 'Training Legends'];
  const router = useRouter(); 

  const handleLeagueClick = (leagueName: string) => {
    console.log(`Navigating to ${leagueName}`);
     if (leagueName === 'AYBA') {
       router.push('/leagues/ayba');
     } else if (leagueName === 'Ocee Park') {
       router.push('/leagues/oceepark');
     } else if (leagueName === 'NFHS') {
       router.push('/leagues/nfhs');
     } else if (leagueName === 'Perfect Game') {
       router.push('/leagues/perfectgame');
     } else if (leagueName === 'Training Legends') {
       router.push('/leagues/traininglegends');
     }
  };

  return (
    <div className="flex flex-col h-screen items-center mx-auto max-w-[500px]">
      <DefaultHeader />
      <div className="flex-grow relative w-full">
          <div className="flex justify-center relative">
             <span
              className="absolute font-bold text-3xl text-white"
              style={{
                  top: '90px', 
                  left: '50%',
                  transform: 'translateX(-50%)',
               }}
            >
              Leagues
            </span>
             <Image
              key="/assets/Leagues225.png"
              src="/assets/Leagues225.png" // Corrected path
              alt="Baseball field icon"
              data-ai-hint="baseball field logo"
              width={225}
              height={129}
              style={{
                position: 'absolute',
                top: '130px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'auto',
                height: '129px',
              }}
              priority
              onError={(e: any) => {
                e.currentTarget.onerror = null; 
                e.currentTarget.src = 'https://placehold.co/225x129.png';
              }}
            />
          </div>
          <div className="absolute bottom-[100px] left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4 w-full px-4">
            {buttonNames.map((name) => (
              <Button
                key={name}
                className="w-[225px] h-[45px] bg-white text-black border-2 border-[rgba(204,0,0,1)] hover:bg-gray-100 rounded-md shadow-[0_0_8px_4px_rgba(0,0,0,.5)] hover:scale-105 transition-transform relative mb-[5px] font-bold"
                onClick={() => handleLeagueClick(name)}
              >
                {name}
              </Button>
            ))}
          </div>
      </div>
      <NavbarLeagues />
    </div>
  );
}
