import { doc, onSnapshot, getFirestore } from 'firebase/firestore';

/**
 * 54. Progress Tracking via Firestore
 * A client-side listener to hook into the video UI progress bar instantly.
 */
export function listenToVideoJobProgress(
  jobId: string, 
  onProgress: (pct: number) => void, 
  onComplete: (url: string) => void, 
  onError: (err: string) => void
) {
  // Assumes Firebase Client SDK is initialized in the environment
  const db = getFirestore(); 
  
  const unsubscribe = onSnapshot(doc(db, 'videoJobs', jobId), (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.status === 'processing') {
        onProgress(data.progress || 0);
      } else if (data.status === 'success') {
        onComplete(data.resultUrl);
        unsubscribe();
      } else if (data.status === 'error') {
        import('./firebase-error').then(({ handleFirebaseEncodeError }) => {
           onError(handleFirebaseEncodeError(data.errorCode, data.errorMessage));
        })
        unsubscribe();
      }
    }
  });

  return unsubscribe;
}
