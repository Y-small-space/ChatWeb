"use client";

import { useState } from "react";
import { Input, Avatar, Badge, List, Button, Modal, message } from "antd";
import { SearchOutlined, UserAddOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../src/store";
import { useLanguage } from "../../../src/contexts/LanguageContext";
import { api } from "../../../src/services/api";
import { debounce } from "lodash";
import { addFriend } from "../../../src/store/slices/friendsSlice";

const { Search } = Input;
import { mockFriends } from "../../../src/mock/data";
const listItemStyle = {
  padding: "12px 20px",
  cursor: "pointer",
  transition: "background-color 0.3s",
  borderRadius: "8px",
  margin: "4px 0",
};

interface SearchResult {
  user_id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  created_at: string;
  isFriend: boolean;
}

export default function FriendsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { friends } = useSelector((state: RootState) => state.friends);

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SearchResult | null>(null);

  // 搜索处理函数
  const handleSearch = debounce(async (value: string) => {
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      // 先在现有好友中搜索
      const localResult = mockFriends.find(
        (friend) =>
          friend.name.toLowerCase().includes(value.toLowerCase()) ||
          friend.email?.toLowerCase().includes(value.toLowerCase()) ||
          friend.phone?.includes(value)
      );

      if (localResult) {
        setSearchResults([
          {
            user_id: localResult.id,
            username: localResult.name,
            email: localResult.email || "",
            avatar: localResult.avatar,
            created_at: new Date().toISOString(),
            isFriend: true,
          },
        ]);
      } else {
        // 如果本地没有结果，搜索所有用户
        const response = await api.friends.searchUser(value);
        if (response.code === 200) {
          const { user } = response.data;
          // 检查搜索到的用户是否已经是好友
          const isFriend = mockFriends.some(
            (friend) => friend.id === user.user_id
          );
          setSearchResults([
            {
              ...user,
              isFriend,
            },
          ]);
        }
      }
    } catch (error) {
      message.error(t("friends.searchError"));
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, 500);

  // 处理添加好友
  const handleAddFriend = async () => {
    if (!selectedUser) return;

    try {
      await dispatch(addFriend(selectedUser.user_id)).unwrap();
      message.success(t("friends.addSuccess"));
      setShowAddModal(false);
      setSelectedUser(null);
    } catch (error) {
      message.error(t("friends.addError"));
    }
  };

  // 渲染列表项
  const renderListItem = (user: SearchResult) => (
    <List.Item
      style={listItemStyle}
      actions={[
        !user.isFriend && (
          <Button
            key="add"
            type="primary"
            icon={<UserAddOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedUser(user);
              setShowAddModal(true);
            }}
          >
            {t("friends.add")}
          </Button>
        ),
      ]}
      onClick={() => {
        if (user.isFriend) {
          router.push(`/chat/${user.user_id}`);
        }
      }}
    >
      <List.Item.Meta
        avatar={
          <Badge dot={user.isFriend} offset={[-6, 28]} color="green">
            <Avatar src={user.avatar} size={48}>
              {/* {user.username[0]?.toUpperCase()} */}
            </Avatar>
          </Badge>
        }
        title={user.username}
        description={
          <div>
            <div>{user.email}</div>
            {user.phone && <div>{user.phone}</div>}
            <div>
              {user.isFriend
                ? t("friends.alreadyFriend")
                : t("friends.notFriend")}
            </div>
          </div>
        }
      />
    </List.Item>
  );

  return (
    <div style={{ height: "100%", padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", fontSize: "18px", fontWeight: 500 }}>
        {t("friends.title")}
      </h2>

      <Search
        placeholder={t("friends.searchPlaceholder")}
        allowClear
        enterButton={<SearchOutlined />}
        loading={loading}
        onChange={(e) => {
          const value = e.target.value;
          setSearchText(value);
          if (!value.trim()) {
            setSearchResults([]);
          }
        }}
        onSearch={(value) => {
          setSearchText(value);
          if (value.trim()) {
            handleSearch(value);
          }
        }}
        style={{ marginBottom: 16 }}
      />

      <List
        // dataSource={searchText ? searchResults : friends}
        dataSource={searchText ? searchResults : mockFriends}
        renderItem={renderListItem}
        locale={{
          emptyText: searchText
            ? t("friends.noResults")
            : t("friends.noFriends"),
        }}
      />

      <Modal
        title={t("friends.addFriendTitle")}
        open={showAddModal}
        onOk={handleAddFriend}
        onCancel={() => {
          setShowAddModal(false);
          setSelectedUser(null);
        }}
      >
        <p>
          {t("friends.addFriendConfirm", { "0": selectedUser?.username || "" })}
        </p>
      </Modal>
    </div>
  );
}
