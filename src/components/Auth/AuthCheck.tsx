"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const PUBLIC_PATHS = ["/auth/login", "/auth/register"];

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated && !PUBLIC_PATHS.includes(pathname)) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router, pathname]);

  return <>{children}</>;
}
