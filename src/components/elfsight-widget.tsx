// src/components/elfsight-widget.tsx
"use client";

import Script from 'next/script';
import React from 'react';

export default function ElfsightWidget() {
  return (
    <div className="w-full">
      <Script 
        src="https://static.elfsight.com/platform/platform.js" 
        strategy="lazyOnload" 
      />
      <div 
        className="elfsight-app-d9f25516-1da3-45f6-a37d-72089e99e15e" 
        data-elfsight-app-lazy
      ></div>
    </div>
  );
}
