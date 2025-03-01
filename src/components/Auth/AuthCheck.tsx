"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/auth/login");
    }
  }, []);

  return <>{children}</>;
}
