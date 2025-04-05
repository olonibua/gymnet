'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/AuthProvider';
import { useState } from 'react';

export default function HomeNavbar() {
  const { user, signOut } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-zinc-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500">
              GymNet
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/creator">
            <Button
              variant="ghost"
              className="text-white hover:text-violet-400"
            >
              About
            </Button>
          </Link>

          {user ? (
            <>
              <Link href={`/profile/${user.$id}`}>
                <Button
                  variant="ghost"
                  className="text-white hover:text-violet-400"
                >
                  My Profile
                </Button>
              </Link>
              <Button
                onClick={() => signOut()}
                variant="ghost"
                className="text-white hover:text-violet-400"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              className="text-white hover:text-violet-400"
              onClick={() => setIsSignInOpen(true)}
            >
              Sign In
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
} 