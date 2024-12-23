"use client";

import { useParams } from "next/navigation";
import ChatWindow from "../../../../../src/components/Chat/ChatWindow";

export default function GroupChatPage() {
  const { id } = useParams();

  return <ChatWindow type="group" id={id as string} />;
}
