"use client";

import ChatWindow from "../../../../src/components/Chat/ChatWindow";
import { mockRecentChats } from "../../../../src/mock/data";

// 模拟消息数据
const mockMessages = [
  {
    id: "1",
    content: "你好！最近怎么样？",
    senderId: "2",
    timestamp: new Date(),
    sender: {
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
      name: "张三",
    },
  },
  {
    id: "2",
    content: "挺好的，在忙项目开发，你呢？",
    senderId: "1",
    timestamp: new Date(),
    sender: {
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
      name: "我",
    },
  },
  {
    id: "3",
    content: "我也是，最近在学习新技术，有空一起讨论下？",
    senderId: "2",
    timestamp: new Date(),
    sender: {
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
      name: "张三",
    },
  },
];

export default function ChatPage({ params }: { params: { id: string } }) {
  // 获取聊天对象信息
  const chatInfo = mockRecentChats.find((chat) => chat.id === params.id);

  if (!chatInfo) {
    return <div>聊天不存在</div>;
  }

  return (
    <div style={{ height: "100vh" }}>
      <ChatWindow
        messages={mockMessages}
        currentUser={{ id: "1", name: "我", avatar: "" }}
        chatInfo={{
          id: chatInfo.id,
          name: chatInfo.name,
          avatar: chatInfo.avatar,
          online: chatInfo.online,
          lastSeen: "最后在线时间：10分钟前",
        }}
      />
    </div>
  );
}
