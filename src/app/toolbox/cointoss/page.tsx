'use client';

import React from 'react';
import { DefaultHeader } from '@/components/DefaultHeader';
import { NavbarTools } from '@/components/NavbarTools';

export default function CoinToss() {
  return (
    <div className="flex flex-col h-screen items-center mx-auto max-w-[500px]">
      <DefaultHeader />
      {/* Add padding top and bottom to account for fixed header/navbar */}
      <div className="flex-grow relative w-full pt-[75px] pb-[75px] flex items-center justify-center px-4"> {/* Added px-4 for padding */}
        <iframe
          src="https://scratch.mit.edu/projects/1139819540/embed"
          width="485"
          height="300"
        ></iframe>
      </div>
      <NavbarTools />
    </div>
  );
}
