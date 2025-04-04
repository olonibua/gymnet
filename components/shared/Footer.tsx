import Link from 'next/link';
import { Github, Linkedin, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-900/60 backdrop-blur-lg py-6 border-t border-zinc-800">
      <div className="container max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-zinc-400 text-sm">
            © {new Date().getFullYear()} Gym Business Network
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <Link 
            href="/creator" 
            className="text-zinc-400 hover:text-violet-400 transition-colors duration-200 text-sm"
          >
            About the Creator
          </Link>
          
        </div>
      </div>
    </footer>
  );
} 