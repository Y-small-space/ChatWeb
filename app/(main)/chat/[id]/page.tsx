"use client";

import { useParams } from "next/navigation";
import ChatWindow from "../../../../src/components/Chat/ChatWindow";
import { getChatInfo } from "../../../../src/mock/chatData";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState();
  const chatId = Array.isArray(id) ? id[0] : id;

  const getUserInfo = async () => {
    const userList = localStorage.getItem("userList");
    const user = JSON.parse(userList)?.find((user) => user.id === chatId);

    setUserInfo(user);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return <ChatWindow type="private" id={chatId} chatInfo={userInfo} />;
}
