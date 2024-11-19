export const evaluationService = {
    async fetchStatus(bucketName: string, fileName: string) {
      try {
        const response = await fetch(
          `/api/firestore/?collection=${bucketName}&docName=${encodeURIComponent(fileName)}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result.success && result.data ? result.data : null;
      } catch (error) {
        console.error(`Error fetching status for ${fileName}:`, error);
        return null;
      }
    }
  };