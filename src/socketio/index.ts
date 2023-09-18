import {io, Socket} from 'socket.io-client';
import {CreateRoomForm} from '../screens/LobbyScreen/LobbyScreen';
import {getLocalTokens} from '../services/token-service';
import {Game} from '../models/game';
import {Player} from '../models/player';

type PlayerObject = {
  [key: Player['socket_id']]: Player;
};

type GameObject = {
  [key: Game['id']]: Game;
};

type GameState = {
  games: GameObject;
  players: PlayerObject;
  current_player?: Player;
};

type GameAndRoom = {
  game: Game;
  player: Player;
};

interface GameRoomClientToServerEvents {
  create_game_room: (data: CreateRoomForm) => void;
  join_game_room: (data: Game) => void;
  leave_game_room: (data: Game) => void;
}

interface GameRoomServerToClientEvents {
  create_game_room: (data: GameAndRoom) => void;
  join_game_room: (data: GameAndRoom) => void;
  leave_game_room: (data: GameAndRoom) => void;
  fetch_state: (data: GameState) => void;
  add_player: (data: Player) => void;
  add_game: (data: Game) => void;
  remove_game: (data: Game) => void;
  add_to_room: (data: GameAndRoom) => void;
  remove_from_room: (data: GameAndRoom) => void;
}

const gameRoomSocket: Socket<
  GameRoomServerToClientEvents,
  GameRoomClientToServerEvents
> = io('http://localhost:8000/', {
  auth: async cb => {
    const tokens = await getLocalTokens();
    cb({token: tokens?.accessToken});
  },
});

export {
  gameRoomSocket,
  type GameState,
  type GameObject,
  type PlayerObject,
  type GameAndRoom,
};
