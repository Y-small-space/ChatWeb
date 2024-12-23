import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage/session"; // 使用 sessionStorage
import authReducer from "./slices/authSlice";
import chatReducer from "./slices/chatSlice";
import websocketReducer from "./slices/websocketSlice";
import groupsReducer from "./slices/groupsSlice";
import userReducer from "./slices/userSlice";
import friendsReducer from "./slices/friendsSlice";

// 配置 persist
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['isAuthenticated', 'user'] // 只持久化这些字段
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    chat: chatReducer,
    websocket: websocketReducer,
    groups: groupsReducer,
    user: userReducer,
    friends: friendsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // 忽略 persist action
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 