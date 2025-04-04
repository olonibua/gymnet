'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAuth } from '@/providers/AuthProvider';
import { databases, appwriteConfig } from '@/lib/appwrite/client';
import { ID, Query } from 'appwrite';

interface LikeButtonProps {
  profileId: string;
}

export function LikeButton({ profileId }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkIfLiked = async () => {
      if (!user) return;

      try {
        const response = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.likesCollectionId,
          [
            Query.equal('userId', user.$id || ''),
            Query.equal('profileId', profileId)
          ]
        );

        setIsLiked(response.documents.length > 0);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to check like status';
        console.error('Like check error:', errorMessage);
      }
    };

    checkIfLiked();
  }, [user, profileId]);

  const handleLike = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      if (isLiked) {
        // Find the like document and delete it
        const response = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.likesCollectionId,
          [
            Query.equal('userId', user.$id || ''),
            Query.equal('profileId', profileId)
          ]
        );

        if (response.documents.length > 0) {
          await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.likesCollectionId,
            response.documents[0].$id
          );
        }

        setIsLiked(false);
      } else {
        // Create a new like
        await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.likesCollectionId,
          ID.unique(),
          {
            userId: user.$id,
            profileId: profileId,
            createdAt: new Date().toISOString()
          }
        );

        setIsLiked(true);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update like status';
      console.error('Like update error:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant={isLiked ? 'default' : 'outline'}
      onClick={handleLike}
      disabled={isLoading || !user}
    >
      {isLiked ? (
        <motion.span 
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-1"
        >
          <span>Liked</span>
        </motion.span>
      ) : (
        <span>Like</span>
      )}
    </Button>
  );
} 