'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User } from '@/types';
import { updateUser, uploadFile } from '@/lib/appwrite/api';
import { X } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdate: (user: User) => void;
}

export function EditProfileModal({ isOpen, onClose, user, onUpdate }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    businessDescription: user.businessDescription || '',
    phone: user.contactDetails?.phone || '',
    website: user.contactDetails?.website || '',
    address: user.contactDetails?.address || '',
    instagram: user.socialLinks?.instagram || '',
    linkedin: user.socialLinks?.linkedin || '',
    twitter: user.socialLinks?.twitter || '',
    facebook: user.socialLinks?.facebook || '',
    gymLocations: Array.isArray(user.gymLocations) 
      ? user.gymLocations.join(', ') 
      : typeof user.gymLocations === 'string'
        ? JSON.parse(user.gymLocations || '[]').join(', ')
        : '',
  });
  
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [workImages, setWorkImages] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [existingWorkImages, setExistingWorkImages] = useState<string[]>(() => {
    
    
    try {
      if (Array.isArray(user.workImages)) {
        return user.workImages;
      }
      
      if (typeof user.workImages === 'string') {
        try {
          const parsed = JSON.parse(user.workImages || '[]');
          return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          console.error("Error parsing workImages:", e);
          return [];
        }
      }
      
      return [];
    } catch (e) {
      console.error("Error setting up workImages:", e);
      return [];
    }
  });

  const [compressingImages, setCompressingImages] = useState(false);
  const workImagesInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      if (Array.isArray(user.workImages)) {
        setExistingWorkImages(user.workImages);
      } else if (typeof user.workImages === 'string') {
        const parsed = JSON.parse(user.workImages || '[]');
        setExistingWorkImages(Array.isArray(parsed) ? parsed : []);
      }
    } catch (e) {
      console.error("Error updating workImages on user change:", e);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          
          let width = img.width;
          let height = img.height;
          
          const maxDimension = 1200;
          
          if (width > height && width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Could not get canvas context'));
          
          ctx.drawImage(img, 0, 0, width, height);
          
          let quality = 0.7;
          
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error('Could not create image blob'));
              
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              
              resolve(compressedFile);
            },
            'image/jpeg',
            quality
          );
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
    });
  };

  const handleWorkImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const totalImagesAfterAdd = existingWorkImages.length + e.target.files.length;
    
    if (totalImagesAfterAdd > 4) {
      alert(`You can only have a maximum of 4 work images. You currently have ${existingWorkImages.length} images.`);
      if (workImagesInputRef.current) {
        workImagesInputRef.current.value = '';
      }
      return;
    }
    
    setCompressingImages(true);
    
    try {
      const filesToCompress = Array.from(e.target.files);
      const compressPromises = filesToCompress.map(file => compressImage(file));
      const compressedFiles = await Promise.all(compressPromises);
      
      setWorkImages(compressedFiles);
      if (workImagesInputRef.current) {
        workImagesInputRef.current.value = '';
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to compress images';
      console.error('Image compression error:', errorMessage);
      alert('An error occurred while processing images. Please try again.');
    } finally {
      setCompressingImages(false);
    }
  };

  const handleDeleteWorkImage = (index: number) => {
    setExistingWorkImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!user.$id) {
        throw new Error('User ID is missing');
      }
      
      let imageUrl = user.imageUrl;
      
      if (profileImage) {
        imageUrl = await uploadFile(profileImage);
      }
      
      
      let allWorkImages = [...existingWorkImages];
      
      if (workImages.length > 0) {
        const uploadPromises = workImages.map(image => uploadFile(image));
        const newWorkImageUrls = await Promise.all(uploadPromises);
        allWorkImages = [...allWorkImages, ...newWorkImageUrls];
      }
      
      
      if (allWorkImages.length > 5) {
        allWorkImages = allWorkImages.slice(-5);
      }
      
      const gymLocationsArray = formData.gymLocations
        .split(',')
        .map((loc: string) => loc.trim())
        .filter((loc: string) => loc);
      
      const userData = {
        name: formData.name,
        username: formData.username,
        imageUrl: imageUrl,
        businessDescription: formData.businessDescription,
        contactDetails: JSON.stringify({
          phone: formData.phone,
          website: formData.website,
          address: formData.address,
        }),
        socialLinks: JSON.stringify({
          instagram: formData.instagram,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          facebook: formData.facebook,
        }),
        gymLocations: JSON.stringify(gymLocationsArray),
        workImages: JSON.stringify(allWorkImages),
      };
      
      
      const updatedUser = await updateUser(user.$id, userData);
      
      
      onUpdate(updatedUser as unknown as User);
      onClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      console.error('Profile update error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-gray-900 rounded-lg w-full max-w-3xl mx-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="max-h-[85vh] overflow-y-auto overflow-x-hidden">
              <div className="sticky top-0 z-10 bg-gray-900 p-4 border-b border-gray-800 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Edit Profile</h2>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-5">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Basic Information</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          required
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="businessDescription">Business Description</Label>
                      <Textarea
                        id="businessDescription"
                        name="businessDescription"
                        value={formData.businessDescription}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700 h-24"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="profileImage">Profile Image</Label>
                      <Input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                  </div>
                  
                  {/* Contact Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Contact Details</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          className="bg-gray-800 border-gray-700"
                          type="url"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                  </div>
                  
                  {/* Social Links */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Social Media</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input
                          id="instagram"
                          name="instagram"
                          value={formData.instagram}
                          onChange={handleChange}
                          className="bg-gray-800 border-gray-700"
                          placeholder="https://instagram.com/username"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleChange}
                          className="bg-gray-800 border-gray-700"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input
                          id="twitter"
                          name="twitter"
                          value={formData.twitter}
                          onChange={handleChange}
                          className="bg-gray-800 border-gray-700"
                          placeholder="https://twitter.com/username"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input
                          id="facebook"
                          name="facebook"
                          value={formData.facebook}
                          onChange={handleChange}
                          className="bg-gray-800 border-gray-700"
                          placeholder="https://facebook.com/username"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Gym Locations */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Gym Locations</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gymLocations">Locations (comma-separated)</Label>
                      <Input
                        id="gymLocations"
                        name="gymLocations"
                        value={formData.gymLocations}
                        onChange={handleChange}
                        className="bg-gray-800 border-gray-700"
                        placeholder="Gym A, Gym B, Gym C"
                      />
                    </div>
                  </div>
                  
                  {/* Work Images */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Portfolio Images</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="workImages">Add Images {compressingImages && '(Compressing...)'}</Label>
                      <Input
                        id="workImages"
                        ref={workImagesInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleWorkImagesChange}
                        className="bg-gray-800 border-gray-700"
                        disabled={compressingImages || existingWorkImages.length >= 4}
                      />
                      <p className="text-xs text-gray-400">
                        You can upload up to 4 images. {existingWorkImages.length} of 4 used. 
                        Images will be compressed to optimize loading speed.
                      </p>
                    </div>
                    
                    {existingWorkImages.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Current Images:</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {existingWorkImages.map((img, index) => (
                            <div key={index} className="relative">
                              <div className="h-24 w-full overflow-hidden rounded-md">
                                <img 
                                  src={typeof img === 'string' ? img : ''}
                                  alt={`Work image ${index + 1}`}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/placeholder-image.jpg';
                                  }}
                                />
                              </div>
                              <button
                                type="button"
                                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 shadow-sm"
                                onClick={() => handleDeleteWorkImage(index)}
                                aria-label="Delete image"
                              >
                                <X className="h-3 w-3 text-white" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Form Buttons - Responsive Layout */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
                          <span>Saving...</span>
                        </div>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                      onClick={onClose}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>

                  {error && (
                    <p className="text-red-500 mt-4 text-sm">{error}</p>
                  )}
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 