"use client";

import { AuthCheck } from "src/components/Auth/AuthCheck";
import ChatLayout from "../../src/components/Layout/ChatLayout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("login...");

  return (
    <ChatLayout>
      <AuthCheck>{children}</AuthCheck>
    </ChatLayout>
  );
}
