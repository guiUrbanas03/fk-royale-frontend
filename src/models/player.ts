import {FullUserResource} from '../api/auth/auth';
import {Game} from './game';

type PlayerStatus = 'idle' | 'unready' | 'ready' | 'playing';

class Player {
  public socket_id: string;
  public user: FullUserResource;
  public current_game?: Game;
  public status: PlayerStatus;

  constructor(playerConstructor: Player) {
    const {socket_id, user, current_game} = playerConstructor;

    this.socket_id = socket_id;
    this.user = user;
    this.current_game = current_game;
    this.status = 'idle';
  }

  public static buildPlayer(data: Player) {
    let currentGame = data.current_game;

    if (currentGame && data.current_game) {
      currentGame = new Game(data.current_game);
    }

    return new Player({...data, current_game: currentGame});
  }
}

export {Player, type PlayerStatus};
