// src/components/layout/protected-route.tsx
"use client";

import type { ReactNode } from 'react';
import { useAuth } from '@/context/auth-context';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
// import { Skeleton } from '@/components/ui/skeleton'; // <--- No longer needed if not showing loading state here

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth(); // Corrected: removed 'loading'
  useAuthRedirect({ redirectTo: '/login', requireAuth: false }); // Redirect to login if not authenticated

  // The AuthProvider already handles the loading state, so we don't need this if (loading) block here.
  // if (loading) {
  //   return (
  //     <div className="flex min-h-screen flex-col items-center justify-center p-4">
  //       <div className="space-y-4 w-full max-w-md">
  //         <Skeleton className="h-12 w-full" />
  //         <Skeleton className="h-8 w-3/4" />
  //         <Skeleton className="h-32 w-full" />
  //         <Skeleton className="h-8 w-1/2" />
  //       </div>
  //     </div>
  //   );
  // }

  if (!user) {
    // This return is a fallback, useAuthRedirect should handle the redirect.
    // It can be useful if the redirect takes a moment or if JS is disabled (though this is a client component).
    return null;
  }

  return <>{children}</>;
}