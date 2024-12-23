"use client";

import React from "react";
import { List, Avatar, Badge } from "antd";
import { User } from "../../types/chat";

interface FriendsListProps {
  friends: User[];
  onSelectFriend: (friend: User) => void;
}

export const FriendsList: React.FC<FriendsListProps> = ({
  friends,
  onSelectFriend,
}) => {
  return (
    <List
      className="friends-list"
      itemLayout="horizontal"
      dataSource={friends}
      renderItem={(friend) => (
        <List.Item
          className="cursor-pointer hover:bg-gray-50 px-4"
          onClick={() => onSelectFriend(friend)}
        >
          <List.Item.Meta
            avatar={
              <Badge status="success" offset={[-6, 28]}>
                <Avatar src={friend.avatar} size="large" />
              </Badge>
            }
            title={friend.name}
            description="上次在线时间"
          />
        </List.Item>
      )}
    />
  );
};
