import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

export interface Friend {
  id: string;
  username: string;
  email: string;
  phone?: string;
  created_at: string;
}

interface FriendsState {
  friends: Friend[];
  loading: boolean;
  error: string | null;
}

const initialState: FriendsState = {
  friends: [],
  loading: false,
  error: null,
};

// 获取好友列表
export const fetchFriends = createAsyncThunk(
  "v1/friends/fetchFriends",
  async () => {
    const response = await api.friends.getFriends();
    return response.data.friends;
  }
);

// 发送好友请求
export const sendFriendRequest = createAsyncThunk(
  "v1/friends/sendRequest",
  async (friendId: string) => {
    await api.friends.sendRequest(friendId);
    return friendId;
  }
);

// 处理好友请求
export const handleFriendRequest = createAsyncThunk(
  "v1/friends/handleRequest",
  async ({ requestId, accept }: { requestId: string; accept: boolean }) => {
    await api.friends.handleRequest(requestId, accept);
    return requestId;
  }
);

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.friends = action.payload;
        state.loading = false;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch friends";
      });
  },
});

export default friendsSlice.reducer; 