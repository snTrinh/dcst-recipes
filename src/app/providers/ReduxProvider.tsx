"use client";
import { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { auth } from "@/lib/firebase";
import { store } from "@/lib/store";
import { setAuth } from "@/lib/slices/authSlice";

export default function ReduxProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        store.dispatch(
          setAuth({
            token,
            email: user.email || null,
          })
        );
        localStorage.setItem("token", token);
        if (user.email) localStorage.setItem("userEmail", user.email);
      } else {
        store.dispatch(setAuth({ token: null, email: null }));
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
      }
    });

    return () => unsubscribe();
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
