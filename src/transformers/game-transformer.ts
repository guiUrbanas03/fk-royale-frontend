import { Game, GameResource, GameSettings, GameSettingsResource } from "../models/game";

const toGame = (gameResource: GameResource): Game => {
    return {
        id: gameResource.id,
        status: gameResource.status,
        roomId: gameResource.room_id,
        settings: toGameSettings(gameResource.settings),
    }
}

const toGameSettings = (settingsResource: GameSettingsResource): GameSettings => {
    return {
        maxPlayers: settingsResource.max_players,
        lives: settingsResource.lives,
        turnTimeSeconds: settingsResource.turn_time_seconds,
    }
}

const toGameResource = (game: Game): GameResource => {
    return {
        id: game.id,
        status: game.status,
        room_id: game.roomId,
        settings: toGameSettingsResource(game.settings),
    }
}

const toGameSettingsResource = (gameSettings: GameSettings): GameSettingsResource => {
    return {
        max_players: gameSettings.maxPlayers,
        lives: gameSettings.lives,
        turn_time_seconds: gameSettings.turnTimeSeconds,
    }
}

export {
    toGame,
    toGameSettings,
    toGameResource,
    toGameSettingsResource,
}