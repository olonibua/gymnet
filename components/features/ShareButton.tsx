'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface ShareButtonProps {
  profileId: string;
  name: string;
}

export function ShareButton({ profileId, name }: ShareButtonProps) {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const profileUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/profile/${profileId}` 
    : '';

  const shareOptions = [
    {
      name: 'Copy Link',
      action: () => {
        navigator.clipboard.writeText(profileUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    },
    {
      name: 'Email',
      action: () => {
        window.open(`mailto:?subject=Check out ${name}'s profile&body=I found this profile on Gym Business Network: ${profileUrl}`);
      }
    },
    {
      name: 'LinkedIn',
      action: () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`);
      }
    },
    {
      name: 'Twitter',
      action: () => {
        window.open(`https://twitter.com/intent/tweet?text=Check out ${name}'s profile on Gym Business Network&url=${encodeURIComponent(profileUrl)}`);
      }
    }
  ];

  return (
    <div className="relative">
      <Button 
        variant="outline"
        onClick={() => setShowShareOptions(!showShareOptions)}
      >
        Share
      </Button>

      <AnimatePresence>
        {showShareOptions && (
          <motion.div 
            className="absolute right-0 mt-2 w-48 rounded-md glass-card overflow-hidden z-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="py-1">
              {shareOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    option.action();
                    if (option.name !== 'Copy Link') {
                      setShowShareOptions(false);
                    }
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-800"
                >
                  {option.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {copySuccess && (
          <motion.div 
            className="fixed bottom-4 right-4 bg-green-500/90 text-white px-4 py-2 rounded-md z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            Link copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 