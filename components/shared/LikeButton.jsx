const checkIfLiked = async () => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.likesCollectionId,
      [
        Query.equal("userId", userId),
        Query.equal("profileId", profileId)
      ]
    );
    
    // If documents are found, the user has already liked this profile
    if (response.documents.length > 0) {
      setIsLiked(true);
      // Store the like document ID for later use (for unlike action)
      setLikeId(response.documents[0].$id);
    } else {
      setIsLiked(false);
      setLikeId(null);
    }
  } catch (error) {
    console.error("Error checking like status:", error);
  }
}; 