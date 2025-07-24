// src/app/forgot-password/page.tsx
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { AuthHeader } from '@/components/AuthHeader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
// import { useAuthRedirect } from '@/hooks/use-auth-redirect'; // REMOVED
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/auth-context';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    }
  });

  // Removed the useAuthRedirect hook call
  // const { isLoading: authIsLoading, isAuthenticated } = useAuthRedirect({ requireAuth: false });
  const { resetPassword } = useAuth(); // Get resetPassword from useAuth

  // Removed the conditional rendering based on authIsLoading or isAuthenticated
  // if (authIsLoading || isAuthenticated) {
  //   return (
  //     <div className="flex min-h-screen flex-col items-center bg-background">
  //       <AuthHeader />
  //       <main className="flex flex-grow flex-col items-center justify-center w-full p-4">
  //         <Skeleton className="w-full max-w-md h-[300px] rounded-lg" />
  //       </main>
  //     </div>
  //   );
  // }

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setError(null);
    setSuccessMessage(null);
    try {
      await resetPassword(data.email); // Call Firebase resetPassword
      setSuccessMessage("If an account exists for this email, a password reset link has been sent.");
    } catch (err: any) {
      setError(err.message || "Failed to send reset link. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-background">
      <AuthHeader />
      <main className="flex flex-grow flex-col items-center justify-center w-full p-4">
        <Card className="w-full max-w-md bg-card shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold tracking-tight">Forgot Your Password?</CardTitle>
            <CardDescription>Enter your email to receive a reset link.</CardDescription>
          </CardHeader>
          <CardContent>
            {successMessage ? (
              <Alert variant="default" className="border-green-500/50 text-green-700 dark:text-green-400">
                <CheckCircle className="h-4 w-4 !text-green-500" />
                <AlertTitle>Email Sent</AlertTitle>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="official@example.com"
                    className="bg-input text-foreground placeholder:text-muted-foreground"
                    disabled={isSubmitting}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            )}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Remember your password?{' '}
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
