import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { firebaseConfig, isFirebaseConfigured } from './firebaseConfig';

export const isFirebaseAppEnabled = isFirebaseConfigured;

let app: FirebaseApp | null = null;
if (isFirebaseAppEnabled) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  } catch (error) {
    console.error('Firebase app initialization failed:', error);
  }
}

export { app };
