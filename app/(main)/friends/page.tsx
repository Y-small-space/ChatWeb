"use client";

import { Avatar, Badge, List } from "antd";
import { mockFriends } from "../../../src/mock/data";
import { useRouter } from "next/navigation";

const listItemStyle = {
  padding: "12px 20px",
  cursor: "pointer",
  transition: "background-color 0.3s",
  borderRadius: "8px",
  margin: "4px 0",
};

export default function FriendsPage() {
  const router = useRouter();

  return (
    <div style={{ height: "100%", padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", fontSize: "18px", fontWeight: 500 }}>
        我的好友
      </h2>
      <List
        dataSource={mockFriends}
        renderItem={(friend) => (
          <List.Item
            style={listItemStyle}
            onClick={() => router.push(`/chat/${friend.id}`)}
          >
            <List.Item.Meta
              avatar={
                <Badge dot={friend.online} offset={[-6, 28]} color="green">
                  <Avatar src={friend.avatar} size={48} />
                </Badge>
              }
              title={friend.name}
              description={
                <span style={{ color: "#666" }}>{friend.status}</span>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
}
