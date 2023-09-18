import {Room} from './room';

type GameStatus = 'waiting' | 'playing';

class GameSettings {
  public max_players: number;
  public lives: number;
  public turn_time_seconds: number;

  constructor(gameSettingsConstructor: GameSettings) {
    const {max_players, lives, turn_time_seconds} = gameSettingsConstructor;

    this.max_players = max_players;
    this.lives = lives;
    this.turn_time_seconds = turn_time_seconds;
  }
}

class Game {
  public id: string;
  public status: GameStatus;
  public room: Room;
  public settings: GameSettings;

  constructor(gameConstructor: Omit<Game, 'status'>) {
    const {id, room, settings} = gameConstructor;
    this.id = id;
    this.room = room;
    this.settings = settings;
    this.status = 'waiting';
  }

  public static buildGame(data: Game) {
    const room = Room.buildRoom(data.room);
    const settings = new GameSettings(data.settings);
    return new Game({...data, settings, room});
  }
}

export {Game, GameSettings, type GameStatus};
