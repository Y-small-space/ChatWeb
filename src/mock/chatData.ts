// 聊天类型定义
export interface ChatMessage {
  id: string;
  type: "text" | "image" | "file";
  content: string;
  sender_id: string;
  receiver_id?: string;
  group_id?: string;
  created_at: string;
  status: "sent" | "delivered" | "read";
  recalled?: boolean;
  reply_to?: string;
  file_info?: {
    name: string;
    size: number;
    type: string;
    url: string;
  };
}

export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  last_seen?: string;
}

export interface GroupChat {
  id: string;
  name: string;
  avatar: string;
  members: ChatUser[];
  created_at: string;
  owner_id: string;
  description?: string;
  announcement?: string;
}


export const mockPrivateMessages = []
export const mockGroupMessages = []

// 获取聊天记录的辅助函数
// export const getChatMessages = (chatId: string, isGroup: boolean = false) => {
//   if (isGroup) {
//     return mockGroupMessages[chatId] || [];
//   }
//   return mockPrivateMessages[chatId] || [];
// };

// 获取聊天对象信息的辅助函数
export const getChatInfo = (chatId: string) => {

  return ;
}; 