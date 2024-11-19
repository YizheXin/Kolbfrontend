import { Firestore } from '@google-cloud/firestore';

// Initialize Firestore with application default credentials
const firestore = new Firestore({
  projectId: process.env.GOOGLE_CLOUD_PROJECT, // Make sure this is set in your environment
  // The credentials will be automatically picked up from gcloud login
});

// Add a wrapper for logging
const loggedFirestore = {
  collection: (collectionName: string) => {
    console.log(`Accessing collection: ${collectionName}`);
    const collection = firestore.collection(collectionName);
    
    return {
      ...collection,
      doc: (docName: string) => {
        console.log(`Accessing document: ${docName}`);
        const doc = collection.doc(docName);
        
        return {
          ...doc,
          set: async (data: any, options?: any) => {
            console.log(`Setting document data:`, {
              collection: collectionName,
              document: docName,
              data: data
            });
            try {
              const result = await doc.set(data, options);
              console.log('Document successfully written');
              return result;
            } catch (error) {
              console.error('Error writing document:', error);
              throw error;
            }
          },
          get: async () => {
            console.log(`Getting document: ${docName}`);
            try {
              const result = await doc.get();
              console.log('Document fetch result:', {
                exists: result.exists,
                data: result.data()
              });
              return result;
            } catch (error) {
              console.error('Error getting document:', error);
              throw error;
            }
          }
        };
      }
    };
  }
};

export { loggedFirestore as firestore };