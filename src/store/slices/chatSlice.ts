import { createSlice } from "@reduxjs/toolkit";

export interface Message {
  id: string;
  type: "text" | "image" | "file";
  content: string;
  sender_id: string;
  receiver_id?: string;
  group_id?: string;
  created_at: string;
  updated_at: string;
  status: "sent" | "delivered" | "read";
  recalled?: boolean;
  reply_to?: string;
  forward_from?: string;
  sender?: {
    user_id: string;
    nickname: string;
    avatar?: string;
  };
  read_by?: Array<{
    user_id: string;
    nickname: string;
    read_at: string;
  }>;
}

interface ChatState {
  messages: { [key: string]: Message[] };
  loading: boolean;
  error: string | null;
  typingUsers: { [key: string]: Set<string> };
  userStatuses: { [key: string]: 'online' | 'offline' };
}

const initialState: ChatState = {
  messages: {},
  loading: false,
  error: null,
  typingUsers: {},
  userStatuses: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    updateMessageStatus: (state, action) => {
      const { messageId, status, readBy } = action.payload;
      Object.keys(state.messages).forEach((chatId) => {
        const message = state.messages[chatId].find((m) => m.id === messageId);
        if (message) {
          message.status = status;
          if (readBy) {
            message.read_by = [...(message.read_by || []), readBy];
          }
        }
      });
    },
    addMessage: (state, action) => {
      const message = action.payload;
      const chatId = message.group_id || message.receiver_id || message.sender_id;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(message);
    },
    setTypingStatus: (state, action) => {
      const { chatId, userId, isTyping } = action.payload;
      if (!state.typingUsers[chatId]) {
        state.typingUsers[chatId] = new Set();
      }

      if (isTyping) {
        state.typingUsers[chatId].add(userId);
      } else {
        state.typingUsers[chatId].delete(userId);
      }
    },
    updateUserStatus: (state, action) => {
      const { userId, status } = action.payload;
      state.userStatuses[userId] = status;
    },
    clearTypingStatus: (state, action) => {
      const { chatId } = action.payload;
      if (state.typingUsers[chatId]) {
        state.typingUsers[chatId].clear();
      }
    },
  },
});

export const {
  updateMessageStatus,
  addMessage,
  setTypingStatus,
  updateUserStatus,
  clearTypingStatus,
} = chatSlice.actions;
export default chatSlice.reducer;