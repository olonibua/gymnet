'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Github, Linkedin, Instagram, Twitter } from 'lucide-react';
import Navbar from '@/components/shared/Navbar';

export default function CreatorContent() {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <Navbar />
      <div className="min-h-screen bg-black pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-zinc-900/60 backdrop-blur-lg border border-zinc-800 rounded-xl p-6 md:p-8 mb-8"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-40 h-40 relative rounded-full overflow-hidden border-4 border-violet-500/30">
                <Image
                  src="/creator.jpg"
                  alt="Creator's profile"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 mb-2">
                  Tolu Olonibua
                </h1>

                <p className="text-zinc-400 mb-4">
                  Full Stack Developer | Entrepreneur
                </p>

                <div className="flex justify-center md:justify-start gap-4 mb-6">
                  <a
                    href="https://github.com/olonibua"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-violet-400 transition-colors"
                  >
                    <Github size={20} />
                  </a>
                  <a
                    href="https://linkedin.com/in/olonibua"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-violet-400 transition-colors"
                  >
                    <Linkedin size={20} />
                  </a>
                  <a
                    href="https://instagram.com/olonibua"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-violet-400 transition-colors"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="https://twitter.com/olonibua"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-violet-400 transition-colors"
                  >
                    <Twitter size={20} />
                  </a>
                </div>

                <p className="text-zinc-300 mb-6">
                  Hey there! I&lsquo;m Tolu, a passionate developer who created
                  this platform to help gym members connect professionally. When
                  I&lsquo;m not coding, you can find me in the gym or exploring
                  new technologies.
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-violet-400">
                  About Me
                </h3>
                <p className="text-zinc-300 mt-2">
                  I&lsquo;m a full-stack developer with expertise in React,
                  Next.js, and modern web technologies. I enjoy building
                  beautiful, functional applications that solve real problems.
                  This platform is my attempt to combine my passion for fitness
                  and technology.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-violet-400">
                  Experience
                </h3>
                <p className="text-zinc-400 mb-2">LiLab | 2022 - 2024</p>
                <p className="text-zinc-300">
                  Developed and maintained various web applications.
                  Collaborated with design teams to implement responsive and
                  accessible user interfaces.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-violet-400">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    "JavaScript",
                    "TypeScript",
                    "React",
                    "Next.js",
                    "Node.js",
                    "Wordpress",
                    "Prompt Engineering",
                    "CSS/SCSS",
                    "Tailwind CSS",
                    "GraphQL",
                    "SQL",
                    "NoSQL",
                    "AWS",
                    "Git",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 