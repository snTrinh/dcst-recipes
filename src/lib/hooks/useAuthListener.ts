"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

export function useAuthListener() {
  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser({ email: firebaseUser.email! });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return user; 
}
