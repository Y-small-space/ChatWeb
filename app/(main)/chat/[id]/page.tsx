"use client";
import { useParams } from "next/navigation";
import ChatWindow from "../../../../src/components/Chat/ChatWindow";
import { useEffect, useState } from "react";

interface user {
  created_at: string;
  email: string;
  id: string;
  phone: string;
  updated_at: string;
  username: string;
}

export default function ChatPage() {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState();

  const getUserInfo = async () => {
    const userList: string | null = localStorage.getItem("userList");
    console.log(userList);

    const user = userList
      ? JSON.parse(userList)?.find(
          (user: user) => String(user.id) === String(id)
        )
      : null;

    setUserInfo(user);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return <ChatWindow type="user" id={String(id)} chatInfo={userInfo} />;
}
