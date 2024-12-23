import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, LoginRequest } from "../../services/api";
import { setCurrentUser } from "./userSlice";

interface User {
  user_id: string;
  username: string;
  email: string;
  phone?: string;
  created_at: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginRequest, { dispatch }) => {
    const response = await api.auth.login(credentials);
    if (response.code === 200) {
      const { token, ...userData } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      dispatch(setCurrentUser(userData));

      return userData;
    }
    throw new Error(response.message);
  }
);

export const checkAuth = createAsyncThunk(
  "auth/check",
  async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await api.auth.me();
    if (response.code === 200) {
      return response.data;
    }
    throw new Error(response.message);
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (data: RegisterRequest) => {
    const response = await api.auth.register(data);
    if (response.code === 200) {
      localStorage.setItem("token", response.data.token);
      return response.data.user;
    }
    throw new Error(response.message);
  }
);

export const initAuth = createAsyncThunk(
  "auth/init",
  async (_, { dispatch }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }
    try {
      const response = await api.auth.me();
      if (response.code === 200) {
        return response.data;
      }
      throw new Error(response.message);
    } catch (error) {
      localStorage.removeItem("token");
      return null;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(initAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload;
        } else {
          state.isAuthenticated = false;
          state.user = null;
        }
        state.loading = false;
      })
      .addCase(initAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
        localStorage.removeItem("token");
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer; 