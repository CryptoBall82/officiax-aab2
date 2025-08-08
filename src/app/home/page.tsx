// src/app/home/page.tsx
'use client';

import React from 'react';
import { HomeHeader } from '@/components/HomeHeader';
import { NavbarHome } from '@/components/NavbarHome';
import Image from 'next/image';
import SportsBaseballOutlinedIcon from '@mui/icons-material/SportsBaseballOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { useRouter } from 'next/navigation';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const router = useRouter();
  const { isLoading: authIsLoading } = useAuthRedirect({ requireAuth: true });

  const navigateToLeaguesPage = () => router.push('/leagues');
  const navigateToSchedulePage = () => router.push('/schedule');
  const navigateToToolsPage = () => router.push('/toolbox');
  const navigateToOfficiaX_AIPage = () => router.push('/ai-assistant');

  const buttons = [
    {
      name: 'Leagues',
      action: navigateToLeaguesPage,
      icon: SportsBaseballOutlinedIcon,
      iconSize: '37px',
      fontSize: '14pt',
      textColor: 'text-black',
    },
    {
      name: 'Schedule',
      action: navigateToSchedulePage,
      icon: CalendarMonthOutlinedIcon,
      iconSize: '37px',
      fontSize: '14pt',
      textColor: 'text-black',
    },
    {
      name: 'Tools',
      action: navigateToToolsPage,
      icon: ConstructionOutlinedIcon,
      iconSize: '37px',
      fontSize: '14pt',
      textColor: 'text-black',
    },
    {
      name: 'OfficiaX AI',
      action: navigateToOfficiaX_AIPage,
      icon: AutoAwesomeOutlinedIcon,
      iconSize: '37px',
      fontSize: '13pt',
      textColor: 'text-black',
    },
  ];

  if (authIsLoading) {
    return (
      <div className="flex flex-col h-screen items-center mx-auto max-w-[500px]">
        <HomeHeader />
        <main className="flex-grow w-full flex items-center justify-center p-4 pt-[75px] pb-[75px]">
          <Skeleton className="w-full h-full rounded-lg bg-muted" />
        </main>
        <NavbarHome />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen items-center mx-auto max-w-[500px]">
      <HomeHeader />
      <div className="flex-grow relative w-full">
        <div className="flex justify-center relative">
          <span
            className="absolute font-bold text-3xl text-foreground"
            style={{
              top: '90px',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            Dashboard
          </span>
          <Image
            src="/assets/thinking dog b.png"
            alt="OfficiaX Icon"
            data-ai-hint="logo icon"
            width={225}
            height={225}
            style={{
              position: 'absolute',
              top: '130px',
              left: '50%',
              transform: 'translateX(-50%)',
              height: '225px',
              width: 'auto',
            }}
            priority
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://placehold.co/225x225.png';
            }}
          />
        </div>
        <div className="absolute bottom-[90px] left-0 right-0 flex justify-center">
          <div className="grid grid-cols-2 gap-y-[25px] gap-x-[25px] p-4">
            {buttons.map((buttonInfo) => {
              const IconComponent = buttonInfo.icon;
              const textColor = buttonInfo.textColor || '#000000';

              return (
                <button
                  key={buttonInfo.name}
                  onClick={buttonInfo.action}
                  className={`
                    w-[140px] h-[140px]
                    bg-white ${textColor}
                    border-2 border-primary
                    shadow-[0_0_8px_4px_rgba(0,0,0,.5)] rounded-md
                    hover:scale-105 hover:bg-gray-50 transition-transform relative
                    flex flex-col items-center justify-center p-1
                  `}
                >
                  <IconComponent
                    sx={{ fontSize: buttonInfo.iconSize }}
                  />
                  <span
                    className="font-semibold absolute bottom-0.5 text-center w-full px-1 truncate"
                    style={{ fontSize: buttonInfo.fontSize }}
                  >
                    {buttonInfo.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <NavbarHome />
    </div>
  );
}
