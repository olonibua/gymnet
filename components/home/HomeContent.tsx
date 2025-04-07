"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getRandomUser, searchUsers } from "@/lib/appwrite/api";
import { User } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useDebounce } from "@/hooks/useDebounce";

// Dynamically import the custom navbar
const HomeNavbar = dynamic(() => import("@/components/home/HomeNavbar"), {
  ssr: false
});

export default function HomeContent() {
  const [randomUsers, setRandomUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { user } = useAuth();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const fetchRandomUsers = async (isInitialLoad = false) => {
    try {
      const users: User[] = [];
      // Try to get 4 unique random users with complete profiles
      const maxAttempts = 8; // Limit attempts to prevent infinite loop
      let attempts = 0;

      while (users.length < 4 && attempts < maxAttempts) {
        attempts++;
        const randomUser = await getRandomUser();

        if (randomUser && !users.some((user) => user.$id === randomUser.$id)) {
          users.push(randomUser);
        }
      }

      if (users.length > 0) {
        setRandomUsers(users);
        if (isInitialLoad) {
          setInitialLoadComplete(true);
          setIsLoading(false);
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch random users";
      console.error("Random user fetch error:", errorMessage);
      if (isInitialLoad) {
        setIsLoading(false);
        setInitialLoadComplete(true);
      }
    }
  };

  useEffect(() => {
    // Only show loading on the first load
    if (!initialLoadComplete) {
      setIsLoading(true);
      // Pass true to indicate this is the initial load
      fetchRandomUsers(true);
    }

    // Set up interval for background refreshes
    const intervalId = setInterval(() => {
      // Pass false to indicate this is NOT the initial load
      fetchRandomUsers(false);
    }, 6000);

    return () => clearInterval(intervalId);
  }, [initialLoadComplete]);

  // Auto-search when debounced term changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchUsers(debouncedSearchTerm);
        setSearchResults(results);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to search users";
        console.error("Search error:", errorMessage);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedSearchTerm]);

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    searchInputRef.current?.focus();
  };

  return (
    <>
      <HomeNavbar />
      <main className="min-h-screen bg-black pt-20 pb-16">
        <div className="max-w-4xl w-full mx-auto my-8 md:my-16 text-center">
          <motion.h1
            className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 px-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500">
              Connect
            </span>{" "}
            with professionals at your gym
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-12 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover business connections and opportunities within your fitness
            community
          </motion.p>

          {/* Enhanced Search bar */}
          <motion.div
            className="w-full max-w-lg mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative">
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search by business, skill or name..."
                className="pl-10 pr-10 py-3 bg-zinc-900/70 backdrop-blur-lg border border-zinc-800 rounded-full shadow-lg text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </div>
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </motion.div>

          {/* Search results */}
          {searchTerm && (
            <div className="w-full mb-16">
              <AnimatePresence>
                {isSearching ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {searchResults.map((profile) => (
                      <ProfileCard key={profile.$id} profile={profile} />
                    ))}
                  </motion.div>
                ) : (
                  searchTerm &&
                  !isSearching && (
                    <motion.div
                      className="text-gray-400 py-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p className="mb-2">
                        No results found for &ldquo;{searchTerm}&rdquo;
                      </p>
                      <p className="text-sm text-gray-500">
                        Try a different search term or check your spelling
                      </p>
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </div>
          )}

          {/* User cards carousel - only show if not searching */}
          {!searchTerm && (
            <div className="w-full overflow-hidden my-8 sm:my-12 relative h-[260px] sm:h-[220px] carousel-mask">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
                </div>
              ) : (
                <motion.div
                  className="absolute w-[300%] flex space-x-4 animate-carousel"
                  key={randomUsers.map((user) => user.$id).join("-")}
                >
                  {randomUsers.map((randomUser, index) => (
                    <motion.div
                      key={`${randomUser.$id}-${index}`}
                      className="w-1/8 bg-zinc-900/70 backdrop-blur-lg border border-zinc-800 rounded-2xl p-4 sm:p-6 flex flex-col justify-between"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: [0.25, 1, 0.5, 1],
                      }}
                    >
                      <p className="text-lg sm:text-xl mb-2">
                        <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500">
                          {randomUser.name}
                        </span>{" "}
                        is a {randomUser.businessDescription || "professional"}{" "}
                        in your gym community
                      </p>

                      <Link
                        href={`/profile/${randomUser.$id}`}
                        className="mt-auto"
                      >
                        <Button className="mt-4 w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0">
                          View Profile
                        </Button>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!user ? (
              <>
                <Link href="/" className="w-full sm:w-auto">
                  <Button
                    className="w-full sm:w-auto px-4 sm:px-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0"
                    size="lg"
                  >
                    Explore Network
                  </Button>
                </Link>
              </>
            ) : (
              <Button
                className="w-full sm:w-auto px-4 sm:px-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white border-0"
                size="lg"
                onClick={() => fetchRandomUsers(false)}
              >
                Discover More Members
              </Button>
            )}
          </div>
        </div>

        {/* Feature cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full max-w-4xl mx-auto mt-8 mb-16 px-2"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          <FeatureCard
            title="Connect"
            description="Find professionals with complementary skills at your gym"
            icon="🔗"
          />
          <FeatureCard
            title="Network"
            description="Build relationships that go beyond workout sessions"
            icon="👥"
          />
          <FeatureCard
            title="Grow"
            description="Expand your business through local community connections"
            icon="📈"
          />
        </motion.div>
      </main>
    </>
  );
}

function ProfileCard({ profile }: { profile: User }) {
  // Early return if no profile or essential fields are missing
  if (!profile || !profile.name) {
    return null;
  }

  // Clean up the image URL
  let profileImageUrl = "";
  try {
    if (typeof profile.imageUrl === "string") {
      profileImageUrl = profile.imageUrl.startsWith('"')
        ? JSON.parse(profile.imageUrl)
        : profile.imageUrl;
    }
  } catch {
    profileImageUrl = "";
  }

  return (
    <Link href={`/profile/${profile.$id}`} className="block">
      <motion.div
        className="relative rounded-xl overflow-hidden h-[220px] group cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10" />

        {profileImageUrl ? (
          <div className="absolute inset-0">
            <Image
              src={profileImageUrl}
              alt={profile.name}
              fill
              className="object-cover transform group-hover:scale-110 transition-transform duration-700"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-profile.jpg"; // Fallback image
              }}
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-violet-800/50 to-fuchsia-800/50" />
        )}

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
          <h3 className="text-xl font-bold text-white mb-1">{profile.name}</h3>
          <p className="text-sm text-gray-200 line-clamp-2 mb-3">
            {profile.businessDescription || "Professional at your gym"}
          </p>
          <div className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-medium py-2 px-4 rounded-md text-center transition-all duration-300">
            View Profile
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <motion.div
      className="bg-zinc-900/70 backdrop-blur-lg border border-zinc-800 rounded-xl p-4 sm:p-6 text-center h-full"
      variants={{
        hidden: {
          opacity: 0,
          x: -50,
        },
        visible: {
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
      }}
    >
      <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{icon}</div>
      <h3 className="text-lg sm:text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-gray-300">{description}</p>
    </motion.div>
  );
}