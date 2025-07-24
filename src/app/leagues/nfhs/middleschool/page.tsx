
'use client';

import React from 'react';
import { DefaultHeader } from '@/components/DefaultHeader';
import { NavbarLeagues } from '@/components/NavbarLeagues';

export default function NFHSMiddleSchoolRulesPage() {
  // Use the /preview URL for Google Drive for better embed compatibility
  const documentUrl = "https://drive.google.com/file/d/1tNij8P27VB9xb3P5ewgqGGD32Mu0HXkR/preview";

  return (
    <div className="flex flex-col h-screen items-center mx-auto max-w-[500px]">
      <DefaultHeader />
      {/* Add padding top and bottom to account for fixed header/navbar */}
      <div className="flex-grow relative w-full pt-[90px] pb-[90px] flex items-center justify-center px-4"> {/* Adjust padding as needed */}
        <iframe
          src={documentUrl}
          style={{ width: '100%', height: '100%' }}
          frameBorder="0" // Use frameBorder instead of frameborder
          allowFullScreen // Add allowFullScreen attribute
          title="NFHS Middle School Rules Document" // Add title for accessibility
        >
          Loading NFHS Middle School Rules...
        </iframe>
      </div>
      <NavbarLeagues />
    </div>
  );
}
