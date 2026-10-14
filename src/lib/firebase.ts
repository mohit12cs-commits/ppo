import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBjMHWzRxDTaKo3maHFOoBHb4DBmoLyJmA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ppointern.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ppointern",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ppointern.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "400617862310",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:400617862310:web:28ba416313aa5be064f067",
};

// Initialize Firebase safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_API_KEY !== "AIzaSy_SAMPLE_KEY"
  );
};
