"use client";

import { AuthCheck } from "src/components/Auth/AuthCheck";
import ChatLayout from "../../src/components/Layout/ChatLayout";
import { useEffect } from 'react';
import { wsManager } from 'src/services/websocket';
import { WebSocketProvider } from 'src/contexts/WebSocketContext';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  useEffect(() => {
    wsManager.connect();
  }, [])

  return (
    <WebSocketProvider>
      <ChatLayout>
        <AuthCheck>{children}</AuthCheck>
      </ChatLayout>
    </WebSocketProvider>
  );
}
