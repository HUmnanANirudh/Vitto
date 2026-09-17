"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getToken = async () => {
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken();
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push("/login");
  };

  return { user, loading, getToken, signOut };
}
