import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

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

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (data: {
    type: "text" | "image" | "file";
    content: string;
    receiver_id?: string;
    group_id?: string;
    reply_to?: string;
    forward_from?: string;
  }) => {
    const response = await api.chat.sendMessage(data);
    if (response.code === 200) {
      return response.data;
    }
    throw new Error(response.message);
  }
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (params: {
    receiver_id?: string;
    group_id?: string;
    before?: string;
    limit?: number;
  }) => {
    const response = await api.chat.getMessages(params);
    if (response.code === 200) {
      return {
        messages: response.data,
        chatId: params.receiver_id || params.group_id,
      };
    }
    throw new Error(response.message);
  }
);

export const recallMessage = createAsyncThunk(
  "chat/recallMessage",
  async ({ messageId }: { messageId: string }) => {
    const response = await api.chat.recallMessage(messageId);
    if (response.code === 200) {
      return messageId;
    }
    throw new Error(response.message);
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.fulfilled, (state, action) => {
        const message = action.payload;
        const chatId = message.group_id || message.receiver_id;
        if (!state.messages[chatId]) {
          state.messages[chatId] = [];
        }
        state.messages[chatId].push(message);
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { messages, chatId } = action.payload;
        if (!state.messages[chatId]) {
          state.messages[chatId] = [];
        }
        state.messages[chatId] = [...messages, ...state.messages[chatId]];
      })
      .addCase(recallMessage.fulfilled, (state, action) => {
        const messageId = action.payload;
        Object.keys(state.messages).forEach((chatId) => {
          const message = state.messages[chatId].find((m) => m.id === messageId);
          if (message) {
            message.recalled = true;
          }
        });
      });
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