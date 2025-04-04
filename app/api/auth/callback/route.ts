import { NextRequest, NextResponse } from 'next/server';
import { account } from '@/lib/appwrite/client';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const secret = url.searchParams.get('secret');

    if (!userId || !secret) {
      console.error('Missing OAuth callback parameters:', { userId, secret, url: url.toString() });
      return NextResponse.redirect(new URL('/?auth_error=missing_params', request.url));
    }

    // Create session for the user
    await account.createSession(userId, secret);
    
    // Redirect to home page with success
    return NextResponse.redirect(new URL('/?auth_success=true', request.url));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'OAuth authentication failed';
    console.error('OAuth callback error:', errorMessage);
    return NextResponse.redirect(new URL(`/?auth_error=${encodeURIComponent(errorMessage)}`, request.url));
  }
} 