"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    console.log(localStorage.getItem("user"));

    if (!localStorage.getItem("user")) {
      router.push("/auth/login");
    }
  }, []);

  return <>{children}</>;
}
