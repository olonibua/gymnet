'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { SignInModal } from '@/components/modals/SignInModal';
import { SignUpModal } from '@/components/modals/SignUpModal';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 py-4 px-4 md:px-8 transition-all duration-300 ${
      isScrolled ? 'bg-black/80 backdrop-blur-md shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold gradient-text">
          GymNet
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-200 hover:text-white transition-colors">
            Home
          </Link>
          {user && (
            <Link href={`/profile/${user.$id}`} className="text-gray-200 hover:text-white transition-colors">
              My Profile
            </Link>
          )}
          
          
          {!user ? (
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsSignInOpen(true)}
              >
                Sign In
              </Button>
              <Button 
                variant="default"
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500" 
                size="sm" 
                onClick={() => setIsSignUpOpen(true)}
              >
                Join
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={signOut}
            >
              Sign Out
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden bg-black/95 backdrop-blur-lg absolute left-0 right-0 shadow-md"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col px-4 py-6 space-y-4">
              <Link 
                href="/" 
                className="text-gray-200 hover:text-white transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              {user && (
                <Link 
                  href={`/profile/${user.$id}`} 
                  className="text-gray-200 hover:text-white transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
              )}
              <Link 
                href="/explore" 
                className="text-gray-200 hover:text-white transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Explore
              </Link>
              
              {!user ? (
                <div className="flex flex-col space-y-3 pt-3">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsSignInOpen(true);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button 
                    variant="default"
                    className="bg-gradient-to-r from-violet-500 to-fuchsia-500" 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsSignUpOpen(true);
                    }}
                  >
                    Join Now
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    signOut();
                  }}
                  className="mt-3"
                >
                  Sign Out
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} openSignUp={() => {
        setIsSignInOpen(false);
        setIsSignUpOpen(true);
      }} />
      
      <SignUpModal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} openSignIn={() => {
        setIsSignUpOpen(false);
        setIsSignInOpen(true);
      }} />
    </nav>
  );
} 