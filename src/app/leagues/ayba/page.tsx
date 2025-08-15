
'use client';

import React, { useState } from 'react';
import { DefaultHeader } from '@/components/DefaultHeader';
import { NavbarLeagues } from '@/components/NavbarLeagues';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { X, CloudRainWind } from 'lucide-react';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';

const ParkingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
    <path fill="currentColor" d="M13 7h-3a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0v-2h2a3 3 0 0 0 3-3v-1a3 3 0 0 0-3-3m1 4a1 1 0 0 1-1 1h-2V9h2a1 1 0 0 1 1 1Zm-2-9a10 10 0 1 0 10 10A10 10 0 0 0 12 2m0 18a8 8 0 1 1 8-8a8 8 0 0 1-8 8"/>
  </svg>
);

export default function AybaPage() {
  const router = useRouter();
  const [isWillsDialogOpen, setIsWillsDialogOpen] = useState(false);
  const [isWebbDialogOpen, setIsWebbDialogOpen] = useState(false);

  const buttons = [
    { name: 'Rules', path: '/leagues/ayba/rules', action: () => router.push('/leagues/ayba/rules'), icon: MenuBookOutlinedIcon },
    { name: 'Field Status', path: '/leagues/ayba/fieldstatus', action: () => router.push('/leagues/ayba/fieldstatus'), icon: CloudRainWind },
    { name: 'Wills Park', path: '#', action: () => setIsWillsDialogOpen(true), icon: ParkingIcon },
    { name: 'Webb Br', path: '#', action: () => setIsWebbDialogOpen(true), icon: ParkingIcon },
  ];

  return (
    <div className="flex flex-col h-screen items-center mx-auto max-w-[500px]">
      <DefaultHeader />
      <div className="flex-grow relative w-full">
          <div className="flex justify-center relative">
            <span
              className="absolute font-bold text-3xl text-white"
              style={{
                top: '115px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              AYBA
            </span>
            <Image
              src="/assets/ayba_logo225.png"
              alt="AYBA Logo"
              data-ai-hint="ayba logo baseball"
              width={225}
              height={225}
              priority
              style={{
                position: 'absolute',
                top: '160px',
                left: '50%',
                transform: 'translateX(-50%)',
                height: '225px',
                width: '225px',
              }}
                unoptimized={true}
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = 'https://placehold.co/225x225/cccccc/000000?text=AYBA+Logo';
              }}
            />
          </div>

          <div className="absolute bottom-[120px] left-0 right-0 flex justify-center">
            <div className="grid grid-cols-2 gap-y-[20px] gap-x-[20px] p-4">
              {buttons.map((buttonInfo) => (
                <button
                  key={buttonInfo.name}
                  className="w-[140px] h-[140px] bg-[rgba(255,255,255,1)] border-[2px] border-[rgba(204,0,0,1)] shadow-[0_0_8px_4px_rgba(0,0,0,.5)] rounded-md hover:scale-105 transition-transform relative"
                  onClick={buttonInfo.action}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    {buttonInfo.icon === MenuBookOutlinedIcon ? (
                      <MenuBookOutlinedIcon style={{ color: 'rgba(0,0,0,1)', width: '35px', height: '35px' }} />
                    ) : buttonInfo.icon === CloudRainWind ? (
                      <CloudRainWind style={{ color: 'rgba(0,0,0,1)', width: '35px', height: '35px' }} />
                    ) : buttonInfo.icon === ParkingIcon ? (
                      <ParkingIcon style={{ color: 'rgba(0,0,0,1)', width: '35px', height: '35px' }} />
                    ) : null}
                    <span
                      className="text-[rgba(0,0,0,1)] font-semibold absolute bottom-0.5 text-center w-full"
                      style={{fontSize: '12pt'}}
                    >
                      {buttonInfo.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
      </div>
      <NavbarLeagues />

      <Dialog open={isWillsDialogOpen} onOpenChange={setIsWillsDialogOpen}>
        <DialogContent className="max-w-3xl w-auto p-0 bg-transparent border-none shadow-none">
          <DialogHeader>
            <DialogTitle className="sr-only">Wills Park Parking Map</DialogTitle>
          </DialogHeader>
          <DialogClose asChild>
            <button
              className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors z-50"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </DialogClose>
          <div className="relative w-full h-auto">
            <Image
              src="/assets/wills2x.png"
              alt="Wills Park Parking Map"
              data-ai-hint="parking map aerial view"
              width={400}
              height={400}
              className="object-contain rounded-md"
              unoptimized={true}
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = 'https://placehold.co/390x390/cccccc/000000?text=Wills+Map';
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isWebbDialogOpen} onOpenChange={setIsWebbDialogOpen}>
        <DialogContent className="max-w-3xl w-auto p-0 bg-transparent border-none shadow-none">
          <DialogHeader>
            <DialogTitle className="sr-only">Webb Bridge Park Parking Map</DialogTitle>
          </DialogHeader>
          <DialogClose asChild>
            <button
              className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors z-50"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </DialogClose>
          <div className="relative w-full h-auto">
            <Image
              src="/assets/webb22x.png"
              alt="Webb Bridge Park Parking Map"
              data-ai-hint="parking map aerial view baseball"
              width={400}
              height={400}
              className="object-contain rounded-md"
                unoptimized={true}
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                const target = e.currentTarget;
                target.onerror = null;
                target.src = 'https://placehold.co/390x390/cccccc/000000?text=Webb+Map';
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
