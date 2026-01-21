import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

// This function is designed to be called on the client side.
// We use getApps() to ensure we don't initialize the app more than once.
export function initializeFirebase() {
  if (typeof window !== 'undefined') {
    if (!getApps().length) {
      try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        firestore = getFirestore(app);
      } catch (e) {
        console.error('Failed to initialize Firebase', e);
      }
    } else {
      app = getApp();
      auth = getAuth(app);
      firestore = getFirestore(app);
    }
  }
  // @ts-ignore
  return { app, auth, firestore };
}

export { FirebaseProvider, useFirebase, useFirebaseApp, useAuth, useFirestore } from './provider';
export { useUser } from './auth/use-user';
