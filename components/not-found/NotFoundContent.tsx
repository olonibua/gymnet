'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFoundContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-zinc-900/60 backdrop-blur-lg border border-zinc-800 rounded-xl p-8"
      >
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 mb-4">
          Page Not Found
        </h1>
        <p className="text-zinc-300 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <Button
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
          >
            Return Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
} 