import io from 'socket.io-client'

class SocketConnectionService {
    socket; //client side socket variable
    isConnectedToRoom = false; // is connected to room
    isConnected = false; //server connection
    currentRoom;
    data;
    constructor() {}

    createConnection() {
        this.socket = io('https://colab-code-socket-server.herokuapp.com/'); // use env variables
        this.isConnected = true;
    }

    breakConnection() {
        this.socket.close();
        this.isConnected = false;
    }

    createRoom(roomId) {
        this.socket.emit('createRoom', roomId);
        this.isConnectedToRoom = true;
        this.currentRoom = roomId;
    }

    joinRoom(roomName) {
        this.socket.emit('joinRoom', roomName, this.roomAction);
        this.currentRoom = roomName;
    }

    sendData(data) {
        this.socket.emit('sendData', data);
    }

    leaveRoom(room){
        this.socket.emit('leaveRoom', room);
        this.isConnectedToRoom = false;
        this.currentRoom = undefined;
    }
}

export default new SocketConnectionService();