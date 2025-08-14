// src/app/leagues/oceepark/page.tsx
'use client';

import React, { useState } from 'react'; // Import useState
import { DefaultHeader } from '@/components/DefaultHeader';
import { NavbarLeagues } from '@/components/NavbarLeagues';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import Image component

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'; // Import Dialog components
import { X } from 'lucide-react'; // Import X icon for close button

export default function OceeParkPage() {
  const router = useRouter();
  const [isOceeDialogOpen, setIsOceeDialogOpen] = useState(false); // State for Ocee dialog visibility

  const buttons = [
    { name: 'Ocee Park Rules', path: '/leagues/oceepark/rules' },
    { name: 'Ocee Field Status', path: '/leagues/oceepark/fieldstatus' }, // Updated path
    { name: 'Ocee Parking', path: '#', action: () => setIsOceeDialogOpen(true) }, // Updated action
  ];

  const handleButtonClick = (path: string, action?: () => void) => { // Updated handler
    if (action) {
      action();
    } else if (path !== '#') {
      router.push(path);
    } else {
      console.log('Placeholder link clicked');
    }
  };

  return (
    <div className="flex flex-col h-screen items-center mx-auto max-w-[500px]">
      <DefaultHeader />
      <div className="flex-grow relative w-full">
        <div className="flex justify-center relative mb-4">
          {/* Page Title */}
          <span
            className="absolute font-bold text-3xl text-white whitespace-nowrap"
            style={{
                top: '115px',
                left: '50%',
                transform: 'translateX(-50%)',
               }}
          >
            Ocee Park
          </span>
          {/* Ocee Park Logo */}
          <Image
            src="/assets/ocee.png" // Directly referencing from public folder
            alt="Ocee Park Logo"
            data-ai-hint="ocee park logo baseball"
            width={225}
            height={225}
            style={{
              position: 'absolute',
              top: '155px', // Position below title
              left: '50%',
              transform: 'translateX(-50%)',
              height: '225px', // Explicit height in style
              width: '225px',   // Explicit width in style
            }}
            priority
            unoptimized={true}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://placehold.co/225x225.png';
            }}
          />
        </div>

        {/* Umpire Room Code */}
          <p
            className="absolute text-white font-semibold text-center"
            style={{
              top: '350px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%' // Ensure text wraps if needed
            }}
          >
            Code to the umpire&apos;s room - 7839
          </p>


        {/* Buttons Container */}
        <div className="absolute bottom-[130px] left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4 w-full px-4">
          {buttons.map((buttonInfo) => (
            <Button
              key={buttonInfo.name}
              className="w-[225px] h-[45px] bg-white text-black border-2 border-[rgba(204,0,0,1)] hover:bg-gray-100 rounded-md shadow-[0_0_8px_4px_rgba(0,0,0,.5)] hover:scale-105 transition-transform relative mb-[5px] font-bold"
              onClick={() => handleButtonClick(buttonInfo.path, buttonInfo.action)}
            >
              {buttonInfo.name}
            </Button>
          ))}
        </div>
      </div>
      <NavbarLeagues />

      {/* Dialog for Ocee Parking */}
      <Dialog open={isOceeDialogOpen} onOpenChange={setIsOceeDialogOpen}>
        <DialogContent className="max-w-3xl w-auto p-0 bg-transparent border-none shadow-none">
           {/* Visually hidden DialogTitle for accessibility */}
           <DialogHeader>
             <DialogTitle className="sr-only">Ocee Park Parking Map</DialogTitle>
           </DialogHeader>
           {/* Close button positioned inside DialogContent */}
           <DialogClose asChild>
             <button
               className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors z-50"
               aria-label="Close"
             >
               <X className="h-6 w-6" />
             </button>
           </DialogClose>
           <div className="relative w-full h-auto"> {/* Container for Image */}
             <Image
               src="/assets/ocee_parking2x.png" // Directly referencing from public folder
               alt="Ocee Park Parking Map"
               data-ai-hint="parking map aerial view baseball park"
               width={390}
               height={390}
               className="object-contain rounded-md" // Ensure image fits and has rounded corners
               unoptimized={true}
               onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                 e.currentTarget.onerror = null;
                 e.currentTarget.src = 'https://placehold.co/390x390.png';
               }}
             />
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
