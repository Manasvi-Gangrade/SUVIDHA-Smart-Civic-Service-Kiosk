import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Secure Firebase Configuration with failsafe fallbacks
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDgCgzRJ2oa4A3vuc5uRvVL3tVw9gz4IbU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "suvidha-kiosk-ade87.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "suvidha-kiosk-ade87",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "suvidha-kiosk-ade87.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "627864428438",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:627864428438:web:c534a8b61d6a3e3213c7b7"
};

// Check if a real Firebase project is active
const isFirebaseConfigured = 
  firebaseConfig.projectId && 
  firebaseConfig.projectId !== "placeholder-project-id" &&
  !firebaseConfig.projectId.startsWith("your-") &&
  firebaseConfig.apiKey !== "placeholder-api-key";

let appInstance = null;
let dbInstance = null;
let authInstance = null;

if (isFirebaseConfigured) {
  try {
    appInstance = initializeApp(firebaseConfig);
    dbInstance = getFirestore(appInstance);
    authInstance = getAuth(appInstance);
    authInstance.useDeviceLanguage();
  } catch (error) {
    console.error("Firebase failed to initialize:", error);
  }
}

export const app = appInstance;
export const db = dbInstance;
export const auth = authInstance;
export { isFirebaseConfigured };
