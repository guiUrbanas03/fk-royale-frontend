import { io, Socket } from "socket.io-client";
import { GameRoom } from "../models/game-room";
import { CreateRoomForm } from "../screens/LobbyScreen/LobbyScreen";

interface ServerToClientEvents {
}
  
interface ClientToServerEvents {
    "message": (data: string) => void;
}

interface GameRoomClientToServerEvents {
    "create_game_room": (data: CreateRoomForm) => void;
    "leave_game_room": () => void;
}

interface GameRoomServerToClientEvents {
    "create_game_room": (data: GameRoom) => void;
}

const socketIo: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:8000");

const gameRoomSocket: Socket<GameRoomServerToClientEvents, GameRoomClientToServerEvents> = io(`http://localhost:8000/game-room`);



export { socketIo, gameRoomSocket };
