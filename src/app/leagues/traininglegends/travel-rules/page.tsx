
'use client';

import React from 'react';
import { DefaultHeader } from '@/components/DefaultHeader';
import { NavbarLeagues } from '@/components/NavbarLeagues';

export default function TlTravelRulesPage() {
  // Use the /preview URL for Google Drive for better embed compatibility
  const documentUrl = "https://docs.google.com/spreadsheets/d/1uDYfojWyHhfeyXCTGhqWMI304i9qdWi1/view";

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
          title="TL Travel Rules Document" // Add title for accessibility
        >
          Loading TL Travel Rules...
        </iframe>
      </div>
      <NavbarLeagues />
    </div>
  );
}
