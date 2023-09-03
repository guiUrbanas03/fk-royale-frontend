import {io, Socket} from 'socket.io-client';
import {CreateRoomForm} from '../screens/LobbyScreen/LobbyScreen';
import {getLocalTokens} from '../services/token-service';
import {Game} from '../models/game';
import {Player} from '../models/player';

type State = {
  games: Game[];
  current_player?: Player;
};

interface GameRoomClientToServerEvents {
  create_game_room: (data: CreateRoomForm) => void;
  join_game_room: (data: Game) => void;
  leave_game_room: (data: Game) => void;
}

interface GameRoomServerToClientEvents {
  create_game_room: (data: Game) => void;
  join_game_room: (data: Game) => void;
  leave_game_room: (data: Game) => void;
  fetch_state: (data: State) => void;
}

const gameRoomSocket: Socket<
  GameRoomServerToClientEvents,
  GameRoomClientToServerEvents
> = io('http://localhost:8000/game-room', {
  auth: async cb => {
    const tokens = await getLocalTokens();
    cb({token: tokens?.accessToken});
  },
});

export {gameRoomSocket, type State};
