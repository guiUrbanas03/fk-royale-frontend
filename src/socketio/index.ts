import {io, Socket} from 'socket.io-client';
import {GameRoom} from '../models/game-room';
import {CreateRoomForm} from '../screens/LobbyScreen/LobbyScreen';

interface GameRoomClientToServerEvents {
  create_game_room: (data: CreateRoomForm) => void;
  leave_game_room: (data: GameRoom) => void;
}

interface GameRoomServerToClientEvents {
  create_game_room: (data: GameRoom) => void;
  leave_game_room: (data: GameRoom) => void;
  test: (data: string) => void;
}

const gameRoomSocket: Socket<
  GameRoomServerToClientEvents,
  GameRoomClientToServerEvents
> = io('http://localhost:8000/game-room');

export {gameRoomSocket};
