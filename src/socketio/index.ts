import {io, Socket} from 'socket.io-client';
import {CreateRoomForm} from '../screens/LobbyScreen/LobbyScreen';
import {getLocalTokens} from '../services/token-service';
import { Player, PlayerResource } from '../models/player';
import { Game, GameResource } from '../models/game';
import { Room, RoomResource } from '../models/room';

type ObjectMap<KeyType extends PropertyKey, ValueType> = {
  [key in KeyType]: ValueType;
};

type PlayerObject = ObjectMap<Player['socketId'], Player>;
type GameObject = ObjectMap<Game['id'], Game>;
type RoomObject = ObjectMap<Room['id'], Room>;

type PlayerResourceObject = ObjectMap<PlayerResource['socket_id'], PlayerResource>
type GameResourceObject = ObjectMap<GameResource['id'], GameResource>
type RoomResourceObject = ObjectMap<RoomResource['id'], RoomResource>

type GameStateResource = {
  players: PlayerResourceObject;
  games: GameResourceObject;
  rooms: RoomResourceObject;
};

type GameState = {
  games: GameObject;
  players: PlayerObject;
  rooms: RoomObject;
};

type GamePayloadResource = {
  player: PlayerResource;
  game: GameResource;
  room: RoomResource;
};

type RemovedGameResource = {
  players: PlayerResource[];
  game: GameResource;
  room: RoomResource;
}



interface GameRoomClientToServerEvents {
  create_game_room: (data: CreateRoomForm) => void;
  join_game_room: (data: { game_id: string}) => void;
  leave_game_room: (data: { game_id: string}) => void;
}

interface GameRoomServerToClientEvents {
  fetch_state: (data: GameStateResource) => void;
  add_player: (data: PlayerResource) => void;
  add_game: (data: GamePayloadResource) => void;
  add_player_to_room: (data: GamePayloadResource) => void;
  remove_player_from_room: (data: GamePayloadResource) => void;
  remove_game: (data: RemovedGameResource) => void;
}

const socketIO: Socket<
  GameRoomServerToClientEvents,
  GameRoomClientToServerEvents
> = io('http://localhost:8000/', {
  auth: async cb => {
    const tokens = await getLocalTokens();
    cb({token: tokens?.accessToken});
  },
});

export {
  socketIO,
  type GameState,
  type GameObject,
  type PlayerObject,
  type RoomObject,
  type GamePayloadResource,
  type GameStateResource,
  type RemovedGameResource,
};
