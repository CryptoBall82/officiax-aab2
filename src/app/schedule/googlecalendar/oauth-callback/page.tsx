// src/app/schedule/googlecalendar/oauth-callback/page.tsx
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; // Import useRouter
import { DefaultHeader } from '@/components/DefaultHeader';
import { NavbarSchedule } from '@/components/NavbarSchedule';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  scope: string;
  tokenType: string;
}

interface ErrorDetails {
  googleResponse?: any;
  requestParams?: {
    code_present?: boolean;
    client_id_present?: boolean;
    client_secret_present?: boolean;
    redirect_uri_used?: string;
    grant_type?: string;
  };
  message?: string;
  stack?: string;
  clientIdPresent?: boolean;
  clientSecretPresent?: boolean;
  determinedRedirectUri?: string;
}

function GoogleOAuthCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter(); // Initialize router
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<ErrorDetails | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');
    const errorDescriptionParam = searchParams.get('error_description');

    if (errorParam) {
      setErrorMessage(errorDescriptionParam || `Google OAuth Error: ${errorParam}`);
      setStatus('error');
      return;
    }

    if (code) {
      setAuthCode(code);
      const exchangeToken = async (authCodeValue: string) => {
        try {
          const clientRedirectUri = (typeof window !== "undefined" ? window.location.origin : '') + '/schedule/googlecalendar/oauth-callback';
          console.log("[OAuth Callback] Client-determined redirect_uri for API call:", clientRedirectUri);

          const response = await fetch('/api/google/exchange-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: authCodeValue, clientRedirectUri: clientRedirectUri }),
          });

          const data = await response.json();

          if (!response.ok) {
            setErrorMessage(data.error || 'Failed to exchange token');
            setErrorDetails(data.details || null);
            console.error("Token exchange error from API route. Status:", response.status, "Response data:", data);
            setStatus('error');
            return;
          }
          
          // Store tokens in localStorage
          localStorage.setItem('google_access_token', data.accessToken);
          if (data.refreshToken) {
            localStorage.setItem('google_refresh_token', data.refreshToken);
          }
          const expiryTime = new Date().getTime() + data.expiresIn * 1000;
          localStorage.setItem('google_token_expiry_time', expiryTime.toString());
          localStorage.setItem('google_token_scope', data.scope);
          console.log("[OAuth Callback] Tokens stored in localStorage.");

          setTokenData(data); // Set token data for potential brief display
          setStatus('success');
          
          // Redirect after successful token exchange
          router.push('/schedule/googlecalendar');

        } catch (err: any) {
          console.error("Fetch call to /api/google/exchange-token failed:", err);
          setErrorMessage(err.message || 'An unexpected error occurred during token exchange.');
          setErrorDetails({ message: err.message });
          setStatus('error');
        }
      };
      exchangeToken(code);
    } else {
      setErrorMessage('Authorization code not found in URL.');
      setStatus('error');
    }
  }, [searchParams, router]); // Added router to dependency array

  // If status becomes 'success', the redirect will happen. 
  // The content below is mainly for loading and error states, or if redirect fails.
  return (
    <Card className="w-full max-w-md bg-card shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-foreground">Google Calendar Authentication</CardTitle>
        <CardDescription className="text-muted-foreground">
          Processing your Google Calendar authentication...
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center text-center p-6">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Processing authorization code...</p>
          </div>
        )}
        {status === 'success' && tokenData && ( // This content will be briefly visible before redirect
          <Alert variant="default" className="border-green-500/50 text-green-700 dark:text-green-400">
            <CheckCircle className="h-4 w-4 !text-green-500" />
            <AlertTitle>Token Exchange Successful!</AlertTitle>
            <AlertDescription>
              <div>Access token received. Redirecting...</div>
              <div className="mt-2 text-xs">Access Token (first 20 chars for dev): <pre className="whitespace-pre-wrap break-all bg-muted p-1 rounded-sm">{tokenData.accessToken.substring(0,20)}...</pre></div>
              {tokenData.refreshToken && <div className="mt-1 text-xs">Refresh Token received.</div>}
            </AlertDescription>
          </Alert>
        )}
        {status === 'error' && errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Process Failed</AlertTitle>
            <AlertDescription>
              <div>{errorMessage}</div>
              {authCode && (!tokenData || errorDetails) && (
                <div className="mt-2 text-xs">Auth Code (for dev): <pre className="whitespace-pre-wrap break-all bg-muted p-1 rounded-sm">{authCode}</pre></div>
              )}
              {errorDetails && (
                <div className="mt-3 pt-3 border-t border-destructive/50">
                  <h4 className="font-semibold text-xs mb-1">Debugging Details:</h4>
                  {errorDetails.message && <div className="text-xs">Message: {errorDetails.message}</div>}
                  {errorDetails.determinedRedirectUri && <div className="text-xs mt-1">Redirect URI Sent by Client to API: <pre className="whitespace-pre-wrap break-all bg-muted p-1 rounded-sm text-xs mt-1">{errorDetails.determinedRedirectUri}</pre></div>}
                  {errorDetails.requestParams?.redirect_uri_used && <div className="text-xs mt-1">Redirect URI Sent by API to Google: <pre className="whitespace-pre-wrap break-all bg-muted p-1 rounded-sm text-xs mt-1">{errorDetails.requestParams.redirect_uri_used}</pre></div>}
                  {errorDetails.googleResponse && (
                    <div className="mt-1 text-xs">
                      Google&apos;s Response (to API):
                      <pre className="whitespace-pre-wrap break-all bg-muted p-1 rounded-sm text-xs mt-1">
                        {JSON.stringify(errorDetails.googleResponse, null, 2)}
                      </pre>
                    </div>
                  )}
                   {errorDetails.clientIdPresent !== undefined && <div className="text-xs mt-1">Server Client ID Present: {String(errorDetails.clientIdPresent)}</div>}
                   {errorDetails.clientSecretPresent !== undefined && <div className="text-xs">Server Client Secret Present: {String(errorDetails.clientSecretPresent)}</div>}
                   {errorDetails.stack && <div className="mt-1 text-xs">Stack (dev only): <pre className="whitespace-pre-wrap break-all bg-muted p-1 rounded-sm text-xs mt-1">{errorDetails.stack}</pre></div>}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
        <Button asChild variant="outline" className="mt-6">
          <Link href="/schedule/googlecalendar">Back to Google Calendar Setup</Link>
        </Button>
         <Button asChild variant="link" className="mt-2">
          <Link href="/schedule">Go to Main Schedule Page</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

const LoadingFallback = () => (
  <Card className="w-full max-w-md bg-card shadow-xl">
    <CardHeader className="text-center">
      <CardTitle className="text-2xl font-bold text-foreground">Processing Authentication</CardTitle>
      <CardDescription className="text-muted-foreground">
        Please wait a moment...
      </CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col items-center justify-center p-6">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
    </CardContent>
  </Card>
);

export default function GoogleOAuthCallbackPage() {
  return (
    <div className="flex flex-col h-screen items-center mx-auto max-w-[500px] bg-background">
      <DefaultHeader />
      <main className="flex-grow w-full flex flex-col items-center justify-center p-4 pt-[90px] pb-[90px]">
        <Suspense fallback={<LoadingFallback />}>
          <GoogleOAuthCallbackContent />
        </Suspense>
      </main>
      <NavbarSchedule />
    </div>
  );
}
