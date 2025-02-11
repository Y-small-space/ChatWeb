import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, LoginRequest } from "../../services/api"; // 引入API请求和LoginRequest类型
import { setCurrentUser } from "./userSlice"; // 引入设置用户的 action

// 定义用户信息的接口
interface User {
  user_id: string;
  username: string;
  email: string;
  phone?: string;
  created_at: string;
}

// 定义认证状态的接口
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// 初始化认证状态
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

// 创建登录的异步 Thunk action
export const login = createAsyncThunk(
  "auth/login", // 定义 action 类型
  async (credentials: LoginRequest, { dispatch }) => {
    const response = await api.auth.login(credentials); // 调用登录 API
    if (response.code === 200) { // 如果登录成功
      const { token, ...userData } = response.data; // 拿到 token 和用户数据
      localStorage.setItem("token", token); // 将 token 存储到 localStorage
      localStorage.setItem("user", JSON.stringify(userData)); // 存储用户信息

      dispatch(setCurrentUser(userData)); // 设置当前用户信息

      return userData; // 返回用户数据
    }
    throw new Error(response.message); // 登录失败，抛出错误
  }
);

// 创建检查认证的异步 Thunk action
export const checkAuth = createAsyncThunk(
  "auth/check",
  async () => {
    const token = localStorage.getItem("token"); // 从 localStorage 获取 token
    if (!token) throw new Error("No token found"); // 如果没有 token，抛出错误

    const response = await api.auth.me(); // 调用 API 检查当前用户信息
    if (response.code === 200) {
      return response.data; // 返回用户数据
    }
    throw new Error(response.message); // 如果 API 返回错误，抛出错误
  }
);

// 创建注册的异步 Thunk action
export const register = createAsyncThunk(
  "auth/register",
  async (data: RegisterRequest) => {
    const response = await api.auth.register(data); // 调用注册 API
    if (response.code === 200) { // 注册成功
      localStorage.setItem("token", response.data.token); // 将 token 存储到 localStorage
      return response.data.user; // 返回用户数据
    }
    throw new Error(response.message); // 注册失败，抛出错误
  }
);

// 创建初始化认证的异步 Thunk action
export const initAuth = createAsyncThunk(
  "auth/init",
  async (_, { dispatch }) => {
    const token = localStorage.getItem("token"); // 获取 token
    if (!token) {
      return null; // 如果没有 token，返回 null
    }
    try {
      const response = await api.auth.me(); // 调用 API 获取当前用户信息
      if (response.code === 200) {
        return response.data; // 返回用户数据
      }
      throw new Error(response.message); // 如果 API 返回错误，抛出错误
    } catch (error) {
      localStorage.removeItem("token"); // 捕获错误时，移除 token
      return null; // 返回 null
    }
  }
);

// 创建 authSlice，包含认证相关的 reducer 和异步 action 的处理逻辑
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 用户退出
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("token"); // 清除 localStorage 中的 token
    },
  },
  extraReducers: (builder) => {
    // 处理异步 action 的状态
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true; // 登录成功，认证状态为 true
        state.user = action.payload; // 设置当前用户信息
        state.loading = false; // 设置加载状态为 false
        state.error = null; // 清除错误
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isAuthenticated = true; // 注册成功，认证状态为 true
        state.user = action.payload; // 设置当前用户信息
        state.loading = false; // 设置加载状态为 false
        state.error = null; // 清除错误
      })
      .addCase(initAuth.pending, (state) => {
        state.loading = true; // 初始化认证时，设置加载状态为 true
      })
      .addCase(initAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = true; // 如果有用户信息，认证状态为 true
          state.user = action.payload; // 设置当前用户信息
        } else {
          state.isAuthenticated = false; // 如果没有用户信息，认证状态为 false
          state.user = null; // 清除用户信息
        }
        state.loading = false; // 设置加载状态为 false
      })
      .addCase(initAuth.rejected, (state) => {
        state.isAuthenticated = false; // 如果初始化认证失败，认证状态为 false
        state.user = null; // 清除用户信息
        state.loading = false; // 设置加载状态为 false
        localStorage.removeItem("token"); // 清除 localStorage 中的 token
      });
  },
});

export const { logout } = authSlice.actions; // 导出退出登录的 action
export default authSlice.reducer; // 导出认证 reducer
