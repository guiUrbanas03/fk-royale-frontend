import { PlayerResource } from "./player";

interface Room {
  id: RoomResource['id'];
  name: RoomResource['name'];
  password?: RoomResource['password'];
  ownerId: RoomResource['owner_id'];
  playerIds: RoomResource['player_ids'];
}

interface RoomResource {
  id: string;
  name: string;
  password?: string;
  owner_id: PlayerResource['socket_id'];
  player_ids: PlayerResource['socket_id'][];
}

export { 
  type Room,
  type RoomResource,
};
