'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, signInWithProvider, signOut as appwriteSignOut } from '@/lib/appwrite/api';
import { AuthContextType, User } from '@/types';

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
  const [isMounted, setIsMounted] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    setIsMounted(true);
    checkAuthStatus();
  }, []);

  // Check URL params only on client-side after mounting
  useEffect(() => {
    if (!isMounted) return;
    
    try {
      const url = new URL(window.location.href);
      const authSuccess = url.searchParams.get('auth_success');
      const authError = url.searchParams.get('auth_error');
      
      if (authSuccess) {
        checkAuthStatus();
      }
      
      if (authError) {
        console.error('Authentication error:', authError);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error parsing URL';
      console.error("Auth URL parameter check failed:", errorMessage);
    }
  }, [isMounted]);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const documentUser = await getCurrentUser();
      
      // Transform Document to User or set null
      const userObj = documentUser ? {
        $id: documentUser.$id,
        accountId: documentUser.accountId || '',
        email: documentUser.email || '',
        name: documentUser.name || '',
        username: documentUser.username || '',
        imageUrl: documentUser.imageUrl || '',
        bio: documentUser.bio || '',
        location: documentUser.location || '',
        businessDescription: documentUser.businessDescription || '',
        // Add missing properties with defaults
        contactDetails: documentUser.contactDetails || {},
        workImages: documentUser.workImages || [],
        socialLinks: documentUser.socialLinks || {},
        gymLocations: documentUser.gymLocations || []
      } as User : null;
      
      setUser(userObj);
      return !!userObj;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check auth status';
      console.error("Auth status check failed:", errorMessage);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInWithProvider = async () => {
    try {
      await signInWithProvider();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
      console.error("Sign in failed:", errorMessage);
    }
  };

  const handleSignOut = async () => {
    try {
      await appwriteSignOut();
      setUser(null);
      window.location.href = '/';
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign out';
      console.error("Sign out failed:", errorMessage);
    }
  };

  const value = {
    user,
    isLoading,
    setUser,
    checkAuthStatus,
    signInWithProvider: handleSignInWithProvider,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext); 