import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import chatReducer from "./slices/chatSlice";
import websocketReducer from "./slices/websocketSlice";
import groupsReducer from "./slices/groupsSlice";
import userReducer from "./slices/userSlice";
import friendsReducer from "./slices/friendsSlice";


export const store = configureStore({
  reducer: {
    chat: chatReducer,
    websocket: websocketReducer,
    groups: groupsReducer,
    user: userReducer,
    friends: friendsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          'persist/PERSIST',
          'persist/REHYDRATE'
        ],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 