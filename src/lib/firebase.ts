// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "../config/firebase";


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// The emulator connection is likely causing the network error if emulators are not running.
// If you want to use the emulators, run `firebase emulators:start` and uncomment the block below.
/*
if (process.env.NODE_ENV === 'development') {
  try {
    const { connectAuthEmulator } = require("firebase/auth");
    const { connectFirestoreEmulator } = require("firebase/firestore");
    const { connectStorageEmulator } = require("firebase/storage");
    connectAuthEmulator(auth, "http://127.0.0.1:9099");
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
    connectStorageEmulator(storage, "127.0.0.1", 9199);
    console.log("Connected to Firebase Emulators");
  } catch (e) {
    console.error("Failed to connect to Firebase Emulators", e);
  }
}
*/
export { app, auth, db, storage }; // Export app as well if needed elsewhere
