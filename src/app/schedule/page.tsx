// src/app/schedule/page.tsx

'use client';

import React from 'react';
import { DefaultHeader } from '@/components/DefaultHeader';
import { NavbarSchedule } from '@/components/NavbarSchedule';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; 
// REMOVED: import scheduleImage from '../../../public/assets/calendary225.png'; // No longer needed as src is direct

// Inline SVG for Google Logo
const GoogleLogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="50px" height="50px"> {/* Updated size */}
    <path fill="#EA4335" d="M24 9.5c3.21 0 5.89 1.17 7.78 2.93l5.86-5.86C34.17 3.09 29.63 1 24 1 14.9 1 7.22 6.74 4.17 14.9l7.17 5.48C12.82 13.73 17.94 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.14 24.5c0-1.69-.15-3.3-.42-4.83H24v9.17h12.44c-.54 2.97-2.17 5.48-4.64 7.17l6.67 5.17C42.46 37.64 46.14 31.77 46.14 24.5z"/>
    <path fill="#FBBC05" d="M11.34 20.38C10.86 18.83 10.6 17.2 10.6 15.5c0-1.7.26-3.33.74-4.88l-7.17-5.48C1.59 8.18 0 11.73 0 15.5s1.59 7.32 4.17 10.35l7.17-5.47z"/>
    <path fill="#34A853" d="M24 47c6.57 0 12.04-2.17 16.04-5.86l-6.67-5.17c-2.17 1.45-4.96 2.33-8.17 2.33-6.14 0-11.4-4.26-13.22-9.97l-7.17 5.48C7.22 40.26 14.9 47 24 47z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

// Inline SVG for Outlook Logo
const OutlookLogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 48 48">
    <path fill="#0078D4" d="M19.4,38H34c2.2,0,4-1.8,4-4V14c0-2.2-1.8-4-4-4H19.4V38z" />
    <path fill="#0078D4" d="M16.1,10H8.3C6.5,10,5,11.5,5,13.3v21.3C5,36.5,6.5,38,8.3,38h7.8V10z M12,28.7c-2,0-3.7-1.6-3.7-3.7 s1.6-3.7,3.7-3.7s3.7,1.6,3.7,3.7S14,28.7,12,28.7z" />
  </svg>
);

export default function Schedule() {
  const router = useRouter();

  const navigateToGoogleCalendar = () => {
    //console.log('Navigating to Google Calendar page');
    //router.push('/schedule/googlecalendar'); // Navigate to the new Google Calendar page
    window.open('https://calendar.google.com/calendar/', '_blank', 'noopener,noreferrer'); // Open in a new tab
  };

  const navigateToOutlook = () => {
    window.open('https://outlook.live.com/calendar/0/view/month', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex flex-col h-screen items-center mx-auto max-w-[500px]">
      <DefaultHeader />
      <div className="flex-grow relative w-full"> {/* Removed pt and pb */}
        
        <div className="flex justify-center relative">
          {/* Schedule Text */}
          <span
            className="absolute font-bold text-3xl text-foreground"
            style={{
                top: '90px',
                left: '50%',
                transform: 'translateX(-50%)',
             }}
          >
            Schedule
          </span>

          {/* Image Display */}
          <Image
            src="/assets/calendary225.png" // CHANGED: Directly referencing from public folder
            alt="Calendar icon for Schedule page"
            data-ai-hint="calendar schedule"
            width={191}
            height={175}
            style={{
              position: 'absolute',
              top: '130px', 
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'auto',
              height: '175px'
            }}
            priority
            />
        </div>

        {/* Buttons Container - Centered and positioned from bottom */}
        <div className="absolute bottom-[100px] left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4 w-full px-4">
          {/* Google Calendar Button */}
          <Button
            className="w-[240px] h-[80px] bg-white text-black border-2 border-[rgba(204,0,0,1)] hover:bg-gray-100 rounded-md shadow-[0_0_8px_4px_rgba(0,0,0,.5)] hover:scale-105 transition-transform relative font-bold flex items-center px-4 space-x-3 text-[15px]"
            onClick={navigateToGoogleCalendar}
          >
            <GoogleLogoIcon />
            <span className="flex-grow text-center text-lg">Google Calendar</span>
          </Button>

          {/* Outlook Button */}
          <Button
            className="w-[240px] h-[80px] bg-white text-black border-2 border-[rgba(204,0,0,1)] hover:bg-gray-100 rounded-md shadow-[0_0_8px_4px_rgba(0,0,0,.5)] hover:scale-105 transition-transform relative font-bold flex items-center px-4 space-x-3"
            onClick={navigateToOutlook}
          >
            <OutlookLogoIcon />
            <span className="flex-grow text-center text-lg">Outlook</span>
          </Button>
        </div>
      </div>
      <NavbarSchedule />
    </div>
  );
}
