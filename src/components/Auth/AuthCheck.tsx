"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../../../src/store";

// 不需要登录就能访问的路径
const PUBLIC_PATHS = ["/auth/login", "/auth/register"];

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated && !PUBLIC_PATHS.includes(pathname || "")) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, pathname, router]);

  // 如果是公开路径或已登录，显示内容
  if (PUBLIC_PATHS.includes(pathname || "") || isAuthenticated) {
    return <>{children}</>;
  }

  // 其他情况（未登录且不是公开路径）显示空内容，等待重定向
  return null;
}
