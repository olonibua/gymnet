'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Github, Linkedin, Instagram, Twitter } from 'lucide-react';
import { Suspense } from 'react';

function CreatorContent() {
  return (
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
                Full Stack Developer | Designer | Entrepreneur
              </p>

              <div className="flex justify-center md:justify-start gap-4 mb-6">
                <a
                  href="https://github.com/olonibua"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors duration-200"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://linkedin.com/in/olonibua-tolulope/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors duration-200"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="https://twitter.com/itsolonts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors duration-200"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="https://instagram.com/its_olonts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors duration-200"
                >
                  <Instagram size={20} />
                </a>
              </div>

              <p className="text-zinc-300 leading-relaxed">
                A passionate developer who loves creating beautiful, functional
                applications. Focused on building intuitive user experiences
                with modern web technologies. Open to all types of website and
                app development projects.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-zinc-900/60 backdrop-blur-lg border border-zinc-800 rounded-xl p-6 md:p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">About Me</h2>
          <p className="text-zinc-300 leading-relaxed mb-4">
            I&lsquo;m a full stack developer with expertise in React, Node.js,
            and modern web technologies, as well as a prompt engineer. My
            passion lies in creating intuitive and performant applications that
            solve real-world problems.
          </p>
          <p className="text-zinc-300 leading-relaxed">
            With several years of experience in software development, I&lsquo;ve
            worked on projects ranging from e-commerce platforms to social
            networking applications. I&lsquo;m constantly learning and adapting
            to new technologies to create better user experiences.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-zinc-900/60 backdrop-blur-lg border border-zinc-800 rounded-xl p-6 md:p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Experience</h2>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-violet-400">
              Senior Developer
            </h3>
            <p className="text-zinc-400 mb-2">Crypto U | 2024 - Present</p>
            <p className="text-zinc-300">
              Led the development of multiple web applications using React,
              Next.js and Node.js. Implemented CI/CD pipelines and optimized
              application performance.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-violet-400">
              Full Stack Developer
            </h3>
            <p className="text-zinc-400 mb-2">LiLab | 2022 - 2024</p>
            <p className="text-zinc-300">
              Developed and maintained various web applications. Collaborated
              with design teams to implement responsive and accessible user
              interfaces.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-violet-400">Skills</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                "JavaScript",
                "TypeScript",
                "React",
                "Next.js",
                "Node.js",
                "Wordpress",
                "Prompt Engineerng",
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
        </motion.div>
      </div>
    </div>
  );
}

export default function CreatorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    }>
      <CreatorContent />
    </Suspense>
  );
} 