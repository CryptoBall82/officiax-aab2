// src/hooks/use-auth-redirect.ts
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Removed usePathname from here
import { useAuth } from '@/context/auth-context';

interface UseAuthRedirectOptions {
redirectTo?: string;
requireAuth?: boolean; // if true, redirect to login if not authenticated. if false, redirect to dashboard if authenticated (e.g. for login page)
}

export function useAuthRedirect({ redirectTo, requireAuth = true }: UseAuthRedirectOptions = {}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  // Removed: const pathname = usePathname(); // Get current path

  useEffect(() => {
    if (isLoading) {
      return; // Wait for auth state to load
    }

    // Removed the specific handling for forgot-password as this page will no longer use this hook
    // if (pathname === '/forgot-password' && isAuthenticated) {
    //     return;
    // }

    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo || '/login');
    } else if (!requireAuth && isAuthenticated) {
      // This condition remains for other public auth pages like /login or /signup
      router.push(redirectTo || '/home');
    }
  }, [isAuthenticated, isLoading, router, requireAuth, redirectTo]); // Removed pathname from dependencies

  return { isAuthenticated, isLoading };
}
