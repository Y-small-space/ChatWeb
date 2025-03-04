"use client";

import { Avatar, Badge, List } from "antd";
import { useRouter } from "next/navigation";
import { useTheme } from "../../../src/contexts/ThemeContext";
import { formatDistance } from "date-fns";
import { zhCN, enUS } from "date-fns/locale";
import { useEffect } from "react";
import { wsManager } from "../../../src/services/websocket";
import { api } from "../../../src/services/api";

interface ChatMessage {
  type: string;
  id: string;
  online: string;
  avatar: string;
  name: string;
  timestamp: string;
  memberCount?: string;
}
const formatMessageTime = (timestamp: string) => {
  if (!timestamp) return "";

  try {
    return formatDistance(new Date(timestamp), new Date(), {
      addSuffix: true,
      locale: currentLanguage === "zh" ? zhCN : enUS,
    });
  } catch (error) {
    return timestamp; // 如果解析失败，直接返回原始时间字符串
  }
};
export default function ChatListPage() {
  const router = useRouter();
  const { currentTheme } = useTheme();

  useEffect(() => {
    wsManager.connect();
    const getAllLastMessages = async () => {
      const userId: string | null = localStorage.getItem("userId");
      const res = await api.chat.getAllLastMessages(userId);
      console.log("userID", userId);
    };
    getAllLastMessages();
  }, []);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* 聊天列表 */}
      <List
        style={{
          flex: 1,
          overflow: "auto",
          padding: "20px",
        }}
        dataSource={[]}
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
                `/chat/${chat?.type === "group" ? "group/" : ""}${chat?.id}`
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
                  <Avatar src={chat?.avatar} size={48} />
                </Badge>
              }
              title={
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: currentTheme.colors.text }}>
                    {chat?.name}
                    {chat?.type === "group" && (
                      <span
                        style={{
                          fontSize: "12px",
                          color: currentTheme.colors.secondaryText,
                          marginLeft: "8px",
                        }}
                      >
                        ({chat?.memberCount})
                      </span>
                    )}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: currentTheme.colors.secondaryText,
                    }}
                  >
                    {formatMessageTime(chat?.timestamp)}
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
                    {/* {chat?.lastMessage} */}
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
