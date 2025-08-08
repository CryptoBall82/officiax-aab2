'use client';

import React from 'react';
import Image from 'next/image';
import { Menu, LogOut, KeyRound, FileText, Shield, Mail, Globe, Gavel, ClipboardCheck, FileSignature } from 'lucide-react';
import oxImage from '../../public/assets/OX lett white175F.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';

const HomeHeader: React.FC = () => {
  const { logout, isAuthenticated } = useAuth();

  const handleSignOut = () => {
    logout();
  };

  return (
    <header
      className="fixed top-0 w-full h-[75px] bg-background border-b-[3px] border-[rgba(204,0,0,1)] shadow-[0_4px_10px_4px_rgba(187,187,187,0)] z-50 flex items-center justify-between"
    >
      {/* Left section - currently empty */}
      <div className="flex items-center w-[60px]">
      </div>

      {/* Center section - Contains the Image */}
      <div className="flex items-center justify-center flex-grow">
        <Image
          src={oxImage}
          alt="OX Logo"
          height={50}
          width={175}
          data-ai-hint="logo company"
          style={{
            height: '50px',
            width: 'auto',
          }}
          priority
          unoptimized={true}
        />
      </div>

      {/* Right section - Menu Button */}
      <div className="flex items-center justify-end w-[60px] pr-[15px]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button aria-label="Open menu" className="focus:outline-none">
              <Menu className="text-white cursor-pointer" size={36} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2 bg-card border-border shadow-xl">
            {isAuthenticated && (
              <>
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-card-foreground hover:bg-muted">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
              </>
            )}
            <DropdownMenuItem asChild className="cursor-pointer text-card-foreground hover:bg-muted">
              <Link href="/forgot-password">
                <KeyRound className="mr-2 h-4 w-4" />
                <span>Change Password</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem asChild className="cursor-pointer text-card-foreground hover:bg-muted">
              <a href="https://www.OfficiaX.com/privacy" target="_blank" rel="noopener noreferrer">
                <Shield className="mr-2 h-4 w-4" />
                <span>Privacy Policy</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer text-card-foreground hover:bg-muted">
              <a href="https://www.OfficiaX.com/terms" target="_blank" rel="noopener noreferrer">
                <FileText className="mr-2 h-4 w-4" />
                <span>Terms & Conditions</span>
              </a>
            </DropdownMenuItem>
             <DropdownMenuItem asChild className="cursor-pointer text-card-foreground hover:bg-muted">
              <a href="https://www.OfficiaX.com/disclaimer" target="_blank" rel="noopener noreferrer">
                <Gavel className="mr-2 h-4 w-4" />
                <span>Disclaimer</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer text-card-foreground hover:bg-muted">
              <a href="https://www.OfficiaX.com/aup" target="_blank" rel="noopener noreferrer">
                <ClipboardCheck className="mr-2 h-4 w-4" />
                <span>Acceptable Use</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer text-card-foreground hover:bg-muted">
              <a href="https://www.OfficiaX.com/eula" target="_blank" rel="noopener noreferrer">
                <FileSignature className="mr-2 h-4 w-4" />
                <span>EULA</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem asChild className="cursor-pointer text-card-foreground hover:bg-muted">
              <a href="mailto:CharlesLang@OfficiaX.com">
                <Mail className="mr-2 h-4 w-4" />
                <span>Contact Us</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer text-card-foreground hover:bg-muted">
              <a href="https://www.OfficiaX.com" target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 h-4 w-4" />
                <span>Website</span>
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export { HomeHeader };
