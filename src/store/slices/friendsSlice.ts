import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

export interface Friend {
  user_id: string;
  username: string;
  nickname: string;
  avatar?: string;
  status?: string;
  online?: boolean;
  last_seen?: string;
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

export const fetchFriends = createAsyncThunk(
  "friends/fetchFriends",
  async () => {
    const response = await api.friends.getFriends();
    if (response.code === 200) {
      return response.data;
    }
    throw new Error(response.message);
  }
);

export const addFriend = createAsyncThunk(
  "friends/addFriend",
  async (userId: string) => {
    const response = await api.friends.addFriend(userId);
    if (response.code === 200) {
      return response.data;
    }
    throw new Error(response.message);
  }
);

export const removeFriend = createAsyncThunk(
  "friends/removeFriend",
  async (userId: string) => {
    const response = await api.friends.removeFriend(userId);
    if (response.code === 200) {
      return userId;
    }
    throw new Error(response.message);
  }
);

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    updateFriendStatus: (state, action) => {
      const { userId, online, lastSeen } = action.payload;
      const friend = state.friends.find(f => f.user_id === userId);
      if (friend) {
        friend.online = online;
        if (lastSeen) {
          friend.last_seen = lastSeen;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.friends = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch friends";
      })
      .addCase(addFriend.fulfilled, (state, action) => {
        state.friends.push(action.payload);
      })
      .addCase(removeFriend.fulfilled, (state, action) => {
        state.friends = state.friends.filter(
          (friend) => friend.user_id !== action.payload
        );
      });
  },
});

export const { updateFriendStatus } = friendsSlice.actions;
export default friendsSlice.reducer; 