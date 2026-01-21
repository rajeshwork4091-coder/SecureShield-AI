'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { initializeFirebase, FirebaseProvider } from '@/firebase';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [firebase, setFirebase] = useState<{
    app: FirebaseApp | null;
    auth: Auth | null;
    firestore: Firestore | null;
  }>({ app: null, auth: null, firestore: null });

  useEffect(() => {
    const init = async () => {
      const { app, auth, firestore } = await initializeFirebase();
      setFirebase({ app, auth, firestore });
    };

    init();
  }, []);

  return (
    <FirebaseProvider app={firebase.app} auth={firebase.auth} firestore={firebase.firestore}>
      {children}
    </FirebaseProvider>
  );
}
