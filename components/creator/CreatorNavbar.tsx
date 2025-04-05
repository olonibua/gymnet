'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/AuthProvider';

export default function CreatorNavbar() {
  const { user, signOut } = useAuth();

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
          <Link href="/">
            <Button variant="ghost" className="text-white hover:text-violet-400">
              Home
            </Button>
          </Link>
          
          {user ? (
            <Button 
              onClick={() => signOut()}
              variant="ghost" 
              className="text-white hover:text-violet-400"
            >
              Sign Out
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              className="text-white hover:text-violet-400"
            >
              Sign In
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
} 