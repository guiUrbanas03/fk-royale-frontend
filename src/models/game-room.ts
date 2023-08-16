class GameRoom {
    public id: string;
    public player_id: string;
    public name: string;
    public password?: string;
    public settings: GameRoomSettings;

    constructor(id: string, player_id: string, name: string, settings: GameRoomSettings, password?: string) {
        this.id = id;
        this.player_id = player_id;
        this.name = name;
        this.password = password;
        this.settings = settings
    }
}


class GameRoomSettings {
    public max_players: number;
    public hearts: number ;
    public turn_time_seconds: number;

    constructor(max_players: number = 8, hearts: number = 3, turn_time_seconds: number = 30) {
        this.max_players = max_players
        this.hearts = hearts
        this.turn_time_seconds = turn_time_seconds
    }
}


export { GameRoom, GameRoomSettings };