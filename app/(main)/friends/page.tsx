"use client";

import { List, Avatar, Button, Badge, Tabs, Input } from "antd";
import { UserAddOutlined, SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useTheme } from "../../../src/contexts/ThemeContext";
import { useLanguage } from "../../../src/contexts/LanguageContext";
import { mockChatUsers } from "../../../src/mock/chatData";

const { Search } = Input;

export default function FriendsPage() {
  const router = useRouter();
  const { currentTheme } = useTheme();
  const { t } = useLanguage();

  const onlineUsers = mockChatUsers.filter((user) => user.online);
  const offlineUsers = mockChatUsers.filter((user) => !user.online);

  const renderUserList = (users: typeof mockChatUsers) => (
    <List
      dataSource={users}
      renderItem={(user) => (
        <List.Item
          style={{
            padding: "12px",
            cursor: "pointer",
            borderRadius: "12px",
            background: currentTheme.colors.background,
            border: "none",
            marginBottom: "8px",
          }}
          onClick={() => router.push(`/chat/${user.id}`)}
        >
          <List.Item.Meta
            avatar={
              <Badge dot={user.online} offset={[-6, 28]} color="green">
                <Avatar src={user.avatar} size={48} />
              </Badge>
            }
            title={user.name}
            description={
              <div style={{ color: currentTheme.colors.secondaryText }}>
                {user.online
                  ? t("friends.online")
                  : t("friends.lastSeen", {
                      time: new Date(user.last_seen || "").toLocaleString(),
                    })}
              </div>
            }
          />
        </List.Item>
      )}
    />
  );

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "16px",
          justifyContent: "space-between",
        }}
      >
        <Search
          placeholder={t("friends.search")}
          style={{ maxWidth: "300px" }}
          prefix={
            <SearchOutlined
              style={{ color: currentTheme.colors.secondaryText }}
            />
          }
        />
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => router.push("/friends/add")}
        >
          {t("friends.add")}
        </Button>
      </div>

      <Tabs
        items={[
          {
            key: "all",
            label: t("friends.all"),
            children: renderUserList(mockChatUsers),
          },
          {
            key: "online",
            label: (
              <span>
                {t("friends.online")}
                <Badge
                  count={onlineUsers.length}
                  style={{
                    marginLeft: "8px",
                    backgroundColor: currentTheme.colors.success,
                  }}
                />
              </span>
            ),
            children: renderUserList(onlineUsers),
          },
          {
            key: "offline",
            label: t("friends.offline"),
            children: renderUserList(offlineUsers),
          },
        ]}
      />
    </div>
  );
}
