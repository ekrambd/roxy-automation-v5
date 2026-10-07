/// <reference types="vite/client" />

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCpSGVw9I4dsakWbsnb9XVuTSolTMuq7qY",
  authDomain: "fantinebd.firebaseapp.com",
  projectId: "fantinebd",
  storageBucket: "fantinebd.firebasestorage.app",
  messagingSenderId: "547346956898",
  appId: "1:547346956898:web:41c875b6dfa5622606c73b",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || ''
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

console.log('--- FIREBASE CONFIGURATION LOADED ---');
console.log('Project ID:', firebaseConfig.projectId);
console.log('Database ID configured:', firebaseConfig.firestoreDatabaseId || '(default fallback)');
console.log('---------------------------------------');
