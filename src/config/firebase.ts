// src/config/firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID // Optional, for Google Analytics
};

// Add a check to ensure all required fields are present
// Note: NEXT_PUBLIC_ is necessary for client-side access in Next.js applications
for (const key in firebaseConfig) {
  if (firebaseConfig[key as keyof typeof firebaseConfig] === undefined) {
    // Only throw error for required fields, optional ones like measurementId can be undefined
    if (key !== 'measurementId') {
      throw new Error(`Firebase config error: NEXT_PUBLIC_FIREBASE_${key.toUpperCase()} is not defined in environment variables.`);
    }
  }
}

// Note: The actual Firebase app initialization and service exports
// (like getStorage, getAuth, getFirestore) are handled in src/lib/firebase.ts
// which imports this firebaseConfig.
