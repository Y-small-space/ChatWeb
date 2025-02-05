"use client";

import { useParams } from "next/navigation";
import ChatWindow from "../../../../src/components/Chat/ChatWindow";
import { getChatMessages, getChatInfo } from "../../../../src/mock/chatData";

export default function ChatPage() {
  const { id } = useParams();
  const chatId = Array.isArray(id) ? id[0] : id;
  const isGroup = false;

  const messages = getChatMessages(chatId, isGroup);
  const chatInfo = getChatInfo(chatId, isGroup);

  if (!chatInfo) {
    return <div>聊天不存在</div>;
  }

  return (
    <ChatWindow
      type="private"
      id={chatId}
      messages={messages}
      chatInfo={chatInfo}
    />
  );
}
