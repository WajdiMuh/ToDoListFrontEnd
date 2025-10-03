import { io, ManagerOptions, Socket, SocketOptions } from "socket.io-client";
import { environment } from "../environments/environment";

const io_options:Partial<ManagerOptions & SocketOptions> = {
    autoConnect: false,
    transports: ['websocket', 'polling', 'webtransport']
};

export const SOCKET_TIMEOUT:number = 3000;

export class socket_api_calls {
  protected socket!: Socket;

  constructor(endpoint: string)
  {
    this.socket = io(environment.backendURL + endpoint, io_options);
  }

  connect() {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }
}
