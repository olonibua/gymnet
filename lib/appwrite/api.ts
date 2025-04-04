import { ID, Query, Models, Account, OAuthProvider } from 'appwrite';
import { account, appwriteConfig, avatars, databases, storage } from './client';
import { User, UserUpdate } from '@/types';

// Authentication functions
export async function createUserAccount(user: {
  email: string;
  password: string;
  name: string;
  username?: string;
}) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw new Error('Account creation failed');

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      imageUrl: avatarUrl,
      username: user.username || user.name.toLowerCase().replace(/\s+/g, ''),
      businessDescription: '',
      contactDetails: {},
      workImages: [],
      socialLinks: {},
      gymLocations: [],
    });

    return newUser;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
    console.error('Account creation error:', errorMessage);
    throw error;
  }
}

export async function saveUserToDB(user: User) {
  try {
    // Convert object and array fields to strings for database storage
    const userData = {
      ...user,
      // Convert objects to JSON strings
      contactDetails: JSON.stringify(user.contactDetails || {}),
      socialLinks: JSON.stringify(user.socialLinks || {}),
      // Convert arrays to JSON strings
      workImages: JSON.stringify(user.workImages || []),
      gymLocations: JSON.stringify(user.gymLocations || [])
    };

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      userData
    );
    
    return newUser;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to save user to database';
    console.error('Database save error:', errorMessage);
    throw error;
  }
}

// OAuth Authentication function - Google only
export async function signInWithProvider(provider: string) {
  try {
    // Redirect is handled automatically by Appwrite
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/?auth_success=true`,  // Success URL
      `${window.location.origin}/?auth_error=user_cancelled` // Failure URL
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to initiate OAuth sign-in';
    console.error('OAuth sign-in error:', errorMessage);
    throw error;
  }
}

// Get current user (remains the same)
export async function getCurrentUser() {
  try {
    // Get the account
    const currentAccount = await account.get();
    
    if (!currentAccount) {
      console.error('No current account found');
      return null;
    }
    
    // Check if collection exists for the user
    try {
      // Try to find the user in the database
      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal('accountId', currentAccount.$id)]
      );

      // User exists, return the first match
      if (currentUser.documents.length > 0) {
        const user = currentUser.documents[0];
        
        // Parse JSON strings back to objects
        if (typeof user.contactDetails === 'string') {
          user.contactDetails = JSON.parse(user.contactDetails || '{}');
        }
        
        if (typeof user.socialLinks === 'string') {
          user.socialLinks = JSON.parse(user.socialLinks || '{}');
        }
        
        // Parse JSON strings back to arrays
        if (typeof user.workImages === 'string') {
          user.workImages = JSON.parse(user.workImages || '[]');
        }
        
        if (typeof user.gymLocations === 'string') {
          user.gymLocations = JSON.parse(user.gymLocations || '[]');
        }
        
        return user;
      }
      
      // User not in database, create profile
      
      // Create a profile image
      const avatarUrl = avatars.getInitials(currentAccount.name);
      
      // Prepare the user data
      const newUser = {
        accountId: currentAccount.$id,
        email: currentAccount.email,
        name: currentAccount.name,
        username: currentAccount.email.split('@')[0],
        imageUrl: avatarUrl,
        businessDescription: '',
        contactDetails: {},
        workImages: [],
        socialLinks: {},
        gymLocations: []
      };
      
      // Create the user document
      return await saveUserToDB(newUser);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Database query failed';
      console.error('Database query error:', errorMessage);
      
      // If it's a database not found or collection not found error, we still want to create the user
      if (errorMessage.includes('not found')) {
        console.error('Database or collection not found. Please check your environment variables and Appwrite console.');
      }
      
      return null;
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get current user';
    console.error('Get current user error:', errorMessage);
    return null;
  }
}

// Sign out (remains the same)
export async function signOut() {
  try {
    const session = await account.deleteSession('current');
    return session;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to sign out';
    console.error('Sign out error:', errorMessage);
    throw error;
  }
}

// User functions
export async function getRandomUser() {
  try {
    // Get a random user from the database
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
    );

    if (!users.documents.length) {
      return null;
    }

    // Filter users with complete profiles locally
    const completedProfiles = users.documents.filter(user => {
      return (
        user.businessDescription && 
        user.businessDescription.trim() !== '' &&
        user.name && 
        user.name.trim() !== ''
      );
    });

    if (!completedProfiles.length) {
      return null;
    }

    // Get a random user from the filtered list
    const randomIndex = Math.floor(Math.random() * completedProfiles.length);
    const randomUser = completedProfiles[randomIndex] as unknown as User;

    // Parse JSON fields
    if (randomUser.gymLocations && typeof randomUser.gymLocations === 'string') {
      randomUser.gymLocations = JSON.parse(randomUser.gymLocations || '[]');
    }
    
    return randomUser;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get random user';
    console.error('Random user fetch error:', errorMessage);
    return null;
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );
    
    // Parse string fields that might be JSON encoded
    if (user.imageUrl && typeof user.imageUrl === 'string') {
      try {
        if (user.imageUrl.startsWith('"') && user.imageUrl.endsWith('"')) {
          user.imageUrl = JSON.parse(user.imageUrl);
        }
      } catch (e) {
        console.error("Error parsing imageUrl:", e);
      }
    }
    
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function updateUser(userId: string, user: UserUpdate) {
  try {
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      user
    );
    
    return updatedUser;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
    console.error('Update user error:', errorMessage);
    throw error;
  }
}

// Storage functions
export async function uploadFile(file: File) {
  try {
    if (!appwriteConfig.storageId) {
      throw new Error('Storage bucket ID is not configured');
    }

    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    
    const fileUrl = storage.getFileView(
      appwriteConfig.storageId,
      uploadedFile.$id
    );
    
    return fileUrl;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
    console.error('File upload error:', errorMessage);
    throw error;
  }
}

// Search users by name, business description, or skills
export const searchUsers = async (searchTerm: string): Promise<User[]> => {
  try {
    
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [
        Query.or([
          Query.contains('name', searchTerm),
          Query.contains('businessDescription', searchTerm)
        ])
      ]
    );
    
    return response.documents as unknown as User[];
  } catch (error) {
    console.error('Search users error:', error);
    return [];
  }
}; 