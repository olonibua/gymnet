import { Client, Account, Databases, Storage, Avatars } from 'appwrite';

export const appwriteConfig = {
  url: process.env.NEXT_PUBLIC_APPWRITE_URL || 'https://cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '',
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
  userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID || '',
  storageId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || '',
  likesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_LIKES_COLLECTION_ID || '',
};

// Initialize the Appwrite client
export const client = new Client();

client
  .setEndpoint(appwriteConfig.url)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);

export default client; 