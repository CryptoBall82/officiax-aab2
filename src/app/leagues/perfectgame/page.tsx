
'use client';

import React from 'react';
import { DefaultHeader } from '@/components/DefaultHeader';
import { NavbarLeagues } from '@/components/NavbarLeagues';
//import Image from 'next/image'; // Import Image component

export default function PerfectGamePage() {
  // Use the /preview URL for Google Drive for better embed compatibility
  const documentUrl = "https://docs.google.com/spreadsheets/d/14uVDqaIoEuxILWbgRC6L_8B_KWLIHtDN/view";

  // Removed pgLogoUrl

  return (
    <div className="flex flex-col h-screen items-center mx-auto max-w-[500px]">
      <DefaultHeader />
      {/* Main content area */}
      <div className="flex-grow relative w-full pt-[90px] pb-[90px] flex flex-col items-center px-4 space-y-4">

        {/* Title */}
        <span className="font-bold text-3xl text-foreground"> {/* Changed text-black to text-foreground */}
          Perfect Game
        </span>

        {/* Image container removed */}

        {/* Iframe Container - Takes remaining space */}
        <div className="relative w-full flex-grow">
          <iframe
            src={documentUrl}
            style={{ width: '100%', height: '100%' }}
            frameBorder="0" // Use frameBorder instead of frameborder
            allowFullScreen // Add allowFullScreen attribute
            title="Perfect Game Rules Document" // Add title for accessibility
          >
            Loading Perfect Game Rules...
          </iframe>
        </div>
      </div>
      <NavbarLeagues />
    </div>
  );
}
