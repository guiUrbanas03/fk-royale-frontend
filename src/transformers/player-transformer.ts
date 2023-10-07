import { Player, PlayerResource } from "../models/player";

const toPlayer = (playerResource: PlayerResource): Player => {
    return {
        socketId: playerResource.socket_id,
        user: playerResource.user,
        currentGameId: playerResource.current_game_id,
        status: playerResource.status,
    }
}

const toPlayerResource = (player: Player): PlayerResource => {
    return {
        socket_id: player.socketId,
        user: player.user,
        current_game_id: player.currentGameId,
        status: player.status,
    }
}

export {
    toPlayer,
    toPlayerResource,
}