import {Player} from './player';

class Room {
  public id: string;
  public name: string;
  public password?: string;
  public owner: Player;
  public players: Player[];

  constructor(room: Room) {
    const {id, owner, name, password, players = []} = room;

    this.id = id;
    this.owner = owner;
    this.name = name;
    this.password = password;
    this.players = players;
  }

  public static buildRoom(data: Room) {
    const owner = Player.buildPlayer(data.owner);
    const players = data.players.map(player => new Player(player));

    return new Room({...data, owner, players});
  }
}

export {Room};
