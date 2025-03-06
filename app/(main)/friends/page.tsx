"use client";

import { List, Avatar, Button, Badge, Tabs, Input } from "antd";
import { UserAddOutlined, SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useTheme } from "../../../src/contexts/ThemeContext";
import { useLanguage } from "../../../src/contexts/LanguageContext";
import { mockChatUsers } from "../../../src/mock/chatData";
import { useState } from "react";

const { Search } = Input;

export default function FriendsPage() {
  const router = useRouter();
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const [disable, setDisable] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [searchUser, setSearchUser] = useState([]);
  const [userList, setUserList] = useState([]);
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

  const renderAddFriends = () => {
    return (
      <div style={{ padding: "16px" }}>
        <Search
          placeholder={t("friends.searchPlaceholder")}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ marginBottom: "16px", width: "100%" }}
          prefix={
            <SearchOutlined
              style={{ color: currentTheme.colors.secondaryText }}
            />
          }
          onSearch={async () => {
            const res = await api.friends.searchUser(searchValue);
            setSearchUser([res?.data.user]);
            console.log(res);
          }}
        />
        <List
          dataSource={searchUser}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          renderItem={(user: any) => (
            <List.Item
              style={{
                padding: "12px",
                borderRadius: "12px",
                background: currentTheme.colors.background,
                border: "none",
                marginBottom: "8px",
              }}
              onClick={() => {
                // router.push("")
                router.push(`/friends/details/add_${user.username}`);
              }}
            >
              <List.Item.Meta
                avatar={<Avatar src={user?.avatar} size={48} />}
                title={user?.username}
                description={user?.email}
              />
              {/* <Button onClick={() => handleAddFriend(user?.id)}>
                {t("friends.add")}
              </Button> */}
            </List.Item>
          )}
        />
      </div>
    );
  };

  const getFriends = async () => {
    const res = await api.friends.getFriends();
    setUserList(res.data.friends);
    localStorage.setItem("userList", JSON.stringify(res.data.friends));
    console.log(res.data.friends);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "16px",
          justifyContent: "space-between",
        }}
      ></div>

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
          {
            key: "addfriends",
            label: t("friends.add"),
            children: renderAddFriends(),
          },
        ]}
      />
    </div>
  );
}
