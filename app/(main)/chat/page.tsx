"use client";

import { Avatar, Badge, List } from "antd";
import { mockRecentChats } from "../../../src/mock/data";
import { useRouter } from "next/navigation";

const listItemStyle = {
  padding: "12px 20px",
  cursor: "pointer",
  transition: "background-color 0.3s",
  borderRadius: "8px",
  margin: "4px 0",
};

const listItemHoverStyle = {
  backgroundColor: "#f5f5f5",
};

export default function ChatListPage() {
  const router = useRouter();

  return (
    <div style={{ height: "100%", padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", fontSize: "18px", fontWeight: 500 }}>
        最近聊天
      </h2>
      <List
        dataSource={mockRecentChats}
        renderItem={(chat) => (
          <List.Item
            style={listItemStyle}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, listItemHoverStyle);
            }}
            onMouseLeave={(e) => {
              Object.assign(e.currentTarget.style, listItemStyle);
            }}
            onClick={() => router.push(`/chat/${chat.id}`)}
          >
            <List.Item.Meta
              avatar={
                <Badge dot={chat.online} offset={[-6, 28]} color="green">
                  <Avatar src={chat.avatar} size={48} />
                </Badge>
              }
              title={
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{chat.name}</span>
                  <span style={{ fontSize: "12px", color: "#999" }}>
                    {chat.timestamp}
                  </span>
                </div>
              }
              description={
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "#666" }}>{chat.lastMessage}</span>
                  {chat.unread > 0 && (
                    <Badge
                      count={chat.unread}
                      style={{ backgroundColor: "#1890ff" }}
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
