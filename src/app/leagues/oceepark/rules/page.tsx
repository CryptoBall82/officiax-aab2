'use client';

import React from 'react';
import { DefaultHeader } from '@/components/DefaultHeader';
import { NavbarLeagues } from '@/components/NavbarLeagues';

export default function OceeParkRulesPage() {
  // Use the embed/preview URL for Google Sheets
  const documentUrl = "https://docs.google.com/spreadsheets/d/1JpiYWL4xBeb0PnVn6v4qRQ4k_bxRgxbs/view"; // Updated URL

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
          title="Ocee Park Rules Document" // Updated title for accessibility
        >
          Loading Ocee Park Rules...
        </iframe>
      </div>
      <NavbarLeagues />
    </div>
  );
}
