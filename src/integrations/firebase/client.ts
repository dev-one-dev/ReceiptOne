import { getApps, initializeApp, type FirebaseOptions } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

// Adds a Web client to the existing "check-app" Firebase project used by
// the mobile apps -- this must never touch the Android/iOS app configs,
// Firestore data, or security rules. Read/write wiring comes later; this
// file only constructs the SDK instances.
function getFirebaseConfig(): FirebaseOptions {
  // Use import.meta.env for client-side (Vite build-time replacement)
  // Fall back to process.env for SSR (server-side rendering)
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY;
  const authDomain =
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN;
  const projectId =
    import.meta.env.VITE_FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
  const storageBucket =
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId =
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    process.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
  const appId = import.meta.env.VITE_FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID;
  const measurementId =
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || process.env.VITE_FIREBASE_MEASUREMENT_ID;

  if (!apiKey || !authDomain || !projectId || !storageBucket || !messagingSenderId || !appId) {
    throw new Error(
      "Missing Firebase environment variables. Ensure VITE_FIREBASE_* variables are set in your .env file.",
    );
  }

  return { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId };
}

// App Check's reCAPTCHA site key isn't part of FirebaseOptions -- it's a
// separate value only used when initializing App Check itself. Missing
// is handled as a soft skip (see below), not a thrown error, since App
// Check is additive: the rest of the app should keep working even
// before this var exists in Vercel.
function getAppCheckSiteKey(): string | undefined {
  return (
    import.meta.env.VITE_FIREBASE_APP_CHECK_SITE_KEY ||
    process.env.VITE_FIREBASE_APP_CHECK_SITE_KEY ||
    undefined
  );
}

// Reuse the existing app instance if one was already initialized (e.g. by
// HMR) instead of calling initializeApp twice. getAuth/getFirestore are
// cheap, synchronous, and safe to call eagerly even during SSR -- they
// don't touch window/IndexedDB until actually used, so there's no need to
// defer construction behind a lazy wrapper.
//
// Deliberately NOT wrapped in a Proxy: a get-only Proxy over a throwaway
// target object forwards reads correctly, but any internal Firebase code
// that calls a method through it binds `this` to the Proxy, and writes
// like `this.someField = ...` silently land on the unintercepted dummy
// target instead of the real instance -- this caused auth-state listener
// bookkeeping to desync after the first sign-in in a tab.
export const firebaseApp = getApps().length > 0 ? getApps()[0] : initializeApp(getFirebaseConfig());

// Initialized right after firebaseApp and before the other services so
// Auth/Firestore/Storage/Functions calls all carry a valid App Check
// token from the start -- Firebase AI Logic (Gemini via Vertex AI)
// specifically requires this as of July 2026, which is why "Parse with
// AI" was failing with a "config is missing" error before this existed.
// Guarded by `typeof window` since this file also runs during SSR,
// where reCAPTCHA has no DOM to attach to. Skips (with a console
// warning) rather than throwing if the site key isn't set yet, so the
// rest of the app keeps working before the Vercel env var is added.
//
// Local dev note: App Check has a debug token mechanism for localhost
// (self.FIREBASE_APPCHECK_DEBUG_TOKEN) -- not implemented here; worth
// knowing about if local dev with AI Logic ever breaks.
if (typeof window !== "undefined") {
  const appCheckSiteKey = getAppCheckSiteKey();
  if (appCheckSiteKey) {
    initializeAppCheck(firebaseApp, {
      provider: new ReCaptchaV3Provider(appCheckSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
  } else {
    console.warn(
      "Missing VITE_FIREBASE_APP_CHECK_SITE_KEY -- App Check not initialized; AI Logic (Gemini) calls will fail until this is set.",
    );
  }
}

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export const functions = getFunctions(firebaseApp);
