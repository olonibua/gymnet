export interface User {
  $id?: string;
  accountId: string;
  email: string;
  name: string;
  username: string;
  imageUrl: string;
  businessDescription: string;
  contactDetails: {
    phone?: string;
    website?: string;
    address?: string;
  };
  workImages: string[];
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  gymLocations: string[];
}

export interface UserUpdate {
  name?: string;
  username?: string;
  email?: string;
  imageUrl?: string;
  businessDescription?: string;
  contactDetails?: string;
  workImages?: string;
  socialLinks?: string;
  gymLocations?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  checkAuthStatus: () => Promise<boolean>;
  signInWithProvider: (provider: string) => Promise<void>;
  signOut: () => Promise<void>;
} 