"use client";

import ChatLayout from "../../src/components/Layout/ChatLayout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatLayout>{children}</ChatLayout>;
}
