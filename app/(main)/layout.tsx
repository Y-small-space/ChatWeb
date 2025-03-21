"use client";

import { AuthCheck } from "src/components/Auth/AuthCheck";
import ChatLayout from "../../src/components/Layout/ChatLayout";
import { useEffect } from 'react';
import { wsManager } from 'src/services/websocket';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  useEffect(() => {
    wsManager.connect();
  }, [])

  return (
    <ChatLayout>
      <AuthCheck>{children}</AuthCheck>
    </ChatLayout>
  );
}
