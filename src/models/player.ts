import {FullUserResource} from '../api/auth/auth';
import { GameResource } from './game';

type PlayerStatus = 'idle' | 'unready' | 'ready' | 'playing';

interface Player {
  socketId: PlayerResource['socket_id'];
  user: PlayerResource['user'];
  currentGameId?: PlayerResource['current_game_id'];
  status: PlayerResource['status'];
}

interface PlayerResource {
  socket_id: string;
  user: FullUserResource;
  current_game_id?: GameResource['id'];
  status: PlayerStatus;
}

export {
  type Player,
  type PlayerResource,
  type PlayerStatus, 
};
