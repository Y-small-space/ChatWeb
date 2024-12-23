import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WebSocketState {
  connected: boolean;
  reconnecting: boolean;
  error: string | null;
}

const initialState: WebSocketState = {
  connected: false,
  reconnecting: false,
  error: null,
};

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
      state.reconnecting = false;
      state.error = null;
    },
    setReconnecting: (state, action: PayloadAction<boolean>) => {
      state.reconnecting = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setConnected, setReconnecting, setError } = websocketSlice.actions;
export default websocketSlice.reducer; 