// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage"; // Import getStorage and its type
import { getAnalytics, type Analytics } from "firebase/analytics"; // Import getAnalytics and its type

import { firebaseConfig } from "@/config/firebase"; // Import the config from src/config/firebase.ts

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage; // Declare storage variable
let analytics: Analytics | undefined; // Declare analytics variable

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error("Firebase initialization error", error);
    throw error;
  }
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app); // Initialize storage

// Initialize analytics only in browser environment
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Export all initialized services
export { app, auth, db, storage, analytics };