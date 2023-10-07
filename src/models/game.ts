import { RoomResource } from "./room";

type GameStatus = 'waiting' | 'playing';

interface Game {
  id: GameResource['id'];
  status: GameResource['status'];
  roomId: GameResource['room_id'];
  settings: GameSettings;
}

interface GameSettings {
  maxPlayers: GameSettingsResource['max_players'];
  lives: GameSettingsResource['lives'];
  turnTimeSeconds: GameSettingsResource['turn_time_seconds'];
}

interface GameResource {
  id: string;
  status: GameStatus;
  room_id: RoomResource['id'];
  settings: GameSettingsResource;
}

interface GameSettingsResource {
  max_players: number;
  lives: number;
  turn_time_seconds: number;
}

export {
  type Game,
  type GameSettings,
  type GameResource, 
  type GameSettingsResource,
  type GameStatus, 
};


