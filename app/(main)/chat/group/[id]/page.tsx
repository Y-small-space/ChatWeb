"use client";

import { useParams } from "next/navigation";
import ChatWindow from "../../../../../src/components/Chat/ChatWindow";

export default function GroupChatPage() {
  const { id } = useParams();
  const chatId = Array.isArray(id) ? id[0] : id;
  const isGroup = true;

  return (
    // <ChatWindow type="group" id={chatId} messages={[]} chatInfo={chatInfo} />
    <></>
  );
}
