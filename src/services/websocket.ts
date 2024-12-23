import { store } from '../store';
import {
  addMessage,
  updateMessageStatus,
  setTypingStatus,
  updateUserStatus,
} from '../store/slices/chatSlice';

class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;

  connect() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`);

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleWebSocketMessage(data);
    };

    this.ws.onclose = () => {
      this.handleWebSocketClose();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private handleWebSocketMessage(data: any) {
    switch (data.type) {
      case 'message':
        store.dispatch(addMessage(data.payload));
        break;
      case 'messageStatus':
        store.dispatch(updateMessageStatus(data.payload));
        break;
      case 'typing':
        store.dispatch(setTypingStatus({
          chatId: data.payload.chatId,
          userId: data.payload.userId,
          isTyping: data.payload.isTyping,
        }));
        break;
      case 'userStatus':
        store.dispatch(updateUserStatus({
          userId: data.payload.userId,
          status: data.payload.status,
        }));
        break;
    }
  }

  private handleWebSocketClose() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, this.reconnectTimeout * this.reconnectAttempts);
    }
  }

  sendMessage(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  sendTypingStatus(chatId: string, isTyping: boolean) {
    this.sendMessage({
      type: 'typing',
      payload: {
        chatId,
        isTyping,
      },
    });
  }

  markMessagesAsRead(messageIds: string[]) {
    this.sendMessage({
      type: 'markRead',
      payload: {
        messageIds,
      },
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsManager = new WebSocketManager(); 