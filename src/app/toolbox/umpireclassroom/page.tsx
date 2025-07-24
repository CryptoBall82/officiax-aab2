'use client';

import React from 'react';
import { DefaultHeader } from '@/components/DefaultHeader';
import { NavbarTools } from '@/components/NavbarTools';

export default function UmpireClassroom() {
  return (
    <div className="flex flex-col h-screen items-center mx-auto max-w-[500px]">
      <DefaultHeader />
      {/* Add padding top and bottom to account for fixed header/navbar */}
      <div className="flex-grow relative w-full pt-[90px] pb-[90px] flex items-center justify-center px-4"> {/* Added px-4 for padding */}
        <iframe
          src='https://d9f255161da345f6a37d72089e99e15e.elf.site'
          frameBorder='0' // Use frameBorder for React
          width='100%'
          height='100%'
          allowFullScreen // Add allowFullScreen attribute
        ></iframe>
      </div>
      <NavbarTools />
    </div>
  );
}
