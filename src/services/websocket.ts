export class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;

  public onMessage: ((data: any) => void) | null = null; // 允许外部监听 WebSocket 消息

  connect() {
    const userID = localStorage.getItem('userId');
    console.log(userID);


    this.ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}?userId=${userID}`);
    console.log(this.ws);


    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("收到消息:", data);

      if (this.onMessage) {
        this.onMessage(data); // 触发回调
      }
    };

    this.ws.onclose = () => {
      this.handleWebSocketClose();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
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
      console.log("发送消息:", message);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsManager = new WebSocketManager();