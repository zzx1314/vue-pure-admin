class WebSocketClient {
  private _connection: WebSocket | null = null;

  /**
   * 根据location路径生成WebSocket地址
   * @returns {string} WebSocket地址
   */
  getWebSocketUrl(): string {
    let protocol = "ws://";
    if (window.location.protocol === "https:") {
      protocol = "wss://";
    }
    return protocol + window.location.host + "/shell";
  }

  /**
   * 连接WebSocket
   * @param params
   */
  connect(params: {
    onConnect: () => void;
    onData: (data: string) => void;
    onClose: () => void;
    onError: (error: string) => void;
  }): void {
    if (window.WebSocket) {
      // 如果支持websocket
      this._connection = new WebSocket(this.getWebSocketUrl());
    } else {
      // 否则报错
      params.onError("WebSocket Not Supported");
      return;
    }

    this._connection.onopen = () => {
      params.onConnect();
    };

    this._connection.onmessage = evt => {
      const data = evt.data.toString();
      params.onData(data);
    };

    this._connection.onclose = () => {
      params.onClose();
    };
  }

  /**
   * 发送指令
   * @param {Object} params 指令参数（必须含有operate参数）
   */
  send(params: object): void {
    if (this._connection) {
      this._connection.send(JSON.stringify(params));
    }
  }

  /**
   * 发送普通操作指令
   * @param {String} data 操作指令
   */
  sendClientData(data: string): void {
    // 发送指令
    if (this._connection) {
      this._connection.send(
        JSON.stringify({ operate: "command", command: data })
      );
    }
  }
}

export default WebSocketClient;
