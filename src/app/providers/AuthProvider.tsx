"use client";
import { useAuthListener } from "@/lib/hooks/useAuthListener";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useAuthListener();
  return <>{children}</>;
}
