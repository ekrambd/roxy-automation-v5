/// <reference types="vite/client" />
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, isSupported } from 'firebase/messaging';
import { app, isFirebaseAppEnabled } from './firebaseApp';
import { firebaseConfig } from './firebaseConfig';

let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let messaging: ReturnType<typeof getMessaging> | null = null;
let isFirebaseEnabled = false;

if (isFirebaseAppEnabled && app) {
  try {
    auth = getAuth(app);
    const customDbId = firebaseConfig.firestoreDatabaseId;
    const isValidCustomDb = customDbId && customDbId !== '(default)' && customDbId !== 'default' && customDbId.trim() !== '';
    db = isValidCustomDb ? getFirestore(app, customDbId) : getFirestore(app);
    
    // Initialize Messaging only if strictly supported by browser
    if (
      typeof window !== 'undefined' && 
      'serviceWorker' in navigator && 
      'PushManager' in window &&
      window.isSecureContext
    ) {
      isSupported().then((supported) => {
        if (supported) {
          try {
            messaging = getMessaging(app);
          } catch (messagingErr) {
            console.warn('Firebase Messaging initialization failed:', messagingErr);
          }
        } else {
          console.warn('Firebase Messaging is not supported in this browser environment.');
        }
      }).catch((err) => console.warn('isSupported check failed:', err));
    } else {
      console.warn('Firebase Messaging requires HTTPS and ServiceWorker support.');
    }
    
    isFirebaseEnabled = true;
  } catch (error) {
    console.error('Firebase services initialization failed:', error);
  }
}

export { app, auth, db, messaging, isFirebaseEnabled };
