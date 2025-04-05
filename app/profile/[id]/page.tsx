'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { getUserById } from '@/lib/appwrite/api';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/providers/AuthProvider';
import Image from 'next/image';
import { EditProfileModal } from '@/components/modals/EditProfileModal';
import { MutualPlacesSection } from '@/components/features/MutualPlacesSection';
import { LikeButton } from '@/components/features/LikeButton';
import { ShareButton } from '@/components/features/ShareButton';

export default function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { user } = useAuth();
  
  const isOwnProfile = user?.$id === id;
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (typeof id !== 'string') return;
        
        const fetchedProfile = await getUserById(id);
        setProfile(fetchedProfile as unknown as User);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
        console.error('Profile fetch error:', errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [id]);
  
  if (loading) {
    return <ProfileSkeleton />;
  }
  
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gradient-bg p-4">
        <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }
  
  // Make sure socialLinks is properly parsed
  const socialLinks = (() => {
    if (!profile.socialLinks) return {};
    
    if (typeof profile.socialLinks === 'string') {
      try {
        return JSON.parse(profile.socialLinks);
      } catch (e) {
        console.error("Error parsing social links:", e);
        return {};
      }
    }
    
    return profile.socialLinks;
  })();
  
  return (
    <div className="flex flex-col min-h-screen gradient-bg p-4 sm:p-8">
      <div className="max-w-4xl w-full mx-auto my-8">
        <motion.div
          className="glass-card rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <div className="relative h-40 sm:h-60 bg-gradient-to-r from-purple-800 to-blue-800">
            <div className="absolute -bottom-16 left-8">
              {profile.imageUrl ? (
                <div className="w-[120px] h-[120px]">
                  {(() => {
                    let cleanUrl = profile.imageUrl;

                    try {
                      // If it's a JSON string with quotes and escapes, parse it properly
                      if (typeof cleanUrl === "string") {
                        // First, try direct JSON parse if it starts with a quote
                        if (
                          cleanUrl.startsWith('"') ||
                          cleanUrl.includes('\\"')
                        ) {
                          try {
                            cleanUrl = JSON.parse(cleanUrl);
                          } catch  {
                            // If that fails, try removing manual escapes and quotes
                            cleanUrl = cleanUrl
                              .replace(/\\/g, "")
                              .replace(/^"(.+)"$/, "$1");
                          }
                        }
                      }

                      // Now validate URL
                      new URL(cleanUrl);

                      return (
                        <Image
                          src={cleanUrl}
                          alt={profile.name}
                          width={120}
                          height={120}
                          className="rounded-full border-4 border-black object-cover w-full h-full"
                          priority
                        />
                      );
                    } catch (e) {
                      console.error(
                        "Profile image error:",
                        e,
                        "URL was:",
                        cleanUrl
                      );
                      // Fallback
                      return (
                        <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center text-3xl font-bold border-4 border-black">
                          {profile.name.charAt(0)}
                        </div>
                      );
                    }
                  })()}
                </div>
              ) : (
                <div className="w-[120px] h-[120px] rounded-full bg-gray-700 flex items-center justify-center text-3xl font-bold border-4 border-black">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <p className="text-gray-400">@{profile.username}</p>
              </div>

              <div className="flex gap-2">
                {isOwnProfile ? (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <LikeButton profileId={profile.$id || ""} />
                    <ShareButton
                      profileId={profile.$id || ""}
                      name={profile.name}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Business Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2 gradient-text">
                About
              </h2>
              <p className="text-gray-300">
                {profile.businessDescription ||
                  "No business description available."}
              </p>
            </div>

            {/* Contact Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 gradient-text">
                Contact Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass-card rounded-lg p-4">
                  <h3 className="font-medium mb-1">Email</h3>
                  <p className="text-gray-300">{profile.email}</p>
                </div>

                {profile.contactDetails?.phone && (
                  <div className="glass-card rounded-lg p-4">
                    <h3 className="font-medium mb-1">Phone</h3>
                    <p className="text-gray-300">
                      {profile.contactDetails.phone}
                    </p>
                  </div>
                )}

                {profile.contactDetails?.website && (
                  <div className="glass-card rounded-lg p-4">
                    <h3 className="font-medium mb-1">Website</h3>
                    <a
                      href={profile.contactDetails.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {profile.contactDetails.website}
                    </a>
                  </div>
                )}

                {profile.contactDetails?.address && (
                  <div className="glass-card rounded-lg p-4">
                    <h3 className="font-medium mb-1">Address</h3>
                    <p className="text-gray-300">
                      {profile.contactDetails.address}
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Social Links */}
            {Object.values(socialLinks).some((link) => !!link) && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 gradient-text">
                  Connect
                </h2>
                <div className="flex gap-4">
                  {socialLinks?.instagram && (
                    <SocialLink
                      href={socialLinks.instagram}
                      platform="Instagram"
                    />
                  )}
                  {socialLinks?.linkedin && (
                    <SocialLink
                      href={socialLinks.linkedin}
                      platform="LinkedIn"
                    />
                  )}
                  {socialLinks?.twitter && (
                    <SocialLink href={socialLinks.twitter} platform="Twitter" />
                  )}
                  {socialLinks?.facebook && (
                    <SocialLink
                      href={socialLinks.facebook}
                      platform="Facebook"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Mutual Places */}
            {!isOwnProfile && user && (
              <MutualPlacesSection
                userLocations={profile.gymLocations || []}
                currentUserLocations={user.gymLocations || []}
              />
            )}
            {/* Work Images */}
            {profile.workImages && (
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-3">Work Portfolio</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(() => {
                    let images = [];
                    
                    try {
                      // Handle different formats of workImages
                      if (typeof profile.workImages === "string") {
                        try {
                          // Try parsing if it's a JSON string
                          images = JSON.parse(profile.workImages);
                        } catch (parseError) {
                          console.error("WorkImages parse error:", parseError);
                          images = []; // Reset to empty if corrupted
                        }
                      } else if (Array.isArray(profile.workImages)) {
                        images = profile.workImages;
                      }
                      
                      // Check array is properly formed before continuing
                      if (!Array.isArray(images) || images.length === 0) {
                        return (
                          <p className="text-gray-400">
                            No portfolio images available
                          </p>
                        );
                      }
                      
                      // Filter out invalid URLs
                      const validImages = images.filter((img: unknown) => {
                        if (!img) return false;
                        
                        try {
                          if (typeof img === "string") {
                            // Clean the URL string if needed
                            let cleanImg = img;
                            if (img.startsWith('"') || img.includes('\\"')) {
                              try {
                                cleanImg = JSON.parse(img);
                              } catch {
                                cleanImg = img
                                  .replace(/\\/g, "")
                                  .replace(/^"(.+)"$/, "$1");
                              }
                            }
                            
                            new URL(cleanImg);
                            return true;
                          }
                          return false;
                        } catch {
                          return false;
                        }
                      });
                      
                      if (validImages.length === 0) {
                        return (
                          <p className="text-gray-400">
                            No valid portfolio images available
                          </p>
                        );
                      }
                      
                      return validImages.map(
                        (image: unknown, index: number) => {
                          // Similar cleaning logic for the image URLs when rendering
                          let imgUrl = "";
                          if (typeof image === "string") {
                            try {
                              imgUrl = image.startsWith('"')
                                ? JSON.parse(image)
                                : image
                                    .replace(/\\/g, "")
                                    .replace(/^"(.+)"$/, "$1");
                            } catch {
                              // If parsing fails, use the string directly
                              imgUrl = image;
                            }
                          }
                          
                          return (
                            <div
                              key={index}
                              className="rounded-lg overflow-hidden aspect-square"
                            >
                              <Image
                                src={imgUrl}
                                alt={`Work by ${profile.name}`}
                                width={300}
                                height={300}
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/placeholder-image.jpg"; // Fallback image
                                }}
                              />
                            </div>
                          );
                        }
                      );
                    } catch (error: unknown) {
                      const errorMessage =
                        error instanceof Error
                          ? error.message
                          : "Failed to render images";
                      console.error("Image rendering error:", errorMessage);
                      return (
                        <p className="text-gray-400">
                          Error loading portfolio images
                        </p>
                      );
                    }
                  })()}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {isOwnProfile && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={profile}
          onUpdate={setProfile}
        />
      )}
    </div>
  );
}

function SocialLink({ href, platform }: { href: string; platform: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-card rounded-full py-2 px-4 text-sm flex items-center gap-2 hover:bg-gray-800 transition-colors"
    >
      <span>{platform}</span>
    </a>
  );
}

function ProfileSkeleton() {
  return (
    <div className="flex flex-col min-h-screen gradient-bg p-4 sm:p-8">
      <div className="max-w-4xl w-full mx-auto my-8">
        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Header Skeleton */}
          <Skeleton className="h-40 sm:h-60 w-full" />

          {/* Avatar Skeleton */}
          <div className="relative h-16">
            <div className="absolute -top-16 left-8">
              <Skeleton className="w-[120px] h-[120px] rounded-full" />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="pt-8 px-8 pb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32 mb-8" />
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-8" />
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full mb-2" />
              <Skeleton className="h-24 w-full mb-2" />
              <Skeleton className="h-24 w-full mb-2" />
              <Skeleton className="h-24 w-full mb-8" />
            </div>
            
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Skeleton className="h-48 w-full mb-8" />
              <Skeleton className="h-48 w-full mb-8" />
              <Skeleton className="h-48 w-full mb-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}