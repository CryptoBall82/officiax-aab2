
// src/app/api/google/exchange-token/route.ts
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, clientRedirectUri } = await request.json();

    console.log("[API /google/exchange-token] Received auth code:", code ? code.substring(0,15)+"..." : "MISSING_CODE");
    console.log("[API /google/exchange-token] Received clientRedirectUri:", clientRedirectUri || "MISSING_CLIENT_REDIRECT_URI");

    if (!code) {
      console.error("[API /google/exchange-token] Authorization code is missing from request body.");
      return NextResponse.json({ error: 'Authorization code is missing', details: { message: "Authorization code not found in the request payload."} }, { status: 400 });
    }
    if (!clientRedirectUri) {
      console.error("[API /google/exchange-token] clientRedirectUri is missing from request body.");
      return NextResponse.json({ error: 'clientRedirectUri is missing from request body', details: { message: "clientRedirectUri not found in the request payload."} }, { status: 400 });
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    console.log("[API /google/exchange-token] NEXT_PUBLIC_GOOGLE_CLIENT_ID:", clientId ? `Present (starts with ${clientId.substring(0,10)}...)` : "MISSING_CLIENT_ID_ENV_VAR");
    console.log("[API /google/exchange-token] GOOGLE_CLIENT_SECRET:", clientSecret ? `Present (length: ${clientSecret?.length})` : "MISSING_CLIENT_SECRET_ENV_VAR");


    if (!clientId || !clientSecret) {
      console.error('[API /google/exchange-token] Google Client ID or Client Secret is not configured on the server via environment variables.');
      return NextResponse.json({
        error: 'Server configuration error for Google OAuth (ID or Secret environment variable missing)',
        details: {
            message: "One or both Google OAuth credentials (Client ID, Client Secret) are missing from server environment variables (NEXT_PUBLIC_GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET). Please check server logs for NEXT_PUBLIC_GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
            clientIdEnvVarPresent: !!clientId,
            clientSecretEnvVarPresent: !!clientSecret,
        }
      }, { status: 500 });
    }
    
    const determinedRedirectUri = clientRedirectUri; 
    console.log("[API /google/exchange-token] Using Redirect URI for token exchange (from client):", determinedRedirectUri);


    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const params = new URLSearchParams({
      code: code as string,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: determinedRedirectUri,
      grant_type: 'authorization_code',
    });

    console.log("[API /google/exchange-token] Params for Google token endpoint (excluding client_secret):", `code=${code ? code.substring(0,15)+"..." : "MISSING_CODE"}&client_id=${clientId}&redirect_uri=${determinedRedirectUri}&grant_type=authorization_code`);

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const tokens = await response.json();

    if (!response.ok) {
      console.error('[API /google/exchange-token] Google token exchange error. Status:', response.status, 'Response:', JSON.stringify(tokens, null, 2));
      return NextResponse.json({
        error: tokens.error_description || tokens.error || `Failed to exchange token with Google (${response.status})`,
        details: {
          googleResponse: tokens,
          requestParams: {
            code_present: !!code,
            client_id_present: !!clientId,
            // Do not log client_secret presence directly here, use env var checks above
            redirect_uri_used: determinedRedirectUri,
            grant_type: 'authorization_code',
          },
          message: "Error during token exchange with Google. Check redirect_uri matching and client credentials.",
          clientSentRedirectUri: clientRedirectUri,
        }
      }, { status: response.status });
    }

    console.log("[API /google/exchange-token] Token exchange successful. Scope:", tokens.scope);
    return NextResponse.json({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in,
      scope: tokens.scope,
      tokenType: tokens.token_type,
    });

  } catch (error: any) { 
    console.error('[API /google/exchange-token] CRITICAL UNHANDLED ERROR IN API ROUTE:', error);
    
    // Return a very simple, guaranteed serializable error response
    return NextResponse.json({ 
        error: 'Critical Internal Server Error', 
        message: 'An unexpected error occurred on the server during token exchange. Please check server logs.',
        // Optionally include a generic error code or type for client-side handling if needed
        errorCode: 'API_UNHANDLED_EXCEPTION' 
    }, { status: 500 });
  }
}
