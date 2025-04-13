"use client";

import { List, Avatar, Badge, Tabs, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useTheme } from "../../../src/contexts/ThemeContext";
import { useLanguage } from "../../../src/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { api } from "../../../src/services/api";
interface User {
  id: string;
  email: string;
  phone: string;
  username: string;
  avatar: string;
  status?: string;
  online?: boolean;
  last_seen?: string;
  created_at: string;
  updated_at: string;
}

const { Search } = Input;

export default function FriendsPage() {
  const router = useRouter();
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const [disable, setDisable] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [searchUser, setSearchUser] = useState([]);
  const [userList, setUserList] = useState([]);
  const [userStaus, setUserStatus] = useState()

  useEffect(() => {
    getFriends();
  }, []);

  const renderUserList = (users) => (
    <List
      dataSource={users}
      renderItem={(user: User) => (
        <List.Item
          style={{
            padding: "12px",
            cursor: "pointer",
            borderRadius: "12px",
            background: currentTheme.colors.background,
            border: "none",
            marginBottom: "8px",
          }}
          onClick={() => {
            router.push(`/friends/details/${user.username}`);
          }}
        >
          <List.Item.Meta
            avatar={
              <Badge dot={userStaus?.get(user.id)} offset={[-6, 35]} color="green">
                <Avatar src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} size={48} />
              </Badge>
            }
            title={user.username}
            description={
              <div style={{ color: currentTheme.colors.secondaryText }}>
                {userStaus?.get(user.id)
                  ? t("friends.online")
                  : t("friends.lastSeen") + new Date(user.updated_at || "").toLocaleString()}
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
    const res: any = await api.friends.getFriends();
    if (res.data?.friends) {
      console.log(res.data.friends.sort(() => -1));

      setUserList(res.data.friends);
      localStorage.setItem("userList", JSON.stringify(res.data.friends));
    }

    const resp = await api.user.getFriendsOnlineStatus();
    if (resp?.data?.onlineStatus) {
      console.log(resp);
      const status = new Map();
      resp.data.onlineStatus.forEach((item) => {
        status.set(item.user_id, item.online)
      })
      setUserStatus(status)
    }
  };

  return (
    <div style={{ padding: "20px", overflow: "auto" }}>
      <div
        style={{
          marginTop: "10px",
          marginBottom: "10px",
          display: "flex",
          gap: "16px",
          justifyContent: "space-between",
        }}
      >
      </div>

      <Tabs
        items={[
          {
            key: "all",
            label: t("friends.all"),
            children: renderUserList(userList.sort(() => 1)),
          },
          {
            key: "online",
            label: (
              <span>
                {t("friends.online")}
                <Badge
                  count={[].length}
                  style={{
                    marginLeft: "8px",
                    backgroundColor: currentTheme.colors.success,
                  }}
                />
              </span>
            ),
            children: renderUserList([]),
          },
          {
            key: "offline",
            label: t("friends.offline"),
            children: renderUserList([]),
          },
          {
            key: "addfriends",
            label: t("friends.add"),
            children: renderAddFriends(),
          },
        ]}
        onTabClick={(e) => {
          if (e === "all") {
            setDisable(true);
            return;
          }
          setDisable(false);
        }}
      />
    </div>
  );
}
