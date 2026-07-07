import { getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Adds a Web client to the existing "check-app" Firebase project used by
// the mobile apps -- this must never touch the Android/iOS app configs,
// Firestore data, or security rules. Read/write wiring comes later; this
// file only constructs the SDK instances.
function getFirebaseConfig(): FirebaseOptions {
  // Use import.meta.env for client-side (Vite build-time replacement)
  // Fall back to process.env for SSR (server-side rendering)
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY;
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
  const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId =
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
  const appId = import.meta.env.VITE_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID;
  const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || process.env.VITE_FIREBASE_MEASUREMENT_ID;

  if (!apiKey || !authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) {
    throw new Error(
      'Missing Firebase environment variables. Ensure VITE_FIREBASE_* variables are set in your .env file.'
    );
  }

  return { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId };
}

function createFirebaseApp(): FirebaseApp {
  // Reuse the existing app instance if one was already initialized
  // (e.g. by HMR) instead of calling initializeApp twice.
  const existing = getApps();
  return existing.length > 0 ? existing[0] : initializeApp(getFirebaseConfig());
}

let _app: FirebaseApp | undefined;
let _auth: Auth | undefined;
let _db: Firestore | undefined;

function app(): FirebaseApp {
  if (!_app) _app = createFirebaseApp();
  return _app;
}

// Import like: import { firebaseApp } from "@/integrations/firebase/client";
export const firebaseApp = new Proxy({} as FirebaseApp, {
  get(_, prop, receiver) {
    return Reflect.get(app(), prop, receiver);
  },
});

// Import like: import { auth } from "@/integrations/firebase/client";
export const auth = new Proxy({} as Auth, {
  get(_, prop, receiver) {
    if (!_auth) _auth = getAuth(app());
    return Reflect.get(_auth, prop, receiver);
  },
});

// Import like: import { db } from "@/integrations/firebase/client";
export const db = new Proxy({} as Firestore, {
  get(_, prop, receiver) {
    if (!_db) _db = getFirestore(app());
    return Reflect.get(_db, prop, receiver);
  },
});
