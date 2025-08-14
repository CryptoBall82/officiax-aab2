'use client';

import React from 'react';
import {DefaultHeader} from '@/components/DefaultHeader';
import {NavbarAI} from '@/components/NavbarAI';
import ClientIframe from '@/components/client-iframe'; // Import the ClientIframe component

export default function AI() {
  return (
    <div className="flex flex-col h-screen items-center mx-auto max-w-[450px]">
      <DefaultHeader />
      {/* Add padding top and bottom to account for fixed header/navbar */}
      {/* Increased pt from 75px to 85px */}
      <div className="flex-grow relative w-full pt-[100px] pb-[100px] pl-[10px] pr-[10px]">
        <ClientIframe
          src="https://udify.app/chatbot/qhos5x80k9DFeSg0"
          style={{ width: '100%', height: '100%' }} // iframe fills the padded container
          frameBorder="0"
          allow="microphone"
          title="AI Assistant Chatbot" // Added title for accessibility
        />
      </div>
      <NavbarAI />
    </div>
  );
}
