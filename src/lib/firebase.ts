// 🏛️ SECURE FIREBASE CONFIGURATION WITH FAILSFE FALLBACKS
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "placeholder-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "placeholder-auth-domain",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "placeholder-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "placeholder-storage-bucket",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "placeholder-sender-id",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "placeholder-app-id"
};

// Check if a real Firebase project is active
const isFirebaseConfigured = 
  firebaseConfig.projectId && 
  firebaseConfig.projectId !== "placeholder-project-id" &&
  !firebaseConfig.projectId.startsWith("your-") &&
  firebaseConfig.apiKey !== "placeholder-api-key";

// Defensive mock to prevent boot-up static compilation crashes when firebase is not installed
export const app = null;
export const db = null;
export const auth = null;

export { isFirebaseConfigured };
