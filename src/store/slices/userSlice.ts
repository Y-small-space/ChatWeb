import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export interface User {
  user_id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  created_at: string;
  status?: string;
}

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
};

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async () => {
    const response = await api.auth.me();
    if (response.code === 200) {
      return response.data;
    }
    throw new Error(response.message);
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (data: {
    username?: string;
    avatar?: string;
    phone?: string;
  }) => {
    const response = await api.user.updateProfile(data);
    if (response.code === 200) {
      return response.data;
    }
    throw new Error(response.message);
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.currentUser = null;
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.currentUser = {
          ...state.currentUser!,
          ...action.payload,
        };
      });
  },
});

export const { setCurrentUser, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer; 