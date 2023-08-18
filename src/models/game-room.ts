class GameRoom {
    public id: string;
    public player_id: string;
    public name: string;
    public password?: string;
    public max_players: number;
    public hearts: number ;
    public turn_time_seconds: number;

    constructor(gameRoom: GameRoom) {
        const { id, player_id, name, password, max_players, hearts, turn_time_seconds } = gameRoom;

        this.id = id
        this.player_id = player_id
        this.name = name
        this.password = password
        this.max_players = max_players
        this.hearts = hearts
        this.turn_time_seconds = turn_time_seconds
    }
}

export { GameRoom };