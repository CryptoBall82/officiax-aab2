// src/app/signup/page.tsx
"use client";

import { SignupForm } from '@/components/auth/signup-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthHeader } from '@/components/AuthHeader';

export default function SignupPage() {
  const {isLoading, isAuthenticated} = useAuthRedirect({ requireAuth: false });

  if (isLoading || isAuthenticated) {
     return (
      <div className="flex min-h-screen flex-col items-center bg-background">
        <AuthHeader />
        <main className="flex flex-grow flex-col items-center justify-center w-full p-4">
          <Skeleton className="w-full max-w-md h-[450px] rounded-lg" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-background">
      <AuthHeader />
      <main className="flex flex-grow flex-col items-center justify-center w-full p-4">
        <Card className="w-full max-w-md bg-card shadow-2xl">
          <CardHeader className="text-center pt-[10px]"> {/* Added pt-[10px] here */}
            <CardTitle className="text-3xl font-bold tracking-tight">Create Your OfficiaX Account</CardTitle>
            <CardDescription>Join the community and enhance your officiating.</CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm />
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-accent hover:underline">
                Log In
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
