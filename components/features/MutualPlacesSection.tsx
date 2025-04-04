'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MutualPlacesSectionProps {
  userLocations: string[] | string;
  currentUserLocations: string[] | string;
}

export function MutualPlacesSection({ userLocations, currentUserLocations }: MutualPlacesSectionProps) {
  // Parse userLocations if it's a string
  const parsedUserLocations = Array.isArray(userLocations) 
    ? userLocations 
    : typeof userLocations === 'string' 
      ? JSON.parse(userLocations || '[]') 
      : [];
  
  // Parse currentUserLocations if it's a string
  const parsedCurrentUserLocations = Array.isArray(currentUserLocations) 
    ? currentUserLocations 
    : typeof currentUserLocations === 'string' 
      ? JSON.parse(currentUserLocations || '[]') 
      : [];
  
  // Now filter using the parsed arrays
  const mutualLocations = parsedUserLocations.filter((location: string) => 
    parsedCurrentUserLocations.includes(location)
  );
  
  if (mutualLocations.length === 0) return null;
  
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold gradient-text">Mutual Places</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mutualLocations.map((location : string, index: string) => (
          <div 
            key={index}
            className="glass-card rounded-lg p-4 flex items-center gap-3"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium">
              {location.charAt(0)}
            </div>
            <span>{location}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
} 