'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, signInWithProvider, signOut as appwriteSignOut } from '@/lib/appwrite/api';
import { AuthContextType, User } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { account } from '@/lib/appwrite/client';

const INITIAL_USER = null;

const AuthContext = createContext<AuthContextType>({
  user: INITIAL_USER,
  isLoading: true,
  setUser: () => {},
  checkAuthStatus: async () => false,
  signInWithProvider: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check URL for auth success/error params
  useEffect(() => {
    const authSuccess = searchParams.get('auth_success');
    const authError = searchParams.get('auth_error');
    
    if (authSuccess) {
      checkAuthStatus();
    }
    
    if (authError) {
      console.error('Authentication error:', authError);
        }
    }, [searchParams]);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      // Check if user is authenticated first
      let session;
      try {
        session = await account.getSession('current');
      } catch (e) {
        // This error is expected for unauthenticated users - don't log it
        setUser(null);
        setIsLoading(false);
        return false;
      }
      
      // If we have a session, get the account
      if (!session) {
        setUser(null);
        setIsLoading(false);
        return false;
      }
      
      const currentAccount = await account.get();
      
      if (!currentAccount) {
        setUser(null);
        setIsLoading(false);
        return false;
      }
      
      // Try to get user from database
      try {
        const currentUser = await getCurrentUser();
        
        if (currentUser) {
          setUser(currentUser as unknown as User);
          
          // Redirect to profile if 'auth_success' is in URL
          if (searchParams.get('auth_success')) {
            router.push(`/profile/${currentUser.$id}`);
          }
          
          return true;
        } else {
          // User is authenticated but profile doesn't exist
          setUser(null);
          return false;
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user profile';
        console.error('User profile error:', errorMessage);
        setUser(null);
        return false;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication check failed';
      console.error('Auth status check error:', errorMessage);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInWithProvider = async (provider: string) => {
    try {
      setIsLoading(true);
      await signInWithProvider(provider);
      // No need to navigate or set user here as we'll handle that in the callback
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      console.error('Sign in error:', errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await appwriteSignOut();
      setUser(null);
      router.push('/');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed';
      console.error('Sign out error:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    checkAuthStatus,
    signInWithProvider: handleSignInWithProvider,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext); 