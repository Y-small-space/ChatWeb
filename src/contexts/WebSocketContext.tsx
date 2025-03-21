"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { WebSocketManager, wsManager } from "src/services/websocket";

// 添加显式类型
const WebSocketContext = createContext<WebSocketManager | null>(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [ws, setWs] = useState(wsManager);

  useEffect(() => {
    ws.connect();
    return () => ws.disconnect();
  }, []);

  return (
    <WebSocketContext.Provider value={ws} >
      {children}
    </WebSocketContext.Provider>
  );
};

// 使用 WebSocket Context
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};