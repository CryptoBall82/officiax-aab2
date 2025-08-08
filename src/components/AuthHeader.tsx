// src/components/AuthHeader.tsx
'use client'; // Good to have for components using client-side hooks like useRouter

import React from 'react';
import Image from 'next/image';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { useRouter } from 'next/navigation';
import oxImage from '../../public/assets/OX lett white175F.png'; // Adjusted path assuming AuthHeader.tsx is in src/components/

// RENAMED the component and made it a named export directly
export const AuthHeader: React.FC = () => { 
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <header
      className="fixed top-0 w-full h-[75px] bg-background border-b-[3px] border-[rgba(204,0,0,1)] shadow-[0_4px_10px_4px_rgba(187,187,187,0)] z-10 flex items-center justify-between"
    >
      {/* Left section - Back Button */}
      <div className="flex items-center w-[60px] justify-start">
        <ArrowBackIosNewOutlinedIcon
          style={{ color: 'rgba(255,255,255,1)', paddingLeft: '15px', cursor: 'pointer', transform: 'scale(3.6)' }}
          onClick={handleBackClick}
        />
      </div>

      {/* Center section - Contains the Image */}
      <div className="flex items-center justify-center flex-grow">
        <Image
          src={oxImage}
          alt="OX Logo"
          height={50} 
          width={175} 
          style={{
            height: '50px', 
            width: 'auto',  
          }}
          priority
          unoptimized={true}
        />
      </div>

      {/* Right section - Menu Button */}
      <div className="flex items-center justify-end w-[60px]">
        <MenuOutlinedIcon style={{ color: 'rgba(255,255,255,1)', paddingRight: '15px', cursor: 'pointer', transform: 'scale(3.6)' }} />
      </div>
    </header>
  );
};

// REMOVE the old export line: `export { AuthHeader };` because it's now exported above.