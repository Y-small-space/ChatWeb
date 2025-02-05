"use client";

import { Avatar, Badge, List, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useTheme } from "../../../src/contexts/ThemeContext";
import { useLanguage } from "../../../src/contexts/LanguageContext";
import {
  mockPrivateMessages,
  mockGroupChats,
  mockChatUsers,
} from "../../../src/mock/chatData";
import { formatDistance } from "date-fns";
import { zhCN, enUS } from "date-fns/locale";

const { Search } = Input;

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
  const { t, currentLanguage } = useLanguage();

  // 合并私聊和群聊数据
  const chatList = [
    ...mockChatUsers.map((user) => {
      const messages = mockPrivateMessages[user.id] || [];
      const lastMessage = messages[messages.length - 1];
      return {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        lastMessage: lastMessage?.content || "",
        timestamp: lastMessage?.created_at || "",
        unread: messages.filter(
          (m) => m.status !== "read" && m.sender_id !== "1"
        ).length,
        online: user.online,
        type: "private",
      };
    }),
    ...mockGroupChats.map((group) => {
      const messages = mockPrivateMessages[group.id] || [];
      const lastMessage = messages[messages.length - 1];
      return {
        id: group.id,
        name: group.name,
        avatar: group.avatar,
        lastMessage: lastMessage?.content || "",
        timestamp: lastMessage?.created_at || "",
        unread: messages.filter(
          (m) => m.status !== "read" && m.sender_id !== "1"
        ).length,
        memberCount: group.members.length,
        type: "group",
      };
    }),
  ].sort((a, b) => {
    if (!a.timestamp || !b.timestamp) return 0;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* 搜索框 */}
      <div style={{ padding: "20px 20px 0" }}>
        <Search
          placeholder={t("chat.searchPlaceholder")}
          prefix={
            <SearchOutlined
              style={{ color: currentTheme.colors.secondaryText }}
            />
          }
          style={{
            borderRadius: "24px",
            backgroundColor: currentTheme.colors.secondaryBackground,
          }}
        />
      </div>

      {/* 聊天列表 */}
      <List
        style={{
          flex: 1,
          overflow: "auto",
          padding: "20px",
        }}
        dataSource={chatList}
        renderItem={(chat) => (
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
                `/chat/${chat.type === "group" ? "group/" : ""}${chat.id}`
              )
            }
          >
            <List.Item.Meta
              avatar={
                <Badge
                  dot={chat.type === "private" && chat.online}
                  offset={[-6, 28]}
                  color="green"
                >
                  <Avatar src={chat.avatar} size={48} />
                </Badge>
              }
              title={
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: currentTheme.colors.text }}>
                    {chat.name}
                    {chat.type === "group" && (
                      <span
                        style={{
                          fontSize: "12px",
                          color: currentTheme.colors.secondaryText,
                          marginLeft: "8px",
                        }}
                      >
                        ({chat.memberCount})
                      </span>
                    )}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: currentTheme.colors.secondaryText,
                    }}
                  >
                    {formatMessageTime(chat.timestamp)}
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
                    {chat.lastMessage}
                  </span>
                  {chat.unread > 0 && (
                    <Badge
                      count={chat.unread}
                      style={{ backgroundColor: "#ff2d55" }}
                    />
                  )}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
}
