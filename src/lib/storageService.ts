import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app, isFirebaseAppEnabled } from './firebaseApp';

/** Upload a File object to Firebase Storage and return its public download URL. */
export async function uploadFileToStorage(file: File, destPath: string): Promise<string> {
  if (!isFirebaseAppEnabled || !app) {
    throw new Error('Firebase Storage is not configured.');
  }

  try {
    const storage = getStorage(app);
    const targetRef = storageRef(storage, destPath);
    const snapshot = await uploadBytes(targetRef, file, {
      contentType: file.type,
      cacheControl: 'public,max-age=31536000,immutable'
    });
    return await getDownloadURL(snapshot.ref);
  } catch (err) {
    console.error('uploadFileToStorage failed:', err);
    throw err;
  }
}

export async function uploadDataUrlToStorage(dataUrl: string, destPath: string): Promise<string> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  const extension = blob.type === 'image/png' ? 'png' : blob.type === 'image/webp' ? 'webp' : 'jpg';
  const file = new File([blob], `${Date.now()}.${extension}`, { type: blob.type || 'image/jpeg' });
  return uploadFileToStorage(file, `${destPath}.${extension}`);
}
