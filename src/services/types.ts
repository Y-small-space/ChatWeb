// 用户相关类型
export interface User {
  id: string;
  email: string;
  phone: string;
  nickname: string;
  avatar: string;
  status?: string;
  online?: boolean;
  last_seen?: string;
  created_at: string;
}

export interface RegisterRequest {
  email: string;
  phone: string;
  password: string;
  nickname: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  nickname?: string;
  avatar?: string;
  status?: string;
}

// 消息相关类型
export interface Message {
  id: string;
  type: "text" | "image" | "file";
  content: string;
  sender_id: string;
  receiver_id?: string;
  group_id?: string;
  created_at: string;
  status: "sent" | "delivered" | "read";
  read_by?: Array<{
    user_id: string;
    read_at: string;
  }>;
}

export interface SendMessageRequest {
  type: "text" | "image" | "file";
  content: string;
  receiver_id?: string;
  group_id?: string;
}

export interface GetMessagesRequest {
  receiver_id?: string;
  group_id?: string;
  limit?: number;
  offset?: number;
}

export interface MarkMessagesReadRequest {
  message_ids: string[];
}

// WebSocket 消息类型
export interface WebSocketMessage {
  type: 'chat' | 'read' | 'typing' | 'online' | 'auth' | 'ping' | 'pong';
  content: {
    // 聊天消息
    message_id?: string;
    type?: 'text' | 'image' | 'file';
    content?: string;
    sender_id?: string;
    receiver_id?: string;
    group_id?: string;
    created_at?: string;

    // 已读状态
    read_by?: Array<{
      user_id: string;
      read_at: string;
    }>;

    // 在线状态
    user_id?: string;
    online?: boolean;
    last_seen?: string;

    // 输入状态
    chat_id?: string;
    typing?: boolean;

    // 认证
    token?: string;
  };
} 