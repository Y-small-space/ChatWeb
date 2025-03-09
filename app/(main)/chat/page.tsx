"use client";

import { useEffect, useId, useState } from "react";
import { Avatar, Badge, List } from "antd";
import { useRouter } from "next/navigation";
import { useTheme } from "../../../src/contexts/ThemeContext";
import { wsManager } from "../../../src/services/websocket";
import { api } from "../../../src/services/api";

interface ChatMessage {
  content: string;
  created_at: string;
  group_id: string;
  id: string;
  read_by: null;
  receiver_id: string;
  receiverer: string;
  sender: string;
  sender_id: string;
  status: string;
  type: string;
  updated_at: string;
}
export default function ChatListPage() {
  const router = useRouter();
  const { currentTheme } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId: string | null = localStorage.getItem("userId");

  useEffect(() => {
    wsManager.connect();
    const getAllLastMessages = async () => {
      const { messages } = await api.chat.getAllLastMessages(String(userId));
      console.log(messages);

      if (messages) {
        setMessages(messages);
      }
    };
    getAllLastMessages();
  }, []);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <List
        style={{
          flex: 1,
          overflow: "auto",
          padding: "20px",
        }}
        dataSource={messages}
        renderItem={(chat: ChatMessage) => (
          <List.Item
            style={{
              padding: "12px",
              cursor: "pointer",
              borderRadius: "12px",
              transition: "all 0.3s ease",
              marginBottom: "8px",
              background: currentTheme.colors.background,
              border: "none",
            }}
            onClick={() =>
              router.push(
                `/chat/${chat?.type === "group" ? "group/" : ""}${
                  chat?.sender_id === userId
                    ? chat?.receiver_id
                    : chat?.sender_id
                }`
              )
            }
          >
            <List.Item.Meta
              avatar={
                <Badge
                  // dot={chat?.type === "private" && chat?.online}
                  offset={[-6, 28]}
                  color="green"
                >
                  <Avatar size={48} />
                </Badge>
              }
              title={
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: currentTheme.colors.text }}>
                    {chat?.sender === user.username
                      ? chat?.receiverer
                      : chat?.sender}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: currentTheme.colors.secondaryText,
                    }}
                  >
                    {new Date(chat?.created_at).toLocaleString()}
                  </span>
                </div>
              }
              description={
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{
                      color: currentTheme.colors.secondaryText,
                      maxWidth: "70%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {chat?.content}
                  </span>
                  {/* {chat?.unread > 0 && (
                    <Badge
                      count={chat?.unread}
                      style={{ backgroundColor: "#ff2d55" }}
                    />
                  )} */}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
}
